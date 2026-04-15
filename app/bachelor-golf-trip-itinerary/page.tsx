import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Bachelor Golf Trip Itinerary Template | Outing.golf",
  description:
    "A practical bachelor golf trip itinerary template — day-by-day structure for a 3 to 4 day trip, what to settle before you build it, and how to keep the whole group on the same page."
};

const days = [
  {
    label: "Day 1 — Thursday",
    title: "Arrival and warm-up round",
    slots: [
      { time: "Afternoon", what: "Flights land, rental cars picked up, check-in to lodging. Build in extra buffer — group arrivals always take longer than planned." },
      { time: "Late afternoon", what: "Optional warm-up 9 holes or range session if tee times are available and the group has energy after travel." },
      { time: "Evening", what: "First group dinner. Everyone is finally in the same place — this is the easy night. Pick a place with a reservation and keep it casual." }
    ]
  },
  {
    label: "Day 2 — Friday",
    title: "Main round",
    slots: [
      { time: "Morning tee time", what: "The marquee course. Morning tee times are better — conditions are stronger and there is more day left. This should be the course the group voted most excited about." },
      { time: "Afternoon", what: "Free time. Depending on the destination — pool, range, short game — or just decompress. Do not over-schedule Day 2 afternoon." },
      { time: "Evening", what: "Group dinner or night out depending on the destination. Scottsdale and Myrtle Beach have options; Pinehurst and Bandon are more low-key. Match the evening to the destination." }
    ]
  },
  {
    label: "Day 3 — Saturday",
    title: "Second round and bachelor activities",
    slots: [
      { time: "Morning tee time", what: "Second course on the schedule. This is often the round the group competes on — skins, scramble format, or match play works well on Day 3." },
      { time: "Afternoon", what: "If there are any non-golf activities (fishing, shooting range, etc.) this is the right slot." },
      { time: "Evening", what: "The main bachelor party dinner. Make a reservation. This is the night worth investing in — a table somewhere good, not the hotel bar." }
    ]
  },
  {
    label: "Day 4 — Sunday",
    title: "Final round and departure",
    slots: [
      { time: "Early morning", what: "Final round — early tee time only if flights allow reasonable departure after. 9 holes is perfectly appropriate if the group is tired or flights are tight." },
      { time: "Check-out", what: "Coordinate check-out and luggage in advance. Staggered departures always create more chaos than the group expects." },
      { time: "Afternoon", what: "Travel home. The trip does not need a scheduled ending — let it wind down naturally." }
    ]
  }
];

export default function BachelorGolfTripItineraryPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Bachelor golf trip itinerary
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A 3 to 4 day bachelor golf trip has a specific structure: enough golf to justify calling it a golf
            trip, enough flexibility that people are not exhausted by Day 3, and a few intentional moments that
            mark it as the bachelor trip rather than just the annual buddies outing. This template walks through
            the day-by-day structure and what needs to be sorted before you build the itinerary.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-8">

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                What to settle before the itinerary
              </h2>
              <div className="mt-5 space-y-2">
                {[
                  "Confirmed dates — bachelor trips have a hard deadline (the wedding), so get dates early",
                  "Budget ranges from everyone, collected privately before the group chat starts",
                  "Destination that fits budget and works for the mix of golfers in the group",
                  "The groom's course preferences or bucket-list requests if you want to incorporate them",
                  "Tee time reservations at priority courses — these fill up, especially on weekends"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-3">
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-charcoal/20" />
                    <p className="text-sm leading-6 text-charcoal/68">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                4-day bachelor golf trip itinerary
              </h2>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                This structure works for most destinations. Adjust tee times and evening activities based on
                where you are going.
              </p>
              <div className="mt-5 space-y-5">
                {days.map((day) => (
                  <Card key={day.label} className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex h-7 items-center rounded-full bg-forest-900/10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest-900">
                        {day.label}
                      </span>
                      <h3 className="font-serif text-xl font-semibold tracking-[-0.03em] text-charcoal">
                        {day.title}
                      </h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {day.slots.map((slot) => (
                        <div key={slot.time} className="grid gap-1 rounded-[16px] bg-cream px-4 py-3 sm:grid-cols-[120px_1fr]">
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
                What makes a bachelor golf trip feel different
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The difference between a regular buddies trip and a bachelor trip is mostly intentionality. A few
                things that make the distinction clear without turning it into a production:
              </p>
              <div className="mt-5 space-y-3">
                {[
                  { title: "One marquee round", detail: "Build the golf schedule around one course that is worth the splurge — somewhere the groom has wanted to play or a genuinely special layout. The rest of the rounds can be value-tier." },
                  { title: "A real dinner", detail: "One proper dinner with a reservation, not just the hotel restaurant. This does not need to be expensive — it just needs to feel like an occasion." },
                  { title: "The groom does not plan it", detail: "The organizer's job is to handle everything so the groom shows up and has a great time. Keep the logistics and chaos away from him." },
                  { title: "A format for the golf", detail: "Skins, best ball, or match play gives the golf a competitive structure and makes the rounds more memorable. Set it up in advance so nobody is arguing about format on the first tee." }
                ].map((item) => (
                  <div key={item.title} className="rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-4">
                    <p className="text-sm font-semibold text-charcoal">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-charcoal/68">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a href="/bachelor-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">Bachelor golf trip planner</a></li>
                <li><a href="/golf-trip-itinerary-template" className="text-forest-900 underline-offset-2 hover:underline">Golf trip itinerary template</a></li>
                <li><a href="/golf-trip-budget-breakdown" className="text-forest-900 underline-offset-2 hover:underline">Golf trip budget breakdown</a></li>
                <li><a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf trip planning checklist</a></li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Destination ideas</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a href="/scottsdale-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">Scottsdale</a></li>
                <li><a href="/myrtle-beach-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">Myrtle Beach</a></li>
                <li><a href="/palm-springs-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">Palm Springs</a></li>
                <li><a href="/pinehurst-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">Pinehurst</a></li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Group golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            One place for the whole bachelor trip plan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and preferences from the crew in one place — so you can stop
            herding replies and start building the actual itinerary.
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
