"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-outline btn-sm"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-[4.25rem] z-50 overflow-y-auto bg-cream"
        >
          <nav aria-label="Main" className="wrap py-6">
            <ul>
              {mainNav.map((item) => (
                <li key={item.href} className="rule-b">
                  <Link href={item.href} className="block py-4 text-2xl font-bold tracking-tight [font-stretch:88%]">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="rule-b">
                <Link href="/faq" className="block py-4 text-2xl font-bold tracking-tight [font-stretch:88%]">
                  FAQ
                </Link>
              </li>
            </ul>
            <div className="mt-8 grid gap-3">
              <Link href="/savings-calculator" className="btn btn-primary">Calculate My Potential Savings</Link>
              <Link href="/contact#project" className="btn btn-outline">Request a Custom Quote</Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
