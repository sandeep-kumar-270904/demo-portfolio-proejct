// Reusable Supabase Storage image uploader.
// Validates type/size, uploads to a public bucket, and returns the public URL.
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  bucket: "avatars" | "project-images" | "testimonial-avatars" | "resume";
  value?: string | null;
  onChange: (publicUrl: string) => void;
  label?: string;
  prefix?: string; // optional filename prefix
  accept?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export default function ImageUploader({
  bucket,
  value,
  onChange,
  label = "Image",
  prefix = "file",
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Unsupported file type");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File must be under 5 MB");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${prefix}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        {value ? (
          accept.includes("pdf") ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-soft-2 bg-surface px-3 py-2 font-mono text-[11px] text-acid"
            >
              View file
            </a>
          ) : (
            <img
              src={value}
              alt="preview"
              className="h-16 w-16 rounded-lg border border-soft-2 object-cover"
            />
          )
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-soft-2 font-mono text-[10px] text-muted-foreground">
            none
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-md border border-soft-2 bg-surface px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/40 disabled:opacity-50"
          >
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 rounded-md border border-soft-2 bg-surface px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-nova/40 hover:text-nova"
            >
              Clear
            </button>
          )}
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Max 5 MB · jpg / png / webp{accept.includes("pdf") ? " / pdf" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
