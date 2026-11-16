"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitEnquiry, type FormState } from "@/app/actions/enquiries";
import { formConfigs, issuesToErrors, readForm, schemaFor, type Field, type FormKind } from "@/lib/forms";
import { SpamFields } from "./SpamFields";

const initial: FormState = { status: "idle" };

export function EnquiryForm({ kind, calculator }: { kind: FormKind; calculator?: object }) {
  const config = formConfigs[kind];
  const pathname = usePathname();
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const [clientErrors, setClientErrors] = useState<Record<string, string> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const errors = clientErrors ?? state.errors ?? {};
  const values = state.values ?? {};
  const id = (name: string) => `${kind}-${name}`;

  useEffect(() => {
    if (state.status === "success") doneRef.current?.focus();
    if (state.status === "error") summaryRef.current?.focus();
  }, [state]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const parsed = schemaFor(kind).safeParse(readForm(kind, new FormData(e.currentTarget)));
    if (parsed.success) {
      setClientErrors(null);
      return; // hand over to the server action, which validates again
    }
    e.preventDefault();
    const found = issuesToErrors(parsed.error.issues);
    setClientErrors(found);
    const first = Object.keys(found)[0];
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  }

  if (state.status === "success") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-lg border-2 border-forest bg-paper p-6 sm:p-8">
        <h3 className="heading">{config.successTitle}</h3>
        <p className="reading mt-3">{state.message}</p>
      </div>
    );
  }

  const describedBy = (f: Field) =>
    [errors[f.name] ? `${id(f.name)}-error` : "", f.hint ? `${id(f.name)}-hint` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="relative">
      <input type="hidden" name="form_kind" value={kind} />
      <input type="hidden" name="source_path" value={pathname} />
      {calculator && <input type="hidden" name="calculator" value={JSON.stringify(calculator)} />}
      <SpamFields />

      {state.status === "error" && !clientErrors && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-lg border-2 border-alert bg-paper p-4 font-semibold text-alert">
          {state.message}
        </div>
      )}
      {clientErrors && (
        <div role="alert" className="mb-6 rounded-lg border-2 border-alert bg-paper p-4 font-semibold text-alert">
          Some fields need your attention. Check the messages below.
        </div>
      )}

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {config.fields.map((f) => {
          const v = values[f.name];
          const common = {
            id: id(f.name),
            name: f.name,
            "aria-invalid": errors[f.name] ? true : undefined,
            "aria-describedby": describedBy(f),
            "aria-required": f.required || undefined,
          };
          return (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              {f.type === "checkboxes" ? (
                <fieldset aria-describedby={describedBy(f)}>
                  <legend className="label">{f.label}</legend>
                  <div className="grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
                    {f.options!.map((o) => (
                      <label key={o} className="flex items-start gap-2.5 text-[1rem]">
                        <input
                          type="checkbox"
                          name={f.name}
                          value={o}
                          className="check"
                          defaultChecked={Array.isArray(v) && v.includes(o)}
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <>
                  <label htmlFor={id(f.name)} className="label">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea {...common} className="input" defaultValue={(v as string) ?? ""} maxLength={f.max} />
                  ) : f.type === "select" ? (
                    <select {...common} className="input" defaultValue={(v as string) ?? ""}>
                      <option value="">Choose…</option>
                      {f.options!.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...common}
                      type={f.type === "url" ? "text" : f.type}
                      inputMode={f.type === "url" ? "url" : undefined}
                      className="input"
                      autoComplete={f.autoComplete}
                      defaultValue={(v as string) ?? ""}
                    />
                  )}
                </>
              )}
              {f.hint && <p id={`${id(f.name)}-hint`} className="hint">{f.hint}</p>}
              {errors[f.name] && <p id={`${id(f.name)}-error`} className="field-error">{errors[f.name]}</p>}
            </div>
          );
        })}

        <div className="sm:col-span-2">
          <label className="flex items-start gap-2.5 text-[0.95rem]">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              className="check"
              defaultChecked={values.consent === "yes"}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
            />
            <span>
              I agree to KeepYourStay storing these details so it can reply to me, as described in the{" "}
              <Link href="/privacy-policy" className="link">privacy policy</Link>.
            </span>
          </label>
          {errors.consent && <p id={`${id("consent")}-error`} className="field-error">{errors.consent}</p>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-7" disabled={pending} aria-disabled={pending}>
        {pending ? "Sending…" : config.submitLabel}
      </button>
    </form>
  );
}
