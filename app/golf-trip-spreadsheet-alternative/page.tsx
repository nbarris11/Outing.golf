import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Golf Trip Spreadsheet Alternative | Outing.golf",
  description:
    "Why a spreadsheet breaks down when you are organizing a golf trip for a group — and what a purpose-built golf trip planning tool does differently."
};

const gaps = [
  {
    problem: "You have to build it yourself",
    detail:
      "A spreadsheet is a blank canvas. You spend time designing the template, setting up columns for budget, dates, and preferences — before you have collected a single response from the group. Every organizer rebuilds this from scratch.",
    toolResponse:
      "Outing.golf is already structured for golf trip planning. Budget collection, date availability, course preferences, and lodging input are all built in."
  },
  {
    problem: "You can't collect budget ranges privately",
    detail:
      "If you share a spreadsheet for budget input, everyone can see what everyone else enters. The first number anchors the group. People adjust up or down based on what they see, not what they can actually spend.",
    toolResponse:
      "Budget ranges are collected individually and privately. The organizer sees the real distribution — not a socially influenced number."
  },
  {
    problem: "Date overlap requires manual work",
    detail:
      "Finding the date window that works for most of the group requires you to read through availability rows, build a formula, and re-check every time someone updates their response.",
    toolResponse:
      "Date overlap surfaces automatically. The best window appears without building anything."
  },
  {
    problem: "It doesn't connect to destinations, courses, or lodging",
    detail:
      "The spreadsheet holds input from the group, but destinations, courses, and lodging live somewhere else — a separate tab, a shared doc, a list of links in the group chat. Nothing connects to anything.",
    toolResponse:
      "Group input, destination options, courses, and lodging are all in the same planning thread. Preferences inform which options rank higher."
  },
  {
    problem: "Version control is a real problem",
    detail:
      "Someone edits a cell. Someone else opens a cached version. A third person starts a new copy. You end up with three versions of the spreadsheet and no clear answer about which one is current.",
    toolResponse:
      "One planning thread. One version. Everyone sees the same state."
  },
  {
    problem: "Following up is all on you",
    detail:
      "When someone hasn't responded, the spreadsheet doesn't tell you. You have to check who filled it in, figure out who hasn't, and send individual reminders.",
    toolResponse:
      "Response status is visible in one place. You know immediately who has responded and who hasn't."
  }
];

export default function GolfTripSpreadsheetAlternativePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip spreadsheet alternative
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Spreadsheets are not bad tools. For two or three people who already talk regularly, a shared doc is
            fine. But for a group trip with 6 to 16 people, different schedules, and different budgets, the
            spreadsheet becomes the bottleneck — not because it is poorly built, but because it was never
            designed for what you are trying to do with it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-5">
          {gaps.map((gap) => (
            <Card key={gap.problem} className="p-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{gap.problem}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/40">Spreadsheet</p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{gap.detail}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-900">Outing.golf</p>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{gap.toolResponse}</p>
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
              When the spreadsheet is still the right tool
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              If you are planning a trip for two or three people who already agree on most things, a shared doc
              works fine. The coordination overhead is low enough that a purpose-built tool adds no real value.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The spreadsheet starts to break down once you add more people with genuinely different schedules,
              different budgets, and different opinions about where to go. That is where group coordination
              becomes a real problem — and where a tool that was built for this specific situation makes the
              difference.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              What the best golf trip planning app actually does
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The best golf trip planning software is not trying to replace Google Sheets with a prettier
              interface. It solves the specific coordination problems that a spreadsheet cannot: private budget
              collection, automatic date overlap, connected destination research, and a single view that the whole
              group can see without version confusion.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Outing.golf is built around that workflow. The organizer creates an outing, invitees fill out a
              short preference flow, and the results aggregate automatically — so the planning work takes minutes
              instead of days.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Golf trip planner vs. spreadsheet", href: "/golf-trip-planner-vs-spreadsheet", body: "A detailed side-by-side comparison across every planning task." },
            { title: "How it works", href: "/how-it-works", body: "See the full workflow Outing.golf uses to replace the spreadsheet and group chat." },
            { title: "Golf trip planning checklist", href: "/golf-trip-planning-checklist", body: "Everything the organizer needs to track — phase by phase." }
          ].map((item) => (
            <a key={item.href} href={item.href} className="group rounded-[26px] border border-charcoal/8 bg-white/86 p-5 transition hover:bg-white hover:shadow-sm">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal group-hover:text-forest-900">{item.title}</h3>
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
            one place so the organizer is not managing a shared doc nobody fills out the same way.
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
