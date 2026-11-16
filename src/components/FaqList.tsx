import type { Faq } from "@/content/faqs";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="rule-t">
      {items.map((f) => (
        <details key={f.q} className="rule-b group">
          <summary className="flex items-start justify-between gap-6 py-5">
            <h3 className="text-xl font-bold tracking-tight [font-stretch:92%]">{f.q}</h3>
            <svg className="faq-plus mt-1 flex-none" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2.2" />
            </svg>
          </summary>
          <p className="reading pb-6 pr-10">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
