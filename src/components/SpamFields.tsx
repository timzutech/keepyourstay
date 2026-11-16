"use client";

import { useEffect, useState } from "react";
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "@/lib/forms";

/** Hidden anti-spam inputs: a field people never see, and the time the form was opened. */
export function SpamFields() {
  const [started, setStarted] = useState("");
  useEffect(() => setStarted(String(Date.now())), []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name={TIMESTAMP_FIELD} value={started} />
    </>
  );
}
