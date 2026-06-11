import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = buildMetadata({
  title: "Feedback & Questions | Outing.golf",
  description:
    "Have feedback on Outing.golf or a question? Fill out the form and we'll get back to you.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Contact</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em]">
          Feedback &amp; questions
        </h1>
        <p className="mt-4 text-lg leading-8 text-charcoal/68">
          Have a question or feedback about the site? Fill out the form below and we&apos;ll get back to you.
        </p>

        <ContactForm />
      </section>
    </PageShell>
  );
}
