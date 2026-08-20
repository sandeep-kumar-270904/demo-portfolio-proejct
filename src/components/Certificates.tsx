import { BadgeCheck, ExternalLink } from "lucide-react";
import { useCertificates } from "@/hooks/useSupabase";
import { useSiteCopy } from "@/hooks/useSiteCopy";
import type { DbCertificate } from "@/data/certificatesFallback";

function isRealUrl(url: string | null | undefined) {
  if (!url) return false;
  const u = url.trim();
  if (!u || u === "#") return false;
  return /^https?:\/\//i.test(u);
}

function Card({ c, idx }: { c: DbCertificate; idx: number }) {
  const verified = isRealUrl(c.verify_url);
  return (
    <div
      className="reveal group flex h-full flex-col rounded-2xl border border-soft-2 bg-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-acid/40 hover:shadow-[0_25px_60px_-25px_rgba(0,255,179,0.28)]"
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {c.issuer_logo_url ? (
            <img
              src={c.issuer_logo_url}
              alt={`${c.issuer} logo`}
              loading="lazy"
              className="h-10 w-10 rounded-lg border border-soft-2 bg-surface object-contain p-1"
            />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-soft-2 bg-surface font-syne text-[15px] font-extrabold text-acid">
              {c.issuer.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {c.issuer}
            </div>
            {c.issue_date && (
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-2">
                {c.issue_date}
              </div>
            )}
          </div>
        </div>
        {verified && (
          <span className="inline-flex items-center gap-1 rounded-full border border-acid/40 bg-acid/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-acid">
            <BadgeCheck size={11} /> Verified
          </span>
        )}
      </div>

      <h3 className="mt-5 font-syne text-[19px] font-bold leading-snug text-ink">{c.title}</h3>

      <div className="mt-auto pt-6">
        {verified && (
          <a
            href={c.verify_url as string}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 transition-all hover:border-acid/50 hover:bg-acid/10 hover:text-acid"
          >
            Verify <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Certificates() {
  const { data: items = [] } = useCertificates();
  const { t } = useSiteCopy();

  if (items.length === 0) return null;

  return (
    <section id="certificates" className="relative bg-void px-6 py-14 lg:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
            {t("certificates_eyebrow", "03 / Credentials")}
          </span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(34px, 4.6vw, 58px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">{t("certificates_title_a", "Certificates ")}</span>
          <span className="text-grad-acid">{t("certificates_title_b", "& Badges")}</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <Card key={c.id} c={c} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
