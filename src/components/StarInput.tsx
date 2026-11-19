"use client";

import { useState } from "react";
import { STAR_PATH } from "./Stars";

const words = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/**
 * Star rating picker built from real radio buttons, so it works with the
 * keyboard (arrow keys) and screen readers, and submits with the form.
 */
export function StarInput({
  name,
  label,
  defaultValue = "",
  invalid,
  describedBy,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [value, setValue] = useState(Number(defaultValue) || 0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={invalid || undefined}>
      <legend className="label">{label}</legend>
      <div className="flex items-center gap-3" onMouseLeave={() => setHover(0)}>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded text-forest has-[:focus-visible]:outline-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest"
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name={name}
                value={String(n)}
                checked={value === n}
                onChange={() => setValue(n)}
                className="sr-only"
              />
              <span className="sr-only">{n} {n === 1 ? "star" : "stars"}, {words[n]}</span>
              <svg width="34" height="34" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d={STAR_PATH}
                  fill={n <= shown ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          ))}
        </div>
        <span className="text-sm font-semibold" aria-hidden="true">{shown ? words[shown] : ""}</span>
      </div>
    </fieldset>
  );
}
