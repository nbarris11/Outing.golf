import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Golf Trip Cost Per Person: What to Budget by Destination",
  description:
    "Realistic per-person cost ranges for the top golf trip destinations — from drive-to budget trips to bucket-list experiences.",
  path: "/golf-trip-cost-per-person"
});

const tiers = [
  {
    tier: "Drive-to / regional",
    range: "$300–$700",
    courses: "$100–$300",
    lodging: "$80–$150",
    travel: "$0–$100",
    food: "$120–$200",
    examples: "Local golf trails, state park courses, regional daily-fee destinations",
    who: "Groups looking for a long weekend without the logistics overhead of flying"
  },
  {
    tier: "Mid-range fly-to",
    range: "$700–$1,400",
    courses: "$200–$500",
    lodging: "$150–$300",
    travel: "$200–$400",
    food: "$200–$300",
    examples: "Myrtle Beach, Wisconsin, Branson, Gulf Coast markets",
    who: "Groups that want a real trip without a premium budget"
  },
  {
    tier: "Premium fly-to",
    range: "$1,400–$2,500",
    courses: "$500–$1,200",
    lodging: "$300–$600",
    travel: "$300–$600",
    food: "$250–$450",
    examples: "Scottsdale, Pinehurst, Palm Springs, Hilton Head",
    who: "Groups willing to spend more for better courses and a stronger overall experience"
  },
  {
    tier: "Bucket-list",
    range: "$2,500–$5,000+",
    courses: "$1,200–$3,000",
    lodging: "$500–$1,200",
    travel: "$400–$900",
    food: "$300–$600",
    examples: "Bandon Dunes, Pebble Beach, Streamsong, top resort destinations",
    who: "Groups where the trip itself is the destination — once-in-a-while outings"
  }
];

const variables = [
  {
    name: "Number of rounds",
    impact: "High",
    detail: "The single biggest lever. Adding a fourth round to a trip can add $150–$400 per person depending on the course. Three rounds is the standard for a 4-day trip; two rounds for a weekend."
  },
  {
    name: "Course tier",
    impact: "High",
    detail: "A marquee resort course (TPC Scottsdale, Caledonia, Pebble Beach) can cost 3–5x more than a comparable daily-fee course at the same destination. Mixed schedules — one marquee course, one value course — are how groups stretch the budget."
  },
  {
    name: "Lodging type",
    impact: "Medium-high",
    detail: "On-property resort lodging can add $100–$200 per person per night versus a nearby rental house or hotel. For a 3-night trip in a group of 8, that difference compounds quickly."
  },
  {
    name: "Group size",
    impact: "Medium",
    detail: "Larger groups lower per-person lodging cost significantly. A 6-bedroom rental house costs about the same whether 8 or 12 people stay in it. Food and transportation costs are relatively fixed per person regardless of group size."
  },
  {
    name: "Season and timing",
    impact: "Medium",
    detail: "Peak season at popular destinations can add 30–50% to greens fees and lodging versus shoulder season. Scottsdale in January is meaningfully more expensive than Scottsdale in October. Myrtle Beach in spring is more expensive than fall."
  }
];

export default function GolfTripCostPerPersonPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Golf Trip Cost Per Person: What to Budget by Destination",
          description:
            "Realistic per-person cost ranges for the top golf trip destinations — from drive-to budget trips to bucket-list experiences.",
          path: "/golf-trip-cost-per-person"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Golf trip cost per person", path: "/golf-trip-cost-per-person" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip cost per person
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A group golf trip costs $300–$700 per person for a drive-to regional weekend, $700–$1,400 for a
            mid-range fly-to trip like Myrtle Beach, $1,400–$2,500 for a premium destination like Scottsdale or
            Pinehurst, and $2,500–$5,000+ for a bucket-list trip like Bandon Dunes or Pebble Beach — all-in for
            3 to 4 days with 3 rounds. Where your group lands depends almost entirely on destination tier and how
            many rounds you play. Here are the full breakdowns — and the five variables that move the number most.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-10">

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Cost ranges by destination tier
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              These ranges assume a 3 to 4 day trip with 3 rounds of golf. All numbers are per person.
            </p>
            <p className="mt-2 text-sm leading-6 text-charcoal/50">
              Ranges compiled from published 2026 greens fees and lodging rates at major group golf destinations;
              updated June 2026.
            </p>
            <div className="mt-6 space-y-4">
              {tiers.map((tier) => (
                <Card key={tier.tier} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">{tier.tier}</h3>
                      <p className="mt-1 text-sm text-charcoal/60">{tier.examples}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-forest-900/10 px-4 py-1.5 text-base font-semibold text-forest-900">
                      {tier.range}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    {[
                      { label: "Greens fees", value: tier.courses },
                      { label: "Lodging", value: tier.lodging },
                      { label: "Travel", value: tier.travel },
                      { label: "Food + extras", value: tier.food }
                    ].map((item) => (
                      <div key={item.label} className="rounded-[16px] bg-cream px-3 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">{item.label}</p>
                        <p className="mt-1 text-sm font-medium text-charcoal">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-charcoal/60">
                    <span className="font-medium text-charcoal">Best for:</span> {tier.who}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              The five variables that move the number
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Two trips to the same destination can differ by $600 per person. These are the levers.
            </p>
            <div className="mt-6 space-y-4">
              {variables.map((v) => (
                <div key={v.name} className="rounded-[22px] border border-charcoal/8 bg-white/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">{v.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      v.impact === "High"
                        ? "bg-forest-900/10 text-forest-900"
                        : "bg-charcoal/6 text-charcoal/60"
                    }`}>
                      {v.impact} impact
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{v.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              The right way to figure out your group's number
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The mistake most organizers make is picking a destination first and then trying to figure out if it
              fits the budget. By that point the group has opinions and expectations, and walking it back is painful.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The better sequence: collect budget ranges from everyone privately before any group discussion. You
              will quickly see whether the group is aligned in the $700–$1,000 range or whether half the group is
              at $1,500 and the other half is at $600. Once you know the real distribution, the cost ranges above
              tell you exactly which tier is realistic.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              That one step — collecting ranges before discussing destinations — prevents the most common and
              most expensive golf trip planning mistake.
            </p>
          </div>

        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "How much does a golf trip cost per person?",
            answer:
              "All-in for a 3 to 4 day trip with 3 rounds: $300–$700 per person for a drive-to regional trip, $700–$1,400 for a mid-range fly-to like Myrtle Beach, $1,400–$2,500 for a premium destination like Scottsdale or Pinehurst, and $2,500–$5,000+ for bucket-list trips like Bandon Dunes or Pebble Beach (as of 2026)."
          },
          {
            question: "What is the biggest expense on a golf trip?",
            answer:
              "Greens fees, in almost every case — typically 40–55% of the total per-person cost. A single round ranges from roughly $40 at a quality daily-fee course to $300+ at a marquee resort, so the course mix moves the total more than any other decision."
          },
          {
            question: "How can a group lower the per-person cost without ruining the trip?",
            answer:
              "Three levers work reliably: mix one marquee course with value courses instead of playing premium rounds every day, split a rental house instead of booking individual hotel rooms, and travel in shoulder season — peak-season greens fees and lodging run 30–50% higher at popular destinations."
          },
          {
            question: "How do I find out what my group can actually afford?",
            answer:
              "Collect a per-person budget range from each player privately before any group discussion. Asked in a group chat, the first number posted anchors everyone else. Once you see the real distribution, the tier ranges above tell you which destinations are realistic."
          }
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Golf trip budget breakdown", href: "/golf-trip-budget-breakdown", body: "How to break down and track each cost category across the full trip." },
            { title: "Golf trip budget planner", href: "/golf-trip-budget-planner", body: "Why collecting real budget ranges before you plan anything changes everything." },
            { title: "Best budget golf trip destinations", href: "/best-budget-golf-trip-destinations", body: "Destinations that deliver strong golf under $800 per person all-in." },
            { title: "Best golf trip destinations", href: "/best-golf-trip-destinations", body: "The full destination guide across all budget tiers." }
          ].map((item) => (
            <a key={item.href} href={item.href} className="group rounded-[26px] border border-charcoal/8 bg-white/86 p-5 transition hover:bg-white hover:shadow-sm">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal group-hover:text-forest-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/66">{item.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Find out what your group can actually spend
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects individual budget ranges privately so you know the real per-person window before
            you research a single destination or course.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/sign-up" className="bg-cream text-charcoal hover:bg-white">Start Planning Free</Button>
            <Button href="/how-it-works" className="border border-cream/30 bg-transparent text-cream hover:bg-white/10">See How It Works</Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
