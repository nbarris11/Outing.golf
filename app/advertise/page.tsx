import type { Metadata } from "next";

import { AdvertiseForm } from "@/components/advertise-form";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Advertise with Us | Outing.golf",
  description: "Reach golf trip organizers and groups. Get in touch to learn about advertising opportunities on Outing.golf."
};

export default function AdvertisePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Advertise</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em]">
          Advertise with Outing.golf
        </h1>
        <p className="mt-4 text-lg leading-8 text-charcoal/68">
          Outing.golf puts your brand in front of golf trip organizers — the people actively planning group trips,
          comparing courses, booking lodging, and making decisions for the whole group.
        </p>
        <p className="mt-3 text-lg leading-8 text-charcoal/68">
          Fill out the form below and we&apos;ll get back to you to talk through options.
        </p>

        <AdvertiseForm />
      </section>
    </PageShell>
  );
}
