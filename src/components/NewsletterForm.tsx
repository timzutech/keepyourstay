"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { subscribe } from "@/app/actions/newsletter";
import type { FormState } from "@/app/actions/enquiries";
import { SpamFields } from "./SpamFields";
import { trackSignup } from "@/lib/track";

const initial: FormState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, initial);

  useEffect(() => {
    if (state.status === "success") trackSignup();
  }, [state.status]);

  if (state.status === "success") {
    return <p role="status" className="font-semibold">{state.message}</p>;
  }

  return (
    <form action={action} noValidate className="relative">
      <SpamFields />
      <label htmlFor="newsletter-email" className="label">Email address</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          className="input sm:max-w-xs"
          defaultValue={(state.values?.email as string) ?? ""}
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby="newsletter-status"
        />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2.5 text-sm">
        <input type="checkbox" name="consent" value="yes" className="check" defaultChecked={state.values?.consent === "yes"} />
        <span>
          Email me occasional articles and updates. See the{" "}
          <Link href="/privacy-policy" className="underline underline-offset-4">privacy policy</Link>.
        </span>
      </label>
      <p id="newsletter-status" role={state.status === "error" ? "alert" : undefined} className="mt-2 min-h-5 text-sm font-semibold">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
