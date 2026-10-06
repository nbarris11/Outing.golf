import type { Metadata } from "next";

import { FeedbackForm } from "@/components/feedback-form";
import { PageShell } from "@/components/layout/page-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Feedback | Outing.golf",
  description: "Tell us what you think about Outing.golf in a quick survey.",
  path: "/feedback"
});

export default function FeedbackPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h1 className="font-serif text-4xl font-semibold tracking-[-0.05em]">
          We&apos;d love your feedback
        </h1>
        <p className="mt-4 text-lg leading-8 text-charcoal/68">
          Thanks for trying out the site! We&apos;re working on making it better and would love to hear about your experience. This should take less than 2 minutes.
        </p>
        <FeedbackForm />
      </section>
    </PageShell>
  );
}
