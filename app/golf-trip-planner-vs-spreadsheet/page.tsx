import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Golf Trip Planner vs. Spreadsheet | Outing.golf",
  description:
    "Most golf trip organizers start with a spreadsheet. Here is why a purpose-built golf trip planning tool gets groups to a decision faster."
};

const comparison = [
  {
    topic: "Data collection",
    spreadsheet:
      "You build the template, share a link, send follow-up reminders, and manually consolidate whatever comes back — if it comes back at all.",
    planner:
      "Each invitee gets a direct prompt and fills in their budget, dates, and preferences in one short flow. Responses aggregate automatically."
  },
  {
    topic: "Budget aggregation",
    spreadsheet:
      "You manually read through the ranges, build your own summary, and hope everyone filled it in the same format.",
    planner:
      "Budget ranges are collected privately and shown as a real distribution. You see where the group actually lines up, not just the numbers they typed."
  },
  {
    topic: "Date overlap",
    spreadsheet:
      "You eyeball availability columns or build a formula to count overlapping cells — then re-check every time someone updates their row.",
    planner:
      "Date overlap is surfaced automatically. The best window appears without you having to count anything."
  },
  {
    topic: "Destination comparison",
    spreadsheet:
      "You build a separate tab, copy in course and lodging info, try to link it to the preferences — and it still does not really connect.",
    planner:
      "Destinations, courses, and lodging stay tied to the same shortlist. Group preferences inform which options rank higher."
  },
  {
    topic: "Version control",
    spreadsheet:
      "Someone edits a cell, someone else works in a cached copy, a third person comments in a thread. You are not sure which version is current.",
    planner:
      "One planning thread. One version. Everyone sees the same state."
  }
];

export default function GolfTripPlannerVsSpreadsheetPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip planner vs. spreadsheet
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Spreadsheets are not bad tools. They are just not built for collecting input from a scattered group of
            people who respond at different times, change their minds, and mostly do not read instructions. Here is
            how a purpose-built golf trip planning tool handles the same problems differently.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-5">
          {comparison.map((row) => (
            <Card key={row.topic} className="p-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{row.topic}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/40">Spreadsheet</p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{row.spreadsheet}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-900">Outing.golf</p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{row.planner}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            When a spreadsheet is still fine
          </h2>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            If you are planning a trip for two or three people who already talk regularly and trust each other's
            judgment, a shared doc works. The coordination overhead is low enough that a tool adds no real value.
          </p>
          <p className="mt-3 text-base leading-7 text-charcoal/68">
            As soon as you have more than four or five people with different schedules and different budgets, the
            spreadsheet becomes the bottleneck. Someone has to manage it, follow up on it, and keep it current —
            and that person is usually the same one who organized the whole trip.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "How it works",
              href: "/how-it-works",
              body: "See the full workflow Outing.golf uses to replace the spreadsheet."
            },
            {
              title: "Back to home",
              href: "/",
              body: "See what Outing.golf does and start your first outing."
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
            Replace the spreadsheet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects group input automatically, aggregates budgets and dates, and keeps everything in
            one planning thread instead of a shared doc nobody fills out the same way.
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
