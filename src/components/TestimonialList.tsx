"use client";

import { useRef, useState } from "react";
import type { Testimonial } from "@/lib/types";
import { Stars } from "./Stars";

const INITIAL = 4;
const STEP = 4;

/** Published testimonials, four at a time, with a "View more" button. */
export function TestimonialList({ items }: { items: Testimonial[] }) {
  const [count, setCount] = useState(INITIAL);
  const listRef = useRef<HTMLDivElement>(null);
  const shown = items.slice(0, count);
  const remaining = items.length - count;

  function showMore() {
    const firstNew = count;
    setCount((c) => c + STEP);
    // Move keyboard focus to the first newly revealed testimonial.
    requestAnimationFrame(() => {
      listRef.current?.querySelectorAll<HTMLElement>("figure")[firstNew]?.focus();
    });
  }

  return (
    <>
      <div ref={listRef} className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
        {shown.map((t) => (
          <figure key={t.id} tabIndex={-1} className="rule-t pt-5 outline-none">
            {t.rating && <Stars rating={t.rating} />}
            <blockquote className={`font-serif text-[1.3rem] leading-snug ${t.rating ? "mt-3" : ""}`}>
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-bold">{t.author_name}</span>
              {(t.author_role || t.business_name) && (
                <span className="muted">, {[t.author_role, t.business_name].filter(Boolean).join(", ")}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length > INITIAL && (
        <div className="mt-12 flex flex-wrap items-center gap-4">
          {remaining > 0 ? (
            <button type="button" className="btn btn-outline" onClick={showMore}>
              View more testimonials
            </button>
          ) : (
            <button type="button" className="btn btn-outline" onClick={() => setCount(INITIAL)}>
              Show fewer
            </button>
          )}
          <p className="text-sm muted" aria-live="polite">
            Showing {Math.min(count, items.length)} of {items.length}
          </p>
        </div>
      )}
    </>
  );
}
