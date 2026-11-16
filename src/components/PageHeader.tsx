import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  crumbs,
  title,
  lede,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <div className="wrap pt-8 pb-12 lg:pt-10 lg:pb-16">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="title mt-8 max-w-[18ch] lg:mt-12">{title}</h1>
      {lede && <p className="lede mt-6">{lede}</p>}
      {children}
    </div>
  );
}
