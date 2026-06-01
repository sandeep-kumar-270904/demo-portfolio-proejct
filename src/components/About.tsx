import { MapPin, Globe2, Languages, Github, Linkedin, Twitter, Youtube, Instagram, Code2 } from "lucide-react";
import { SITE } from "@/config";
import { usePersonalInfo } from "@/hooks/useSupabase";
import { useSiteCopy } from "@/hooks/useSiteCopy";
import NowPlaying from "./NowPlaying";

function Trait({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="reveal group flex items-start gap-4 rounded-xl border border-soft-2 bg-card p-5 transition-all duration-300 hover:border-acid/40 hover:bg-acid/5">
      <div className="grid h-10 w-10 place-items-center rounded-lg border border-soft-2 bg-surface text-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-syne text-[16px] font-bold text-ink">{title}</h4>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{desc}</p>
      </div>
    </div>
  );
}

const SOCIAL_DEFS: { key: string; fallback: string; label: string; Icon: typeof Github }[] = [
  { key: "social_github", fallback: SITE.socials.github, label: "GitHub", Icon: Github },
  { key: "social_linkedin", fallback: SITE.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { key: "social_leetcode", fallback: SITE.socials.leetcode, label: "LeetCode", Icon: Code2 },
  { key: "social_twitter", fallback: SITE.socials.twitter, label: "X (Twitter)", Icon: Twitter },
  { key: "social_instagram", fallback: SITE.socials.instagram, label: "Instagram", Icon: Instagram },
  { key: "social_youtube", fallback: SITE.socials.youtube, label: "YouTube", Icon: Youtube },
];

export default function About() {
  const { data: info } = usePersonalInfo();
  const { t } = useSiteCopy();
  const photoUrl = info?.profile_photo_url;
  const socials = SOCIAL_DEFS.map((s) => ({ ...s, href: info?.[s.key] || s.fallback })).filter((s) => s.href);

  return (
    <section id="about" className="relative bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — square profile photo */}
        <div className="relative flex flex-col items-center lg:items-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-acid/30 via-cyan/10 to-plasma/20 blur-2xl opacity-60" />
            <div className="relative h-[320px] w-[320px] overflow-hidden rounded-2xl border border-acid/40 bg-surface shadow-[0_20px_60px_-20px_hsl(var(--acid)/0.4)] lg:h-[380px] lg:w-[380px]">
              {photoUrl ? (
                <img src={photoUrl} alt={info?.name || "Profile"} className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-void via-surface to-base">
                  <span className="font-syne text-[120px] font-extrabold text-grad-acid">ES</span>
                </div>
              )}
            </div>

            {/* Available badge */}
            <div className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-acid/40 bg-void px-4 py-2 shadow-[0_10px_30px_-5px_rgba(0,255,179,0.4)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-sonar rounded-full bg-acid" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid animate-pulse-dot" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-acid">
                {SITE.isAvailable ? "Available" : "Booked"}
              </span>
            </div>
          </div>

          {/* Socials below photo */}
          {socials.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {socials.map(({ key, label, Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="group grid h-11 w-11 place-items-center rounded-xl border border-soft-2 bg-card text-ink-2 transition-all hover:-translate-y-0.5 hover:border-acid/50 hover:text-acid hover:shadow-[0_10px_30px_-10px_hsl(var(--acid)/0.5)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right text */}
        <div className="revr">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-acid" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">{t("about_eyebrow")}</span>
          </div>
          <h2
            className="mt-6 font-syne font-extrabold leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
          >
            <span className="text-ink">{t("about_title_a")}</span>
            <span className="text-grad-acid">{t("about_title_b")}</span>
          </h2>
          <p className="mt-7 text-[16px] leading-[1.85] text-ink-2">
            {t("about_body_1")}
          </p>
          <p className="mt-4 text-[16px] leading-[1.85] text-ink-2">
            {t("about_body_2")}
          </p>

          {/* Quick facts */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-2">
              <MapPin size={14} className="text-acid" /> {SITE.location}
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-2">
              <Globe2 size={14} className="text-acid" /> {SITE.timezone}
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-2">
              <Languages size={14} className="text-acid" /> {SITE.languages.join(" · ")}
            </div>
          </div>

          <NowPlaying />

          <div className="mt-10 space-y-3">
            <Trait icon="⚡" title="Systems First" desc="Architecture before implementation. I design for 10x scale from day one." />
            <Trait icon="🎯" title="Full Ownership" desc="DB schema to CI/CD pipeline — I own every layer, no handoffs needed." />
            <Trait icon="🚀" title="Ship-Obsessed" desc="Success = deployed features + zero-bug production. Nothing else counts." />
          </div>
        </div>
      </div>
    </section>
  );
}
