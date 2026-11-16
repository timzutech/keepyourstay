import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="wrap band">
      <p className="text-[clamp(5rem,18vw,12rem)] font-bold leading-none tracking-tighter text-forest [font-stretch:78%]" aria-hidden="true">404</p>
      <h1 className="title mt-4 max-w-[16ch]">This page has checked out.</h1>
      <p className="lede mt-6">
        The address may have changed, or the page may never have existed. These will get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link href="/" className="btn btn-primary">Go to the homepage</Link>
        <Link href="/services" className="btn btn-outline">See our services</Link>
        <Link href="/portfolio" className="btn btn-outline">Explore Our Work</Link>
        <Link href="/contact" className="btn btn-outline">Contact us</Link>
      </div>
    </section>
  );
}
