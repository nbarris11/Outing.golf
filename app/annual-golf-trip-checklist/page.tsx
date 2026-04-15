import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Annual Golf Trip Checklist for Recurring Group Organizers | Outing.golf",
  description:
    "A checklist built for organizers who run the same golf trip every year — what to do differently once it repeats, how to build on what worked, and how to stop re-learning the same lessons."
};

const phases = [
  {
    label: "Right after the trip ends",
    title: "Capture what you know while it's fresh",
    items: [
      "Note which courses the group ranked highest — this is the data that disappears fastest",
      "Flag any courses that underperformed relative to price or reputation",
      "Record the actual per-person cost so you have a real baseline for next year",
      "Note any logistical friction (check-in chaos, lodging issues, slow tee times) worth avoiding next year",
      "Ask one or two people directly: what would they change?"
    ]
  },
  {
    label: "One to two months out",
    title: "Lock in who's in before you start planning",
    items: [
      "Send a soft save-the-date before you have any details — people drop out when they hear the date last",
      "Collect availability for potential windows before you do any research",
      "Get a budget range from each person individually before discussing options in the group",
      "Confirm the core group vs. optional additions before you set the headcount",
      "Decide early whether you are returning to the same destination or trying something new"
    ]
  },
  {
    label: "Six to eight weeks out",
    title: "Build on last year instead of starting over",
    items: [
      "Check tee time availability at priority courses before committing to dates — availability drives timing, not the other way around",
      "If returning to the same destination, compare courses you haven't played yet against ones the group already loved",
      "If going somewhere new, use last year's per-person spend as your anchor for building the shortlist",
      "Book lodging as soon as the dates are confirmed — group lodging fills faster than individual rooms",
      "Confirm tee times as soon as lodging is locked"
    ]
  },
  {
    label: "Two to three weeks out",
    title: "Lock the logistics before the group starts improvising",
    items: [
      "Confirm who is sharing rooms or rental cars and collect any remaining payment",
      "Set up the golf format (skins, scramble, match play) now — do not leave it for the first tee",
      "Send the confirmed itinerary to the full group with tee times, lodging address, and check-in instructions",
      "Make dinner reservations for any evenings that need them",
      "Collect any food, accessibility, or schedule accommodations from the group"
    ]
  },
  {
    label: "During the trip",
    title: "Protect the things that take coordination",
    items: [
      "Keep a shared note of who owes what — settle it during the trip, not after",
      "Track the competition scores (skins, handicap results) in real time if you want the data later",
      "Take a group photo — it seems obvious until nobody does it",
      "Note anything that comes up mid-trip worth remembering for next year"
    ]
  }
];

const yearOverYearItems = [
  {
    title: "Rotate who has input on the destination",
    detail: "If the same person picks the destination every year, the trip reflects one person's preferences. A lightweight vote — two or three options based on the group's budget — keeps everyone invested."
  },
  {
    title: "Adjust the format to keep it competitive",
    detail: "After a few years, handicap gaps widen and the same people win. Consider reformatting every other year — net scoring, new teams, or switching from skins to scramble — to keep the golf interesting for the full group."
  },
  {
    title: "Build a trip archive",
    detail: "A simple document with destination, per-person cost, courses played, and group rankings turns your past trips into useful planning data. By year three or four, you know which destination tier your group actually prefers and what courses are worth revisiting."
  },
  {
    title: "Set the next year's date before this year's trip ends",
    detail: "The easiest time to confirm next year's dates is when everyone is together and the trip is fresh. A tentative date agreed on in person gets a much better response rate than a message sent three months later."
  }
];

export default function AnnualGolfTripChecklistPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Annual golf trip checklist
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Organizing the same golf trip every year is a different job than organizing it for the first time. You
            have institutional knowledge the group does not have — which courses worked, what the real cost was,
            where the logistics broke down. The goal is to use that knowledge so the trip gets better year over
            year instead of re-learning the same lessons on repeat.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-8">

            <div className="space-y-5">
              {phases.map((phase) => (
                <Card key={phase.label} className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex h-7 items-center rounded-full bg-forest-900/10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest-900">
                      {phase.label}
                    </span>
                    <h2 className="font-serif text-xl font-semibold tracking-[-0.03em] text-charcoal">
                      {phase.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-2">
                    {phase.items.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[16px] bg-cream px-4 py-3">
                        <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-charcoal/20" />
                        <p className="text-sm leading-6 text-charcoal/68">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                What to do differently once the trip repeats
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                A first-year trip is mostly about figuring out what works. By year two or three, the structure is
                set — the challenge shifts to keeping it from going stale. A few things worth building in as the
                trip becomes a tradition:
              </p>
              <div className="mt-5 space-y-3">
                {yearOverYearItems.map((item) => (
                  <div key={item.title} className="rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-4">
                    <p className="text-sm font-semibold text-charcoal">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-charcoal/68">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                The recurring organizer problem
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Annual trip organizers carry more logistics knowledge than anyone else in the group — but the
                actual coordination work does not get easier over time. Budget ranges still need to be collected.
                Dates still need to be confirmed. Course options still need to be compared and voted on. The
                content changes year to year even when the process is the same.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Outing.golf runs this process for recurring trips — collecting group input each year without
                starting from scratch, carrying forward the preferences and budget data that do not change, and
                keeping the shortlist and decisions in one place instead of scattered across a new chain of texts
                and emails each time.
              </p>
            </div>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/68">
                <li>Right after the trip</li>
                <li>One to two months out</li>
                <li>Six to eight weeks out</li>
                <li>Two to three weeks out</li>
                <li>During the trip</li>
                <li>Year-over-year improvements</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf trip planning checklist</a></li>
                <li><a href="/golf-weekend-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf weekend planning checklist</a></li>
                <li><a href="/organize-a-golf-trip-with-friends" className="text-forest-900 underline-offset-2 hover:underline">How to organize a golf trip</a></li>
                <li><a href="/golf-trip-cost-per-person" className="text-forest-900 underline-offset-2 hover:underline">Golf trip cost per person</a></li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Annual golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Run your annual trip without starting over each year
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf keeps your group's budget ranges, preferences, and past decisions in one place — so
            every year you are building on what worked instead of rebuilding from scratch.
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
