import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { Check } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { AuthCta } from "@/components/marketing/auth-cta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Outing.golf",
  description:
    "Outing.golf is free for the organizer and free for every group member. One price, one tier, the whole trip.",
  path: "/pricing"
});

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Outing.golf — Free Organizer",
  description:
    "Golf trip planning tool for group organizers. Collect dates, budgets, and course votes in one place.",
  brand: { "@type": "Organization", name: "Outing.golf" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.outing.golf/pricing"
  }
};

export default function PricingPage() {
  const features = [
    "Unlimited trips you organize",
    "Invite your whole group with one link — invitees never pay",
    "Real courses sourced live via Google Places",
    "Real lodging with current availability and rates",
    "Group voting on dates, budgets, courses, and hotels",
    "Trip HQ — the shared home base your group can see",
    "Round-by-round schedule and packing list",
    "Median group response time: 24 hours"
  ];

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Pricing</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em] text-charcoal">
            One price. <span className="text-gold">Free.</span>
          </h1>
          <p className="mt-5 text-[17px] leading-[1.65] text-charcoal/68">
            Outing.golf is free for the organizer and free for every group member. No credit card, no per-seat
            charges, no premium tier holding back the feature you actually need. Plan the trip, book the trip,
            come back next year.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <Card className="relative overflow-hidden border-none bg-[linear-gradient(135deg,#fff,rgba(247,244,238,0.8))] p-8 shadow-[0_30px_90px_rgba(33,36,35,0.08)] ring-1 ring-charcoal/8 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-charcoal/50">Free Organizer</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                  Everything in one place
                </h2>
              </div>
              <Badge className="bg-gold/15 text-gold">Always free</Badge>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <p className="font-serif text-6xl font-semibold tracking-[-0.04em] text-gold">$0</p>
              <p className="text-sm text-charcoal/55">forever, for every trip</p>
            </div>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-900/10">
                    <Check className="h-3 w-3 text-forest-900" />
                  </span>
                  <span className="text-[15.5px] leading-[1.5] text-charcoal/75">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <AuthCta className="w-full sm:w-auto">
                Start Planning Free
              </AuthCta>
              <p className="mt-3 text-sm text-charcoal/55">
                Free for the organizer · Group members never pay
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:pb-20">
        <Card className="p-8 sm:p-10">
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.03em] text-charcoal">
            Why is the free tier so generous?
          </h2>
          <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
            Because the value of the tool is proving itself on a real trip. If it works for your group, you'll come
            back. We'd rather earn that than lock features. There's no second tier coming to take this away — the
            organizer flow is the product, and it stays free.
          </p>
        </Card>
      </section>
    </PageShell>
  );
}
