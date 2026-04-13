import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How to Plan a Golf Trip with Friends | Outing.golf",
  description:
    "A practical guide to planning a group golf trip — from picking a destination to locking in the budget. Outing.golf makes the whole process easier for the organizer."
};

export default function HowToPlanAGolfTripPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            How to plan a golf trip with friends
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Planning a golf trip sounds simple until the group chat starts. Everyone has different availability,
            different budgets, and different ideas about where to go. Here is how to get the group aligned before
            you have spent a week of back-and-forth and still have no plan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                1. Start with a rough destination idea, not a firm plan
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Pick a destination type — desert courses, coastal layout, mountain, classic parkland — rather than
                a specific resort. This gives you room to compare real options once you know what the group can
                spend. Locking in a destination before you have budget and date alignment is one of the most common
                planning mistakes groups make.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                2. Get budget ranges from everyone before you go further
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Budget is the variable that changes everything. A group that aligns on a $600-per-person range
                plans a completely different trip than one that aligns on $1,400. Ask for individual budget ranges
                privately — asking in a group chat anchors everyone to the first number posted, which is usually
                not the real range.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Outing.golf collects budget ranges individually so you see the real distribution before you plan
                the wrong trip.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                3. Nail down the date window early
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Dates are harder to move once you start booking. Get everyone's availability in the first round of
                planning, not after you have already found the perfect resort. Look for a window that works for
                most of the group, not a window that requires perfect attendance from everyone.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                4. Compare courses and lodging together, not separately
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Course quality and lodging options are tied to the same destinations. A good planning process
                evaluates them together so you are not building a shortlist of courses and a separate shortlist of
                lodging that never connects. Three real destination options with courses and lodging attached is
                better than ten half-researched ideas.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                5. Make a call and commit
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Most golf trips stall at the decision point. The organizer has the data, the group has shared
                preferences, but nobody calls it. Once you have budget overlap and date alignment, pick the
                strongest destination option and book the thing. The group will adjust.
              </p>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/68">
                <li>1. Start with a destination type</li>
                <li>2. Collect budget ranges early</li>
                <li>3. Lock in a date window</li>
                <li>4. Compare courses and lodging together</li>
                <li>5. Make the call</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">
                    Golf trip planning checklist
                  </a>
                </li>
                <li>
                  <a href="/golf-trip-budget-planner" className="text-forest-900 underline-offset-2 hover:underline">
                    Golf trip budget planner
                  </a>
                </li>
                <li>
                  <a href="/how-it-works" className="text-forest-900 underline-offset-2 hover:underline">
                    How Outing.golf works
                  </a>
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Stop planning by group text
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, courses, and lodging preferences from the group in one place so
            you can actually make a decision.
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
