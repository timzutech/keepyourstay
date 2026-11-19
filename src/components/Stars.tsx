const STAR = "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6z";

/** Read-only star rating, e.g. "Rated 5 out of 5". */
export function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span role="img" aria-label={`Rated ${value} out of 5`} className="inline-flex gap-0.5 text-forest">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path d={STAR} fill={i < value ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export const STAR_PATH = STAR;
