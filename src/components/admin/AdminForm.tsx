"use client";

import { useState, useTransition, type ReactNode } from "react";
import type { AdminState } from "@/app/admin/actions";

/**
 * Form wrapper for admin actions. Calls the server action directly so that a
 * validation error keeps everything the admin has typed in place.
 */
export function AdminForm({
  action,
  submitLabel,
  pendingLabel = "Saving…",
  children,
  className = "",
  resetOnSuccess = false,
}: {
  action: (prev: AdminState, fd: FormData) => Promise<AdminState>;
  submitLabel: string;
  pendingLabel?: string;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, setState] = useState<AdminState>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
          const result = await action(null, fd);
          setState(result);
          if (result?.ok && resetOnSuccess) form.reset();
        });
      }}
    >
      {children}
      {state && (
        <p
          role={state.ok ? "status" : "alert"}
          className={`mt-5 rounded-lg border-2 p-3 font-semibold ${state.ok ? "border-forest text-forest" : "border-alert text-alert"}`}
        >
          {state.message}
        </p>
      )}
      <button type="submit" className="btn btn-primary mt-5" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
