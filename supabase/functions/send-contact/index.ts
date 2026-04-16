import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

// Owner inbox (where messages are delivered). Update via env var if desired.
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") ?? "sandeep@example.com";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(1).max(5000),
});

function escape(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const json = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const safeName = escape(name);
    const safeEmail = escape(email);
    const safeSubject = escape(subject || "(no subject)");
    const safeMessage = escape(message).replace(/\n/g, "<br>");

    // 1) Notify owner
    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0d0d18;">
        <h2 style="margin:0 0 16px;font-size:20px;">New portfolio inquiry</h2>
        <p style="margin:0 0 8px;"><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
        <p style="margin:0 0 16px;"><strong>Subject:</strong> ${safeSubject}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
        <div style="font-size:14px;line-height:1.7;color:#333;">${safeMessage}</div>
      </div>
    `;

    const ownerRes = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: `[Portfolio] ${subject || "New inquiry"} — from ${name}`,
        html: ownerHtml,
      }),
    });

    if (!ownerRes.ok) {
      const text = await ownerRes.text();
      throw new Error(`Owner email failed [${ownerRes.status}]: ${text}`);
    }

    // 2) Confirmation to sender
    const ackHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0d0d18;">
        <h2 style="margin:0 0 16px;font-size:20px;">Thanks for reaching out, ${safeName}.</h2>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.7;">
          I got your message and will reply within 24 hours.
        </p>
        <p style="margin:16px 0 8px;font-size:13px;color:#666;">For reference, here's what you sent:</p>
        <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #00ffb3;background:#f7faf9;font-size:14px;line-height:1.7;color:#333;">
          ${safeMessage}
        </blockquote>
        <p style="margin:24px 0 0;font-size:13px;color:#666;">— Sandeep</p>
      </div>
    `;

    await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Sandeep Kumar <onboarding@resend.dev>",
        to: [email],
        subject: "Thanks — I'll be in touch shortly",
        html: ackHtml,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("send-contact error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
