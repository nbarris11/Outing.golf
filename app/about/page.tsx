import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Outing.golf | Built for Golf Trip Organizers",
  description:
    "Why Outing.golf exists, who it's for, and the story behind building a better way for groups to plan golf trips together.",
  alternates: {
    canonical: "https://www.outing.golf/about"
  }
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">About</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-charcoal sm:text-6xl">
          Built for the person who always ends up planning the trip
        </h1>

        <div className="mt-10 space-y-6 text-base leading-8 text-charcoal/72">
          <p>
            Every golf group has one. The person who sends the first text, chases down everyone&apos;s
            schedule, tries to make sense of four different budget levels, and somehow gets the whole
            thing booked before summer ends. I&apos;ve been that person. It&apos;s genuinely fun —
            and genuinely painful — at the same time.
          </p>
          <p>
            The problem isn&apos;t that organizers don&apos;t want to do the work. It&apos;s that the
            work is scattered across a group text, a shared Google doc that nobody updates, a
            spreadsheet you built at midnight, and a course website that doesn&apos;t show availability
            for your dates. There&apos;s no single place that ties all of it together.
          </p>
          <p>
            Outing.golf is that place. It gives organizers one tool to collect everyone&apos;s dates
            and budget, surface real course and lodging options matched to the group, let the group
            vote without a chaotic group thread, and give everyone a shared Trip HQ the moment the
            plan locks in.
          </p>
          <p>
            It&apos;s not trying to replace the booking sites or the tee-time apps. It sits one step
            before all of that — at the decision layer, where most golf trips actually fall apart.
          </p>
        </div>

        <Card className="mt-12 bg-[linear-gradient(135deg,rgba(20,58,44,0.06),rgba(247,244,238,0.9))]">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">The founder</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            Neil Barris
          </h2>
          <p className="mt-3 text-base leading-7 text-charcoal/68">
            I built Outing.golf because I needed it. After one too many group trips that almost
            didn&apos;t happen because the planning layer was a mess, I decided to build the tool I
            wished existed. It&apos;s designed for groups of 4–16, for weekend trips and annual
            pilgrimages alike, and for the organizer who cares enough to make it great.
          </p>
          <p className="mt-4 text-sm text-charcoal/55">
            Questions, feedback, or just want to say hi?{" "}
            <a
              href="mailto:hello@outing.golf"
              className="font-medium text-forest-900 underline-offset-2 hover:underline"
            >
              hello@outing.golf
            </a>
          </p>
        </Card>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/sign-up">Start planning your trip</Button>
          <Button href="/how-it-works" variant="secondary">See how it works</Button>
        </div>
      </section>
    </PageShell>
  );
}
