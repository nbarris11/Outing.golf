import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Best Golf Trip Destinations for Groups | Outing.golf",
  description:
    "A practical guide to the best golf trip destinations for groups — covering course quality, budget range, and what each destination is actually like to organize for 4 to 12 players."
};

const destinations = [
  {
    name: "Myrtle Beach, SC",
    budgetTier: "$500–$1,200 per person",
    bestFor: "Groups of 4–16, wide budget range, first-timers and regulars alike",
    courseCount: "80+ courses",
    overview:
      "Myrtle Beach is the most popular domestic golf trip destination for a reason: it has more courses than any other market in the US, a wide pricing spread, and enough non-golf options to keep mixed-interest groups happy. The challenge for organizers is that 80+ courses means too many options without a way to narrow them down. Budget and course style (resort, daily-fee, links-style) should filter the list before you show anyone anything.",
    organizer:
      "Budget overlap matters more here than anywhere else because the spread between a $40 daily-fee round and a $180 resort round is enormous. Know your group's real range before you start building a shortlist.",
    slug: "/myrtle-beach-golf-trip-planner"
  },
  {
    name: "Scottsdale, AZ",
    budgetTier: "$1,000–$2,500 per person",
    bestFor: "Groups of 4–12, premium and bucket-list trips, bachelor parties",
    courseCount: "200+ courses in the Phoenix metro",
    overview:
      "Scottsdale is the premier domestic golf destination for groups that want a high-end experience. World-class resort courses, reliable winter and spring weather, and a strong food and nightlife scene make it one of the most complete group destinations in the country. It works especially well for bachelor trips where not everyone is a hardcore golfer.",
    organizer:
      "Scottsdale has significant seasonal pricing swings. January through April is peak season and peak pricing. May onward drops significantly. If your group is flexible on timing, the off-season value is substantial.",
    slug: null
  },
  {
    name: "Pinehurst, NC",
    budgetTier: "$800–$2,000 per person",
    bestFor: "Serious golfers, groups of 4–12, historic and classic course experiences",
    courseCount: "40+ courses in the Sandhills region",
    overview:
      "Pinehurst is the closest thing the US has to a dedicated golf village. The entire area exists around golf, which makes it an exceptional destination for groups where everyone is genuinely there to play. The resort itself has nine courses, including No. 2 — one of the most famous courses in the world. It is a quieter, more golf-focused experience than Myrtle Beach or Scottsdale.",
    organizer:
      "Pinehurst is not a great fit for groups with non-golfers or people who need a lot of entertainment outside of the game. It is perfect for groups where golf is the entire point.",
    slug: null
  },
  {
    name: "Palm Springs, CA",
    budgetTier: "$900–$2,200 per person",
    bestFor: "West Coast groups, winter trips, resort-style experiences",
    courseCount: "100+ courses in the Coachella Valley",
    overview:
      "Palm Springs and the surrounding Coachella Valley have more golf courses per capita than almost anywhere in the country. The combination of desert mountain scenery, reliable sunshine from November through April, and strong resort infrastructure makes it a strong choice for West Coast groups looking for a destination with a full resort experience attached.",
    organizer:
      "Summer is completely off the table — temperatures regularly hit 115°F. Plan for November through April. Like Scottsdale, timing significantly affects both pricing and playability.",
    slug: null
  },
  {
    name: "Bandon Dunes, OR",
    budgetTier: "$1,500–$3,000 per person",
    bestFor: "Serious golfers, bucket-list trips, groups of 4–8",
    courseCount: "5 world-class courses on property",
    overview:
      "Bandon Dunes is unlike any other domestic golf destination. Five courses on the Oregon coast, all walking-only, all links-style, all designed with serious golfers in mind. There is essentially nothing to do there except play golf — which is exactly the point. If your group wants the most purely golf-focused experience available in the US, this is it.",
    organizer:
      "Bandon is not a budget destination and it is not right for groups where anyone is a casual golfer. Groups tend to be smaller (4–8) and more intentional. The isolation is a feature, not a bug.",
    slug: null
  },
  {
    name: "Streamsong, FL",
    budgetTier: "$900–$1,800 per person",
    bestFor: "Southeast groups, serious golfers, mid-range bucket-list",
    courseCount: "4 courses on property",
    overview:
      "Streamsong is one of the most underrated golf destinations in the country. Four courses built on reclaimed phosphate mining land in central Florida, with dramatic elevation changes you would not expect in the state. The resort is remote, golf-focused, and consistently ranks among the best resort experiences in the US.",
    organizer:
      "Streamsong is a strong pick for Southeast groups who want a bucket-list feel without flying to Oregon or paying Scottsdale peak prices. The remoteness means you stay on property, which simplifies logistics considerably.",
    slug: null
  },
  {
    name: "Wisconsin",
    budgetTier: "$400–$900 per person",
    bestFor: "Midwest groups, annual trips, value-focused outings",
    courseCount: "Whistling Straits, Erin Hills, Blackwolf Run, and 700+ others",
    overview:
      "Wisconsin has an outsized golf infrastructure for a Midwest state — including Whistling Straits and Erin Hills, two courses that have hosted major championships. Outside of those marquee names, Wisconsin has hundreds of quality courses at accessible prices, making it one of the best value golf trip destinations for Midwest groups.",
    organizer:
      "Wisconsin golf season runs May through October. The sweet spot is June through August. If your group has a mix of serious golfers and casual players, Wisconsin can accommodate both with marquee courses and solid daily-fee options at very different price points.",
    slug: null
  }
];

export default function BestGolfTripDestinationsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Best golf trip destinations for groups
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            The best destination for your group depends on budget, group size, how seriously everyone plays, and
            whether non-golf activities matter. This guide covers the major options from a group organizer's
            perspective — not just which courses are good, but what you actually need to know to plan there.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {destinations.map((dest) => (
            <Card key={dest.name} className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                    {dest.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block rounded-full bg-forest-900/8 px-3 py-1 text-xs font-medium text-forest-900">
                      {dest.budgetTier}
                    </span>
                    <span className="inline-block rounded-full bg-charcoal/6 px-3 py-1 text-xs text-charcoal/60">
                      {dest.courseCount}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-charcoal/40">Best for</p>
              <p className="mt-1 text-sm leading-6 text-charcoal/68">{dest.bestFor}</p>
              <p className="mt-4 text-base leading-7 text-charcoal/68">{dest.overview}</p>
              <div className="mt-4 rounded-[18px] bg-cream px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                  Organizer note
                </p>
                <p className="mt-1 text-sm leading-6 text-charcoal/68">{dest.organizer}</p>
              </div>
              {dest.slug && (
                <div className="mt-4">
                  <a
                    href={dest.slug}
                    className="text-sm font-medium text-forest-900 underline-offset-2 hover:underline"
                  >
                    Plan your {dest.name.split(",")[0]} trip →
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "How budget ranges determine which destinations are actually on the table."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist for organizing a group trip from scratch."
            },
            {
              title: "Myrtle Beach golf trip planner",
              href: "/myrtle-beach-golf-trip-planner",
              body: "What to know when planning a group trip to the Grand Strand."
            },
            {
              title: "How it works",
              href: "/how-it-works",
              body: "See how Outing.golf collects group input and gets everyone aligned."
            }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-[26px] border border-charcoal/8 bg-white/86 p-5 transition hover:bg-white hover:shadow-sm"
            >
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal group-hover:text-forest-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/66">{item.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Group golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Plan your group's trip in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Once you know the destination, Outing.golf helps you collect budgets, dates, and course preferences
            from the group so you can move from shortlist to confirmed plan without the usual back-and-forth.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/sign-up" className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </Button>
            <Button href="/how-it-works" className="border border-cream/30 bg-transparent text-cream hover:bg-white/10">
              See How It Works
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
