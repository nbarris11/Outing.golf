import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Best Golf Trip Destinations for Groups | Outing.golf",
  description:
    "The best golf trip destinations for groups — Scottsdale, Myrtle Beach, Pinehurst, Bandon, and more. What makes each destination work, who it's right for, and how to compare options based on your group's actual budget."
};

const destinations = [
  {
    name: "Scottsdale, Arizona",
    why: "Consistent weather, a wide range of course quality at different price points, and strong lodging options make Scottsdale one of the most reliable group destinations. It works for budget-conscious trips and high-end outings alike.",
    bestFor: "Groups that want flexibility on budget and course mix"
  },
  {
    name: "Myrtle Beach, South Carolina",
    why: "More golf courses per square mile than almost anywhere else. Myrtle Beach is a strong value destination with a wide selection of public and semi-private courses, affordable lodging, and easy logistics for groups flying from the East Coast.",
    bestFor: "Groups prioritizing value and volume of golf"
  },
  {
    name: "Pinehurst, North Carolina",
    why: "Pinehurst is a dedicated golf town with courses ranging from the iconic No. 2 to more accessible layouts. The pace is calmer than resort destinations, and the focus is squarely on the game. Strong fit for groups where everyone is serious about golf.",
    bestFor: "Golf-first groups who want a classic, focused trip"
  },
  {
    name: "Bandon Dunes, Oregon",
    why: "Bandon is a bucket-list destination for serious golfers — walking-only, ocean-side courses with no carts and no distraction. The experience is unlike anything else in the US. Best for groups where everyone is committed to the game.",
    bestFor: "Serious golfers looking for a bucket-list experience"
  },
  {
    name: "Kiawah Island, South Carolina",
    why: "Kiawah offers high-end resort experience with championship-quality courses. The Ocean Course is one of the most recognized in the country. A strong choice for groups with higher budgets and a mix of on-course and off-course interests.",
    bestFor: "Higher-budget groups who want a premium resort experience"
  },
  {
    name: "Pebble Beach, California",
    why: "Pebble Beach is the classic US golf bucket list destination. Courses like Pebble Beach Golf Links and Spyglass Hill are on most golfers' wish lists. Expensive but worth it for the right group.",
    bestFor: "Once-in-a-while bucket list trips for dedicated golfers"
  }
];

export default function BestGolfTripDestinationsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Best golf trip destinations for groups
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Picking a destination is usually the first thing a group wants to debate — and one of the last things
            that should actually be decided. Budget and dates come first. Once you know both, the destination list
            shortens fast. Here are the destinations worth considering once you have that foundation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
          What makes a destination work for a group
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Course variety",
              body: "Groups rarely agree on the exact same course preference. A destination with a mix of layouts and price points gives everyone something to look forward to."
            },
            {
              title: "Lodging options",
              body: "On-site resort lodging, nearby rental houses, and hotel blocks all have tradeoffs. The right choice depends on group size, budget, and how much logistics you want to manage."
            },
            {
              title: "Logistics",
              body: "Direct flights, ground transportation, and proximity of courses to lodging matter more than most groups realize until they are standing in a rental car lot at 11pm."
            }
          ].map((item) => (
            <Card key={item.title} className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/68">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
          Destinations worth considering
        </h2>
        <div className="mt-6 space-y-5">
          {destinations.map((dest) => (
            <Card key={dest.name} className="p-6">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">{dest.name}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/68">{dest.why}</p>
              <p className="mt-3 text-sm font-medium text-forest-900">Best for: {dest.bestFor}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            How to compare destinations without losing the thread
          </h2>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            The problem with destination research is that it happens in a vacuum. Someone finds a great resort and
            shares it in the chat. Someone else finds a different option. Nobody compares them against the same
            criteria, and the group ends up debating vibes instead of making a structured decision.
          </p>
          <p className="mt-3 text-base leading-7 text-charcoal/68">
            A golf trip planner that keeps destinations, courses, and lodging tied to the same shortlist — alongside
            group budget and date data — makes the comparison much easier. You are not just comparing places; you
            are comparing which place fits the group you actually have.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related destination guides</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Scottsdale golf trip planner",
              href: "/scottsdale-golf-trip-planner",
              body: "Courses, budget ranges, and what to know before you organize a Scottsdale trip."
            },
            {
              title: "Myrtle Beach golf trip planner",
              href: "/myrtle-beach-golf-trip-planner",
              body: "How to navigate 100+ courses and build the right shortlist for your group."
            },
            {
              title: "Pinehurst golf trip planner",
              href: "/pinehurst-golf-trip-planner",
              body: "What makes Pinehurst different and which version of the trip fits your group."
            },
            {
              title: "Palm Springs golf trip planner",
              href: "/palm-springs-golf-trip-planner",
              body: "Coachella Valley course guide, budget ranges, and best time to go."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Build a shortlist your group can actually vote on
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf helps you compare destinations against real budget and date data from your group — so the
            decision is based on what fits, not what sounds good in a chat.
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
