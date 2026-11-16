import { PageHeader } from "@/components/PageHeader";
import { UnsubscribeForm } from "@/components/UnsubscribeForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Unsubscribe",
  description: "Unsubscribe from the KeepYourStay newsletter.",
  path: "/unsubscribe",
  noindex: true,
});

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <>
      <PageHeader crumbs={[{ name: "Unsubscribe", path: "/unsubscribe" }]} title="Unsubscribe from the newsletter" />
      <div className="wrap pb-24">
        <UnsubscribeForm token={token} />
      </div>
    </>
  );
}
