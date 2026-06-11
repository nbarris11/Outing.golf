import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { CheckCircle2 } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { AuthCta } from "@/components/marketing/auth-cta";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema, howToSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Golf Trip Planning Checklist for Group Organizers | Outing.golf",
  description:
    "A phase-by-phase golf trip planning checklist with a 16-week timeline. From destination type to packing list — and what goes wrong when each phase gets skipped.",
  path: "/golf-trip-planning-checklist"
});

const checklist = [
  {
    section: "Trip basics",
    why: "This phase sets the frame every later decision hangs on. Skip it and the group spends weeks comparing destinations that were never compatible — a desert resort trip and a drive-to weekend are different products at different prices. Naming one organizer matters just as much: trips with two half-organizers reliably produce zero bookings.",
    items: [
      "Decide on the destination type (desert, coastal, mountain, classic)",
      "Confirm the group size and who is organizing",
      "Set a rough timing window (season, month, length of stay)"
    ]
  },
  {
    section: "Budget",
    why: "Budget misalignment is the number-one trip killer. When this phase gets skipped, the destination gets chosen by the most enthusiastic (usually highest-budget) voice, and two players quietly drop out a month later. Collecting ranges privately matters because group chats anchor everyone to the first number posted — which is rarely the honest one.",
    items: [
      "Collect individual budget ranges privately before discussing as a group",
      "Identify the realistic range the majority of the group fits inside",
      "Decide what is included: flights, lodging, greens fees, meals, extras"
    ]
  },
  {
    section: "Date alignment",
    why: "Dates are the hardest variable to move once money is down. Groups that skip this phase find the perfect resort first, then discover the only available weekend works for five of eight players. Confirm the window before you fall in love with rates — lodging quotes for dates you have not verified are fiction.",
    items: [
      "Collect availability from everyone in the first round",
      "Find the date window that works for most of the group",
      "Confirm the window before committing to any rates or bookings"
    ]
  },
  {
    section: "Destination shortlist",
    why: "Two or three complete options beat ten half-researched ideas, because the group can only vote on packages that actually exist. Skipping the research here is how trips end up with a famous course 50 minutes from the house and a 'lodging situation' that splits the group across two properties. Check lodging against your confirmed dates, not generic availability.",
    items: [
      "Narrow to two or three real destination options",
      "Research course options and quality at each destination",
      "Check lodging availability and pricing for the confirmed date window"
    ]
  },
  {
    section: "Decision",
    why: "This is where most trips stall — the organizer has the data, the group has opinions, and nobody calls it. A shortlist with courses and lodging attached forces a real comparison instead of a vibes debate. Set a voting deadline and honor it: a decision made at 80% confidence this week beats a perfect decision that never happens.",
    items: [
      "Present the shortlist to the group with courses and lodging attached",
      "Collect preferences or vote on the final destination",
      "Make the call — pick one option and move forward"
    ]
  },
  {
    section: "Booking",
    why: "Order matters: lodging locks the dates and headcount, so it goes first. Tee times at popular courses open 60–90 days out and prime weekend slots go fast — book the marquee round before the filler rounds. And collect deposits the same week you book: a trip with money down holds its roster, while a trip on verbal commitments loses a player a month.",
    items: [
      "Book lodging first to lock the dates",
      "Reserve tee times at priority courses",
      "Collect deposits or payments from the group",
      "Send a trip summary with dates, address, tee times, and any logistics"
    ]
  }
];

const timeline = [
  {
    when: "16 weeks out",
    what: "Run the Trip basics and Budget phases. Float the trip, name the organizer, collect budget ranges and availability from everyone. This week of input-gathering is what every later phase depends on."
  },
  {
    when: "12 weeks out",
    what: "Finish Date alignment and the Destination shortlist. Present 2–3 complete options, hold the vote, make the call, and book the lodging while group-sized houses are still available. Collect deposits now."
  },
  {
    when: "8 weeks out",
    what: "Booking phase: reserve tee times as the 60–90 day windows open, starting with the course the trip is built around. Confirm the headcount is final — this is the last cheap moment for changes."
  },
  {
    when: "4 weeks out",
    what: "Collect final payments, confirm everyone's travel and arrival times, build the round-by-round schedule, and make dinner reservations for the nights that need them."
  },
  {
    when: "Week of",
    what: "Reconfirm tee times and lodging check-in, send the final trip summary with addresses and times, share the packing list, and assign cars. Then go play golf."
  }
];

const faqs = [
  {
    question: "How far in advance should I start this checklist?",
    answer:
      "Start about 16 weeks (4 months) out for most trips, and closer to 6 months for peak-season destinations like Scottsdale in March or Myrtle Beach in spring. The active work only takes a few weeks — the lead time exists because group lodging and prime tee times disappear 2–4 months ahead."
  },
  {
    question: "What is the most commonly skipped step?",
    answer:
      "Collecting budget ranges privately before any group discussion. Most organizers skip straight to destination talk, and the trip gets priced to the loudest voice instead of the group's real overlap. It is also the skipped step with the worst consequences — budget surprises are why players drop out late."
  },
  {
    question: "What should I book first, lodging or tee times?",
    answer:
      "Lodging first. It locks the dates and the headcount, and group-sized houses are scarcer than tee times. Then reserve tee times at your priority courses as their booking windows open — typically 60–90 days out for top public courses as of 2026."
  },
  {
    question: "What if someone drops out after I have booked?",
    answer:
      "This is what deposits are for. Collect $100–$300 per person the same week the group commits, and make clear deposits are non-refundable once bookings are made. For groups of 10 or more, build the budget assuming you lose one player so a single dropout does not raise everyone else's share."
  },
  {
    question: "Do I need a full checklist for a short weekend trip?",
    answer:
      "The phases are the same but the timeline compresses — about 8 weeks instead of 16, with budget and dates collected in the same ask. A 2-day drive-to trip forgives shortcuts that a fly-in week does not, but skipping budget collection still burns weekend trips regularly."
  }
];

export default function GolfTripPlanningChecklistPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Golf Trip Planning Checklist for Group Organizers",
          description:
            "A phase-by-phase golf trip planning checklist with a 16-week timeline. From destination type to packing list — and what goes wrong when each phase gets skipped.",
          path: "/golf-trip-planning-checklist"
        })}
      />
      <JsonLd
        data={howToSchema({
          name: "Golf Trip Planning Checklist",
          description:
            "A phase-by-phase checklist for planning a group golf trip in the right order, from trip basics through booking.",
          path: "/golf-trip-planning-checklist",
          steps: checklist.map((group) => ({
            name: group.section,
            text: group.items.join(". ") + "."
          }))
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Golf Trip Planning Checklist", path: "/golf-trip-planning-checklist" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip planning checklist for organizers
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A golf trip planning checklist has six phases, run in this order: trip basics, budget, date alignment,
            destination shortlist, decision, and booking — starting about 16 weeks before the trip. Most planning
            goes sideways because the phases get run out of order: destination gets picked before budget is set,
            tee times get reserved before dates are confirmed.
          </p>
          <p className="mt-3 text-lg leading-8 text-charcoal/68">
            Below is each phase with its checklist items, why the phase matters, and a week-by-week timeline so you
            know when each one should happen. For the narrative version of this process,{" "}
            <a href="/how-to-plan-a-golf-trip" className="text-forest-900 underline-offset-2 hover:underline">
              see the full guide to planning a golf trip
            </a>
            .
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {checklist.map((group, index) => (
            <Card key={group.section} className="p-6">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">
                {index + 1}. {group.section}
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.6] text-charcoal/68">{group.why}</p>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-900" />
                    <span className="text-sm leading-6 text-charcoal/68">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-base leading-7 text-charcoal/68">
            One note on how to use the phases: finish each one before starting the next. The temptation is to run
            them in parallel — researching resorts while budget answers trickle in — but parallel planning is how
            the group falls in love with a destination the overlap cannot afford. Each phase exists to feed the
            one after it: basics frame the budget question, budget and dates filter the shortlist, the shortlist
            makes the decision easy, and the decision makes booking mechanical. Run in order, none of the steps
            is hard; run out of order, every one of them gets re-done.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Timeline</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            When should each phase happen?
          </h2>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            The checklist phases map onto a 16-week timeline for most trips. Peak-season destinations deserve more
            runway — closer to 6 months — and a drive-to weekend can compress the whole thing into 8 weeks. The
            sequence stays the same either way; only the spacing changes.
          </p>
        </div>
        <div className="mt-7 space-y-3">
          {timeline.map((row) => (
            <div
              key={row.when}
              className="flex flex-col gap-1 rounded-[18px] border border-charcoal/8 bg-white/80 px-5 py-4 sm:flex-row sm:gap-5"
            >
              <p className="w-36 shrink-0 text-sm font-semibold tracking-[-0.01em] text-charcoal">{row.when}</p>
              <p className="text-sm leading-6 text-charcoal/68">{row.what}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-base leading-7 text-charcoal/68">
          Once the trip is booked, the remaining work is itinerary-shaped: arrival logistics, the round-by-round
          schedule, dinners, and the packing list. A{" "}
          <a href="/golf-trip-itinerary-template" className="text-forest-900 underline-offset-2 hover:underline">
            golf trip itinerary template
          </a>{" "}
          covers that final stretch so you are not building the day-by-day plan from scratch.
        </p>
      </section>

      <FaqSection title="Checklist FAQs" faqs={faqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "The narrative version — five steps from scattered idea to confirmed trip."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why collecting real budget ranges from everyone early changes the whole planning process."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "What each major destination costs and what to know before you plan there."
            },
            {
              title: "Golf weekend planning checklist",
              href: "/golf-weekend-planning-checklist",
              body: "A tighter checklist for planning a 2-day golf weekend with a group."
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
            Outing.golf handles most of this list
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Instead of running through this checklist manually, use Outing.golf to collect group input
            automatically — budget, dates, course preferences, and lodging — all in one place.
          </p>
          <div className="mt-8">
            <AuthCta className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </AuthCta>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
