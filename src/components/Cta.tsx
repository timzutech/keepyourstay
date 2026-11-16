import Link from "next/link";

type Action = { href: string; label: string };

const presets = {
  calculator: {
    title: "See what an independent booking channel could mean for your numbers.",
    text: "Enter your own figures and assumptions. The calculator shows an illustrative scenario, not a forecast.",
    primary: { href: "/savings-calculator", label: "Calculate My Potential Savings" },
    secondary: { href: "/contact#consultation", label: "Book a Website Consultation" },
  },
  quote: {
    title: "Tell us about your property and we'll quote for the work it needs.",
    text: "Every project is scoped individually. No packages, no obligation.",
    primary: { href: "/contact#project", label: "Request a Custom Quote" },
    secondary: { href: "/portfolio", label: "Explore Our Work" },
  },
  discuss: {
    title: "Have a project in mind? Let's talk it through.",
    text: "A short conversation is usually enough to tell you what's possible with the systems you already use.",
    primary: { href: "/contact#project", label: "Discuss Your Project" },
    secondary: { href: "/savings-calculator", label: "Calculate My Potential Savings" },
  },
} satisfies Record<string, { title: string; text: string; primary: Action; secondary: Action }>;

export function Cta({
  preset = "calculator",
  title,
  text,
  tone = "ink",
}: {
  preset?: keyof typeof presets;
  title?: string;
  text?: string;
  tone?: "ink" | "forest";
}) {
  const p = presets[preset];
  return (
    <section className={`on-dark ${tone === "forest" ? "bg-forest" : "bg-ink"} text-cream`}>
      <div className="wrap band grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 className="title max-w-[20ch]">{title ?? p.title}</h2>
          <p className="lede mt-6 text-cream/85">{text ?? p.text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
          <Link href={p.primary.href} className="btn btn-primary">{p.primary.label}</Link>
          <Link href={p.secondary.href} className="btn btn-outline">{p.secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}
