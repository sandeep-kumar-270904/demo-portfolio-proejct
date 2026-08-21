// Single sitewide format for every company / issuer logo.
// 56x56 rounded-xl container, dark card surface, consistent padding,
// grayscale until hover. Falls back to the first initial when no logo is set.

type Props = {
  src?: string | null;
  name: string;
  className?: string;
};

export default function BrandLogo({ src, name, className = "" }: Props) {
  const base =
    "h-14 w-14 shrink-0 rounded-xl border border-soft-2 bg-surface p-2 transition-all duration-300";

  if (!src) {
    return (
      <div
        className={`${base} grid place-items-center font-syne text-[18px] font-extrabold text-acid ${className}`}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      className={`${base} object-contain grayscale group-hover:grayscale-0 ${className}`}
    />
  );
}
