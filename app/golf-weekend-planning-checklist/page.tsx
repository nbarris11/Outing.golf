import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Golf Weekend Planning Checklist for Groups | Outing.golf",
  description:
    "A practical planning checklist for a 2-day golf weekend with a group — what to lock in before the weekend, what to handle day-of, and how to keep a short trip from turning into logistics overhead."
};

const beforeWeekend = [
  {
    phase: "Two to three weeks out",
    items: [
      "Confirm who is in — a golf weekend moves fast and last-minute additions break tee time configurations",
      "Agree on a rough per-person budget before you research anything",
      "Book tee times as soon as the group is confirmed — weekend morning slots fill up",
      "Decide on lodging if the group is traveling more than an hour: one rental or multiple hotel rooms",
      "Pick the format for the golf — skins, best ball, scramble — before you get there"
    ]
  },
  {
    phase: "One week out",
    items: [
      "Confirm the tee times and send them to everyone with the course address",
      "Clarify rental car situation if traveling — shared vs. individual",
      "Make a dinner reservation if the group wants a real meal on Saturday night",
      "Confirm check-in instructions for any shared lodging",
      "Collect any money owed for tee times or lodging deposits"
    ]
  },
  {
    phase: "Day before",
    items: [
      "Send the final tee time and logistics to the group in a single message — one place with all the info",
      "Confirm everyone knows the check-in or meeting point",
      "Have a backup plan if someone's flight or drive is delayed — know the flexibility on the tee time",
      "Bring cash or a group payment method if you are pooling costs"
    ]
  }
];

const dayOf = [
  {
    day: "Day 1 — Saturday",
    items: [
      { time: "Morning", what: "Travel or meet up. Build in buffer — groups are almost always slower to assemble than expected." },
      { time: "Tee time", what: "First round. Morning tee times are better for two reasons: cooler conditions and more day left after the round." },
      { time: "After the round", what: "Settle any scores or side bets while they are fresh. Disputed scorecards get harder to reconstruct later." },
      { time: "Evening", what: "Dinner as a group. This is the night worth investing in — a reservation somewhere good rather than whatever is convenient." }
    ]
  },
  {
    day: "Day 2 — Sunday",
    items: [
      { time: "Morning", what: "Second round — check-out from lodging first if required, or store bags. Coordinate departure timing before the round starts." },
      { time: "After the round", what: "Settle all group costs before anyone leaves. Collect what is owed, confirm splits, transfer anything outstanding." },
      { time: "Afternoon", what: "Travel home. Leave enough buffer between the end of the round and any flights or hard commitments." }
    ]
  }
];

const keepItShortTips = [
  {
    title: "Two rounds is the right amount for a weekend",
    detail: "Three rounds in two days is possible but usually leaves everyone tired by Sunday. Two rounds with a good dinner in the middle is the format that ages best."
  },
  {
    title: "Morning tee times both days",
    detail: "Late tee times on Sunday create flight risk. An 8am Sunday tee time means everyone is done by 1pm and can travel comfortably. Afternoon tee times on Sunday are a gamble."
  },
  {
    title: "Decide the format before you leave, not on the first tee",
    detail: "Group golf format debates on the first tee burn time and create friction. Send the format in the pre-weekend message — it takes 30 seconds and removes the discussion entirely."
  },
  {
    title: "One group message with all the logistics",
    detail: "A single message the day before with tee times, address, check-in info, and the dinner reservation eliminates the Sunday morning 'where are we going' texts."
  }
];

export default function GolfWeekendPlanningChecklistPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf weekend planning checklist
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A golf weekend — two days, two rounds, a group of 4 to 12 — sounds simple enough to not need much
            planning. That is how most of the logistics overhead happens: tee times that do not fit together,
            lodging confusion, format debates on the first tee, and money that gets sorted out three weeks later.
            This checklist covers what to handle before the weekend so the weekend itself is just golf.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-8">

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Before the weekend
              </h2>
              <div className="mt-5 space-y-5">
                {beforeWeekend.map((phase) => (
                  <Card key={phase.phase} className="p-6">
                    <span className="inline-flex h-7 items-center rounded-full bg-forest-900/10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest-900">
                      {phase.phase}
                    </span>
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
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Day-of schedule
              </h2>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                A standard two-day golf weekend structure that works for most groups.
              </p>
              <div className="mt-5 space-y-5">
                {dayOf.map((day) => (
                  <Card key={day.day} className="p-6">
                    <h3 className="font-serif text-xl font-semibold tracking-[-0.03em] text-charcoal">{day.day}</h3>
                    <div className="mt-4 space-y-3">
                      {day.items.map((slot) => (
                        <div key={slot.time} className="grid gap-1 rounded-[16px] bg-cream px-4 py-3 sm:grid-cols-[110px_1fr]">
                          <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal/50">{slot.time}</p>
                          <p className="text-sm leading-6 text-charcoal/68">{slot.what}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                How to keep a golf weekend from becoming a planning project
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The logistics for a two-day trip should take a few hours of coordination, not a few weeks. A few
                things that keep it manageable:
              </p>
              <div className="mt-5 space-y-3">
                {keepItShortTips.map((tip) => (
                  <div key={tip.title} className="rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-4">
                    <p className="text-sm font-semibold text-charcoal">{tip.title}</p>
                    <p className="mt-1 text-sm leading-6 text-charcoal/68">{tip.detail}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/68">
                <li>Two to three weeks out</li>
                <li>One week out</li>
                <li>Day before</li>
                <li>Day 1 — Saturday</li>
                <li>Day 2 — Sunday</li>
                <li>Keeping it manageable</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf trip planning checklist</a></li>
                <li><a href="/annual-golf-trip-checklist" className="text-forest-900 underline-offset-2 hover:underline">Annual golf trip checklist</a></li>
                <li><a href="/golf-trip-itinerary-template" className="text-forest-900 underline-offset-2 hover:underline">Golf trip itinerary template</a></li>
                <li><a href="/organize-a-golf-trip-with-friends" className="text-forest-900 underline-offset-2 hover:underline">How to organize a golf trip</a></li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Plan the golf weekend in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budget, dates, and course preferences from the group so you can confirm the
            plan before the first text thread starts — and keep the weekend logistics out of the group chat.
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
