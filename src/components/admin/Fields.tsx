import type { ReactNode } from "react";

export function TextField({
  name, label, defaultValue = "", hint, type = "text", required, rows,
}: {
  name: string; label: string; defaultValue?: string | number | null; hint?: string; type?: string; required?: boolean; rows?: number;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {rows ? (
        <textarea id={id} name={name} rows={rows} className="input" defaultValue={defaultValue ?? ""} aria-describedby={hint ? `${id}-hint` : undefined} />
      ) : (
        <input id={id} name={name} type={type} className="input" defaultValue={defaultValue ?? ""} aria-required={required} aria-describedby={hint ? `${id}-hint` : undefined} />
      )}
      {hint && <p id={`${id}-hint`} className="hint">{hint}</p>}
    </div>
  );
}

export function SelectField({
  name, label, defaultValue = "", options, hint,
}: {
  name: string; label: string; defaultValue?: string | null; options: { value: string; label: string }[]; hint?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <select id={id} name={name} className="input" defaultValue={defaultValue ?? ""} aria-describedby={hint ? `${id}-hint` : undefined}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <p id={`${id}-hint`} className="hint">{hint}</p>}
    </div>
  );
}

export function CheckField({ name, label, defaultChecked = false, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5">
      <input type="checkbox" name={name} className="check" defaultChecked={defaultChecked} />
      <span>
        <span className="font-semibold">{label}</span>
        {hint && <span className="hint block !mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border-2 border-ink bg-paper p-5 sm:p-6">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export function AdminHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="heading">{title}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Saved({ show }: { show: boolean }) {
  if (!show) return null;
  return <p role="status" className="mt-5 rounded-lg border-2 border-forest p-3 font-semibold text-forest">Saved. The public site has been refreshed.</p>;
}
