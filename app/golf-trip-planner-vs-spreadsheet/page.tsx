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
  title: "Golf Trip Planner vs. Spreadsheet: What Actually Works",
  description:
    "Why a purpose-built golf trip planner handles what a shared spreadsheet can't — from private budget collection to group voting in one place.",
  path: "/golf-trip-planner-vs-spreadsheet"
});

const comparison = [
  {
    topic: "Collecting 8 guys' budgets and dates",
    spreadsheet:
      "You build the template, share a link, and spend roughly two weeks of group-chat nudges and reminder texts manually consolidating whatever comes back — if it comes back at all.",
    planner:
      "Each invitee gets one link and a form that takes about 3 minutes. Responses aggregate automatically — the median group finishes responding within 24 hours."
  },
  {
    topic: "Budget privacy",
    spreadsheet:
      "Budgets are visible to everyone in the shared sheet. The first number entered anchors what everyone else types — so you get social calibration, not real ranges.",
    planner:
      "Budget ranges are submitted privately — nobody sees anyone else's number. You see the real distribution of where the group actually lines up."
  },
  {
    topic: "Date overlap",
    spreadsheet:
      "You eyeball availability columns or build a formula to count overlapping cells — then re-check every time one of 8+ people edits their row.",
    planner:
      "Date overlap is surfaced automatically. The best window appears without you having to count anything, and it updates itself when responses change."
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
      <JsonLd
        data={articleSchema({
          title: "Golf Trip Planner vs. Spreadsheet: What Actually Works",
          description:
            "Why a purpose-built golf trip planner handles what a shared spreadsheet can't — from private budget collection to group voting in one place.",
          path: "/golf-trip-planner-vs-spreadsheet"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Golf trip planner vs. spreadsheet", path: "/golf-trip-planner-vs-spreadsheet" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip planner vs. spreadsheet
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            For groups of four or more, a purpose-built golf trip planner beats a spreadsheet on the three jobs
            that matter most: collecting 8 guys' budgets takes roughly two weeks of group-chat nudges with a shared
            sheet versus a 3-minute form each; budget submissions stay private instead of visible to the whole
            group; and date overlap is calculated for you instead of eyeballed across columns. Spreadsheets are not
            bad tools — they are just not built for a scattered group that responds at different times, changes its
            mind, and mostly does not read instructions.
          </p>
          <ArticleByline />
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
        <div className="max-w-3xl space-y-10">
          <div>
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

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              What about the group chat?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The group chat has the same fragmentation problem as a spreadsheet — just faster. Availability gets
              posted and buried. Budget numbers get anchored to whoever speaks first. Course ideas show up as links
              nobody clicks. And the organizer ends up re-reading 200 messages to reconstruct what the group
              actually said.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              A golf trip planner vs. group chat is not really a fair comparison — the chat was never built for
              structured input. It is good for enthusiasm and bad for decisions. A purpose-built tool collects the
              same input in a single flow, so the organizer sees the real picture without digging through the thread.
            </p>
          </div>
        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "Is a spreadsheet good enough for planning a golf trip?",
            answer:
              "For two or three people who already talk regularly, yes — the coordination overhead is low enough that a tool adds no real value. Past four or five people with different schedules and budgets, the spreadsheet becomes the bottleneck, and the person managing it is usually the same one organizing the whole trip."
          },
          {
            question: "What is the problem with collecting budgets in a shared sheet?",
            answer:
              "Everyone can see everyone else's number. The first budget entered anchors the rest — people calibrate up or down based on social dynamics, not their actual range. Private submission is the only way to get the group's real distribution."
          },
          {
            question: "How much faster is a planner than a spreadsheet for collecting group input?",
            answer:
              "With a shared sheet, collecting budgets and dates from 8 people typically takes a week or two of reminders and follow-up texts. With a direct link and a short form, each person responds in about 3 minutes on their own time — the median Outing.golf group finishes responding within 24 hours."
          },
          {
            question: "Does Outing.golf book tee times or lodging?",
            answer:
              "No. Outing.golf is the decision layer before booking — it collects budgets, dates, and preferences, surfaces live course and lodging options for the group to vote on, and keeps the final plan in a shared Trip HQ. You book through the course or lodging provider as usual."
          }
        ]}
      />

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
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist so nothing falls through the cracks."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why collecting private budget ranges first changes the entire planning process."
            },
            {
              title: "Golf trip itinerary template",
              href: "/golf-trip-itinerary-template",
              body: "The day-by-day template to fill in once the group is aligned."
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
