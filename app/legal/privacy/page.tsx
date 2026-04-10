import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";

export default async function PrivacyPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em]">Privacy Policy</h1>
          <p className="mt-5 text-base leading-7 text-charcoal/68">
            Placeholder policy for MVP. Replace with final legal copy before launch. This page exists so QA, staging, and
            production environments have complete route coverage from day one.
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
