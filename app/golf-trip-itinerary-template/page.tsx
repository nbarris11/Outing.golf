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
  title: "Golf Trip Itinerary Template — Day-by-Day Group Trip Planner",
  description:
    "A day-by-day itinerary template for group golf trips. Arrival through departure, with time slots, pre-trip tasks, and a 2-day weekend version.",
  path: "/golf-trip-itinerary-template"
});

const days = [
  {
    label: "Day 1",
    title: "Arrival and first round",
    slots: [
      { time: "Morning / early afternoon", what: "Travel and check-in. Leave buffer here — flights get delayed, bags take time." },
      { time: "Afternoon tee time", what: "First round. Pick a course that is exciting but not exhausting. You want everyone energized for the rest of the trip." },
      { time: "Evening", what: "Group dinner. This is the easiest night to organize since everyone is in the same place for the first time." }
    ]
  },
  {
    label: "Day 2",
    title: "Main round",
    slots: [
      { time: "Morning tee time", what: "The marquee course. Morning tee times are worth it — better conditions, more time for the rest of the day." },
      { time: "Afternoon", what: "Free time, short game practice, or optional 9 holes if the group wants more." },
      { time: "Evening", what: "Group dinner or individual plans. By Day 2 the group usually splits naturally." }
    ]
  },
  {
    label: "Day 3",
    title: "Second main round",
    slots: [
      { time: "Morning tee time", what: "Second course on the schedule. Good time to play the course the group voted most excited about if you saved it." },
      { time: "Afternoon", what: "Recovery time. Do not over-schedule here — most groups hit a wall by Day 3 afternoon." },
      { time: "Evening", what: "Group dinner. Last full night together — worth a reservation somewhere good." }
    ]
  },
  {
    label: "Day 4",
    title: "Final round and departure",
    slots: [
      { time: "Early morning tee time", what: "If flights allow. Keep it to 9 holes or a quick 18 to allow check-out and travel time." },
      { time: "Check-out", what: "Coordinate check-out logistics in advance. Staggered departures cause more chaos than most groups expect." },
      { time: "Departure", what: "Allow more time than you think. Post-trip logistics always take longer." }
    ]
  }
];

export default function GolfTripItineraryTemplatePage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Golf Trip Itinerary Template — Day-by-Day Group Trip Planner",
          description:
            "A day-by-day itinerary template for group golf trips. Arrival through departure, with time slots, pre-trip tasks, and a 2-day weekend version.",
          path: "/golf-trip-itinerary-template"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Golf trip itinerary template", path: "/golf-trip-itinerary-template" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip itinerary template
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            The standard group golf trip itinerary is 3 to 4 days with 3 rounds: travel plus an afternoon round on
            Day 1, your marquee course with a morning tee time on Day 2, a second main round on Day 3, and an
            optional early round before departure on Day 4. The full template below covers each day slot by slot —
            plus a compressed 2-day weekend version — and explains what needs to be decided before you start
            filling it in.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-10">

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Before you build the itinerary
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The itinerary is the last thing to build, not the first. Before you assign courses to days you need:
              </p>
              <div className="mt-5 space-y-2">
                {[
                  "A confirmed date window everyone can make",
                  "A budget range the group has actually agreed to",
                  "A destination that fits both of those",
                  "A course shortlist the group has voted on",
                  "A lodging situation that is booked or close to it"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-3">
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-charcoal/20" />
                    <p className="text-sm leading-6 text-charcoal/68">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal/60">
                If you are still working on any of those,{" "}
                <a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">
                  start with the planning checklist
                </a>{" "}
                before building the itinerary.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                3–4 day golf trip itinerary template
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                This structure works for most group trips of 4 to 16 players. Adjust based on your actual tee
                times, travel schedule, and how much golf the group wants to play.
              </p>
              <div className="mt-6 space-y-5">
                {days.map((day) => (
                  <Card key={day.label} className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 items-center rounded-full bg-forest-900/10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest-900">
                        {day.label}
                      </span>
                      <h3 className="font-serif text-xl font-semibold tracking-[-0.03em] text-charcoal">
                        {day.title}
                      </h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {day.slots.map((slot) => (
                        <div key={slot.time} className="grid gap-1 rounded-[16px] bg-cream px-4 py-3 sm:grid-cols-[160px_1fr]">
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
                What to fill in before you share it
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Replace the placeholders above with:
              </p>
              <div className="mt-5 space-y-2">
                {[
                  "Confirmed tee times at each course — name, time, and green fee per person",
                  "Lodging address and check-in / check-out times",
                  "Airport and ground transportation notes (who is driving, rental car pickup location)",
                  "Dinner reservations with address and time",
                  "Any pre-paid deposits or items the group needs to bring"
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
                How to share the itinerary with the group
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                A shared Google Doc works fine for the itinerary itself — the challenge is keeping it connected to
                everything else the group needs to see. Tee times live in one place, lodging confirmation in another,
                the packing list in a third.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Outing.golf keeps the itinerary, course schedule, and lodging all in one shared view every group
                member can see — so the organizer does not have to forward documents, pin messages, or re-explain
                the plan three times.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Golf weekend itinerary (2 days)
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                For a shorter trip, compress to two rounds across two days. The structure is simpler but the
                pre-planning requirements are the same — budget, dates, and course confirmation need to happen
                before anyone books travel.
              </p>
              <div className="mt-5 space-y-4">
                {[
                  { label: "Day 1", items: ["Arrive and check in", "Afternoon round — save your best course for Day 2", "Group dinner"] },
                  { label: "Day 2", items: ["Morning round — marquee course", "Lunch together", "Check out and travel home"] }
                ].map((day) => (
                  <Card key={day.label} className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-900">{day.label}</p>
                    <ul className="mt-3 space-y-2">
                      {day.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-6 text-charcoal/68">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/30" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/68">
                <li>Before you build the itinerary</li>
                <li>3–4 day template</li>
                <li>What to fill in</li>
                <li>How to share it</li>
                <li>Golf weekend version (2 days)</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf trip planning checklist</a></li>
                <li><a href="/golf-trip-budget-breakdown" className="text-forest-900 underline-offset-2 hover:underline">Golf trip budget breakdown</a></li>
                <li><a href="/how-to-plan-a-golf-trip" className="text-forest-900 underline-offset-2 hover:underline">How to plan a golf trip</a></li>
                <li><a href="/how-it-works" className="text-forest-900 underline-offset-2 hover:underline">How Outing.golf works</a></li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "How many rounds of golf should a 4-day trip include?",
            answer:
              "Three rounds is the standard for a 3 to 4 day trip — one each on Days 1–3, with an optional early 9 or quick 18 on departure day if flights allow. Adding a fourth full round can add $150–$400 per person and most groups hit a physical wall by Day 3 afternoon anyway."
          },
          {
            question: "When should the marquee course go on the schedule?",
            answer:
              "Day 2 or Day 3 with a morning tee time. Day 1 is for travel and an easier afternoon round — flights get delayed and bags take time, so a marquee morning slot on arrival day is asking for trouble. Morning rounds at the big course mean better conditions and a free afternoon."
          },
          {
            question: "When should you build the itinerary?",
            answer:
              "Last. Before assigning courses to days you need a confirmed date window, an agreed budget range, a destination that fits both, a course shortlist the group has voted on, and lodging that is booked or close to it. Building the itinerary first just means rebuilding it later."
          },
          {
            question: "What is the best way to share a golf trip itinerary with the group?",
            answer:
              "A shared doc works for the schedule itself, but tee times, lodging confirmations, and packing lists tend to scatter across threads. Keeping the itinerary, course schedule, and lodging in one shared view — like Outing.golf's Trip HQ — means the organizer never has to re-forward the plan."
          }
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Build the itinerary once the group is aligned
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from the group first — so by the time you
            sit down to build the itinerary, the hard decisions are already made.
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
