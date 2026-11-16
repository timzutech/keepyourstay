"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/enquiries";
import { unsubscribe } from "@/app/actions/newsletter";

export function UnsubscribeForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(unsubscribe, { status: "idle" });

  if (state.status === "success") {
    return <p role="status" className="reading font-semibold">{state.message}</p>;
  }
  if (!token) {
    return <p className="reading">This page needs the unsubscribe link from one of our emails. Open the link in your most recent newsletter.</p>;
  }
  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <p className="reading">Confirm that you no longer want to receive the KeepYourStay newsletter.</p>
      {state.status === "error" && <p role="alert" className="field-error mt-4">{state.message}</p>}
      <button type="submit" className="btn btn-primary mt-6" disabled={pending}>
        {pending ? "Unsubscribing…" : "Unsubscribe"}
      </button>
    </form>
  );
}
