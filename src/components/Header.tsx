import Link from "next/link";
import { mainNav } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream rule-b">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="wrap flex h-[4.25rem] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-7 text-sm font-semibold">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="py-2 underline-offset-[6px] decoration-2 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/savings-calculator" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Savings calculator
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
