import type { Metadata } from "next";

import { CheckCircle2 } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Golf Trip Planning Checklist for Organizers | Outing.golf",
  description:
    "A practical golf trip planning checklist covering every phase — from budget collection and date alignment to course selection, lodging, and the final itinerary."
};

const checklist = [
  {
    section: "Trip basics",
    items: [
      "Decide on the destination type (desert, coastal, mountain, classic)",
      "Confirm the group size and who is organizing",
      "Set a rough timing window (season, month, length of stay)"
    ]
  },
  {
    section: "Budget",
    items: [
      "Collect individual budget ranges privately before discussing as a group",
      "Identify the realistic range the majority of the group fits inside",
      "Decide what is included: flights, lodging, greens fees, meals, extras"
    ]
  },
  {
    section: "Date alignment",
    items: [
      "Collect availability from everyone in the first round",
      "Find the date window that works for most of the group",
      "Confirm the window before committing to any rates or bookings"
    ]
  },
  {
    section: "Destination shortlist",
    items: [
      "Narrow to two or three real destination options",
      "Research course options and quality at each destination",
      "Check lodging availability and pricing for the confirmed date window"
    ]
  },
  {
    section: "Decision",
    items: [
      "Present the shortlist to the group with courses and lodging attached",
      "Collect preferences or vote on the final destination",
      "Make the call — pick one option and move forward"
    ]
  },
  {
    section: "Booking",
    items: [
      "Book lodging first to lock the dates",
      "Reserve tee times at priority courses",
      "Collect deposits or payments from the group",
      "Send a trip summary with dates, address, tee times, and any logistics"
    ]
  }
];

export default function GolfTripPlanningChecklistPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip planning checklist for organizers
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Most golf trip planning goes sideways because decisions get made in the wrong order. Destination gets
            picked before budget is set. Tee times get reserved before dates are confirmed. This checklist walks
            through the steps in the right sequence so nothing important gets skipped.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {checklist.map((group) => (
            <Card key={group.section} className="p-6">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">{group.section}</h2>
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
              title: "How it works",
              href: "/how-it-works",
              body: "See how Outing.golf handles most of this checklist automatically."
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
            <Button href="/sign-up" className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
