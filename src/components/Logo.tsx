import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`} aria-label="KeepYourStay home">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="1" y="1" width="24" height="24" rx="7" fill="currentColor" />
        <path d="M13 6.2 6.6 11.6v8.2h4.3v-4.6h4.2v4.6h4.3v-8.2L13 6.2Z" className="fill-cream [.on-dark_&]:fill-ink" />
      </svg>
      <span className="text-[1.3rem] leading-none [font-stretch:88%]">KeepYourStay</span>
    </Link>
  );
}
