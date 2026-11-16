import Image from "next/image";
import { photo, photos } from "@/lib/site";

const ADDRESS = "yourproperty.com";

/**
 * The hero image: a guest's view of a property website at the owner's own
 * address. Purely illustrative — the calendar and figures are not real data.
 */
export function HeroBrowser() {
  const days = Array.from({ length: 21 }, (_, i) => i + 6);
  const booked = new Set([9, 10, 11, 20, 21]);
  const chosen = new Set([14, 15, 16, 17]);
  return (
    <figure className="rise relative" aria-label="Illustration of a property website at its own web address">
      <div className="overflow-hidden rounded-t-[18px] rounded-b-md border-2 border-ink bg-paper shadow-[10px_10px_0_0_#2e4a3b]">
        <div className="flex items-center gap-3 border-b-2 border-ink bg-sand px-4 py-3">
          <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/40" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-1.5 text-[0.95rem] font-semibold">
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" className="flex-none">
              <rect x="1" y="6" width="10" height="7" rx="1.5" fill="#2e4a3b" />
              <path d="M3.5 6V4a2.500 2.500 0 0 1 5 0v2" fill="none" stroke="#2e4a3b" strokeWidth="1.6" />
            </svg>
            <span
              className="type-url"
              style={{ "--chars": `${ADDRESS.length}ch`, "--steps": ADDRESS.length } as React.CSSProperties}
            >
              {ADDRESS}
            </span>
            <span className="type-caret -ml-1.5 text-forest" aria-hidden="true">|</span>
          </div>
        </div>
        <div className="photo aspect-[4/3] sm:aspect-[16/11]">
          <Image
            src={photo(photos.villaBay, 1400)}
            alt="Infinity pool at a hillside villa overlooking a blue bay"
            fill
            priority
            sizes="(min-width: 64rem) 46vw, 100vw"
          />
        </div>
      </div>

      <div className="rise-late relative z-10 -mt-16 ml-auto mr-3 w-[min(19rem,84%)] rounded-lg border-2 border-ink bg-paper p-4 sm:-mt-24 sm:mr-6 lg:-mr-4" aria-hidden="true">
        <p className="text-sm font-bold">Check availability</p>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold">
          {days.map((d) => (
            <span
              key={d}
              className={`rounded py-1.5 ${
                chosen.has(d) ? "bg-forest text-cream" : booked.has(d) ? "text-ink/30 line-through" : "bg-sand"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs leading-tight muted">4 nights selected</p>
          <span className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-cream">Book direct</span>
        </div>
      </div>
      <figcaption className="sr-only">
        A browser window showing a villa website at the address yourproperty.com, with a calendar for checking availability.
      </figcaption>
    </figure>
  );
}
