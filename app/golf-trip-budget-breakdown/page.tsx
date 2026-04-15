import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Golf Trip Budget Breakdown for Groups | Outing.golf",
  description:
    "A practical golf trip budget breakdown covering greens fees, lodging, travel, food, and extras — with per-person math so you know what the trip actually costs before you commit."
};

const categories = [
  {
    name: "Greens fees",
    pct: "40–55%",
    notes: "The biggest variable in the budget. A single round can range from $40 at a quality daily-fee course to $300+ at a marquee resort. For a 3-round trip, this line item alone determines what tier of destination is realistic.",
    tips: [
      "Get greens fee estimates for each course on your shortlist before presenting options to the group",
      "Morning tee times are almost always more expensive than afternoon — factor this in",
      "Resort courses often bundle cart fees; public courses may charge separately"
    ]
  },
  {
    name: "Lodging",
    pct: "20–35%",
    notes: "Group lodging usually comes down to three options: rental house (best per-person value for 6+), hotel rooms (most flexibility, least coordination), or resort on-property (premium price, simplest logistics).",
    tips: [
      "A 4-bedroom rental house split among 8 players typically costs less per person than individual hotel rooms",
      "On-property resort lodging adds 20–40% to lodging costs but eliminates transportation headaches",
      "Book lodging before you finalize the itinerary — availability determines dates more than anything else"
    ]
  },
  {
    name: "Travel",
    pct: "10–25%",
    notes: "Travel cost varies wildly based on origin city and destination. A drive-to trip has near-zero travel cost. A cross-country fly-to can add $400–$800 per person before you play a single hole.",
    tips: [
      "Ground transportation (rental cars, rideshares) is often underestimated — budget $50–$100 per person per day for a fly-to trip",
      "Flying into a secondary airport can save $150–$300 per person on some routes",
      "Factor in bag fees if most players are checking clubs"
    ]
  },
  {
    name: "Food and drink",
    pct: "10–20%",
    notes: "This category is easy to underestimate. Three to four days of meals, drinks at the turn, post-round drinks, and group dinners adds up faster than most groups plan for.",
    tips: [
      "A rental house with a kitchen cuts food cost significantly for breakfasts",
      "Budget $80–$150 per person per day for food and drink at a typical group trip",
      "Group dinners at sit-down restaurants are a real line item — factor in 2–3 of those"
    ]
  },
  {
    name: "Extras",
    pct: "5–10%",
    notes: "The catch-all for things that come up: tips for caddies or bag drop staff, merchandise, activities on non-golf days, and any deposits or booking fees.",
    tips: [
      "Caddie fees can add $80–$150 per player per round at walking courses like Bandon or Pinehurst",
      "Budget a small buffer (5%) for unplanned expenses — there are always a few",
      "Pre-pay what you can to avoid on-trip financial complexity"
    ]
  }
];

export default function GolfTripBudgetBreakdownPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip budget breakdown
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Most golf trip budgets fall apart because people only think about greens fees. The actual per-person
            number includes greens fees, lodging, travel, food, and a handful of extras that everyone forgets
            until they are on the trip. This breakdown covers all of it so you know what the trip actually costs
            before anyone commits.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-8">

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              The five cost categories
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Every group golf trip has the same five buckets. The percentages shift based on destination type —
              a fly-to trip has a much higher travel line than a drive-to — but these five categories account for
              virtually every dollar spent.
            </p>

            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Budget category breakdown — % of total per-person cost
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {categories.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-36 shrink-0">
                      <p className="text-sm font-medium text-charcoal">{cat.name}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-charcoal/8">
                        <div
                          className="h-2 rounded-full bg-forest-900"
                          style={{ width: cat.pct.split("–")[1] }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <p className="text-sm text-charcoal/68">{cat.pct}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {categories.map((cat) => (
            <div key={cat.name}>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                {cat.name}
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">{cat.notes}</p>
              <div className="mt-5 space-y-2">
                {cat.tips.map((tip) => (
                  <div key={tip} className="flex items-start gap-3 rounded-[18px] bg-cream px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-900" />
                    <p className="text-sm leading-6 text-charcoal/68">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Putting it together: per-person math
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Once you know the five categories, the per-person number is straightforward:
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Sample per-person budget — 4-day trip, 3 rounds
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  { category: "Greens fees (3 rounds)", budget: "$180–$600", premium: "$450–$1,200" },
                  { category: "Lodging (3 nights, shared)", budget: "$120–$250", premium: "$300–$600" },
                  { category: "Travel (flight + ground)", budget: "$0–$400", premium: "$400–$900" },
                  { category: "Food and drink", budget: "$200–$350", premium: "$350–$600" },
                  { category: "Extras and buffer", budget: "$50–$100", premium: "$100–$200" },
                  { category: "Total per person", budget: "$550–$1,700", premium: "$1,600–$3,500", bold: true }
                ].map((row) => (
                  <div
                    key={row.category}
                    className={`grid grid-cols-[1fr_120px_120px] gap-2 px-5 py-3 ${row.bold ? "bg-charcoal/3 font-semibold" : ""}`}
                  >
                    <p className={`text-sm ${row.bold ? "font-semibold text-charcoal" : "text-charcoal/68"}`}>{row.category}</p>
                    <p className={`text-right text-sm ${row.bold ? "font-semibold text-charcoal" : "text-charcoal/68"}`}>{row.budget}</p>
                    <p className={`text-right text-sm ${row.bold ? "font-semibold text-charcoal" : "text-charcoal/68"}`}>{row.premium}</p>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 bg-charcoal/3 px-5 py-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40" />
                  <p className="text-right text-xs uppercase tracking-[0.18em] text-charcoal/40">Budget trip</p>
                  <p className="text-right text-xs uppercase tracking-[0.18em] text-charcoal/40">Premium trip</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-charcoal/60">
              The spread is wide because destination tier drives nearly every number. See{" "}
              <a href="/golf-trip-cost-per-person" className="text-forest-900 underline-offset-2 hover:underline">
                golf trip cost per person
              </a>{" "}
              for a breakdown by destination.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why budget alignment has to come before destination research
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The most common planning mistake is researching destinations before you know what the group can
              actually spend. You find a place everyone loves, get excited, and then discover the per-person cost
              is $400 above what half the group had in mind.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Collecting budget ranges from everyone privately — before any group discussion — gives you the real
              distribution. Once you know the realistic range, the budget breakdown above tells you which
              destination tier is actually on the table.
            </p>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Golf trip cost per person", href: "/golf-trip-cost-per-person", body: "Realistic cost ranges by destination tier and what moves the number up or down." },
            { title: "Golf trip budget planner", href: "/golf-trip-budget-planner", body: "How to collect real budget ranges from your group before you plan anything." },
            { title: "Best budget golf trip destinations", href: "/best-budget-golf-trip-destinations", body: "Destinations that deliver strong golf value under $800 per person." },
            { title: "Golf trip planning checklist", href: "/golf-trip-planning-checklist", body: "A phase-by-phase checklist so every budget decision happens at the right time." }
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
            Know the real budget before you build anything
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects individual budget ranges from your group privately so you see where everyone
            actually lands — not just the number someone posted first in the group chat.
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
