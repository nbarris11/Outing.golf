import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How to Organize a Golf Trip with Friends | Outing.golf",
  description:
    "A practical guide for organizing a golf trip with friends — what order to do things in, how to collect group input without the chaos, and how to get the group to a decision."
};

export default function OrganizeAGolfTripWithFriendsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            How to organize a golf trip with friends
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Someone always ends up running the trip. If that person is you, this guide covers the actual job —
            what to collect from the group, in what order, and how to move from scattered interest to a confirmed
            plan without spending three weeks in a group chat that goes nowhere.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-10">

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Step 1: Get input before you form opinions
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The first mistake most organizers make is sharing an idea before they have collected any real
                information. "What do you guys think about Scottsdale?" produces opinions, not data. You end up
                with a debate about destinations before you know whether the group can afford Scottsdale, whether
                anyone can make the dates, or whether half the group actually wants a different kind of trip.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Before you propose anything, find out: what budget range works for each person, what dates are
                available, and what kind of trip they are actually interested in. Collect this individually and
                privately — group discussions anchor around whoever speaks first.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Step 2: Lock in the budget window first
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Budget determines everything downstream — which destinations are realistic, which courses are on
                the table, and what kind of lodging makes sense. If you skip this step and go straight to
                researching places, you will almost certainly build a shortlist that does not fit the group.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Ask for a per-person range, not a yes-or-no to a specific number. "What range works for you,
                all-in for the trip?" gives you something useful. Once you have individual responses, the
                realistic window becomes obvious — and so does the destination tier you are planning for.
              </p>
              <p className="mt-3 text-sm leading-6 text-charcoal/60">
                See the{" "}
                <a href="/golf-trip-cost-per-person" className="text-forest-900 underline-offset-2 hover:underline">
                  golf trip cost per person guide
                </a>{" "}
                for realistic ranges by destination tier.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Step 3: Find the date window that works for most people
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Not everyone is going to make every potential date. The goal is a window that works for the core
                group — usually 70–80% of the people you want there. Waiting for perfect attendance is how trips
                never get booked.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Set a deadline for availability responses. Open-ended requests sit in people's inboxes indefinitely.
                A specific deadline — "let me know what works before the 15th" — produces a much faster turnaround
                and gives you real data to work with.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Step 4: Build a shortlist the group can actually vote on
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                With budget and dates established, narrow to two or three real destination options. For each option,
                attach specific courses and lodging so the group is comparing real plans, not vague ideas. "Myrtle
                Beach, 3 nights at X, 3 rounds at Y and Z, roughly $850 per person" is something the group can
                react to. "What does everyone think about Myrtle Beach?" is not.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Present the shortlist and collect votes. Do not open a discussion — that turns into another
                round of opinions. Get the votes, see where the group lands, and make the call.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Step 5: Make the call and maintain momentum
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Most trips stall here. The organizer has all the information, the group has expressed preferences,
                but nobody calls it. Weeks go by. Someone finds a conflicting commitment. The window closes.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                When you have budget alignment and a date that works, pick the strongest option and book the
                lodging. Lodging locks the dates. Everything else — courses, tee times, dinner reservations —
                follows from there. The group will adjust to the plan once it exists.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                The tool that makes this easier
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The five steps above are the right sequence. The hard part is running that process across a group
                of 6 to 12 people using a combination of text threads, spreadsheets, and links that end up in
                different places. Outing.golf runs this sequence for you — collecting input in a single flow,
                aggregating budget and date data automatically, and keeping the shortlist and group responses in
                one view.
              </p>
            </div>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/68">
                <li>1. Get input before opinions</li>
                <li>2. Lock in the budget window</li>
                <li>3. Find the date that works</li>
                <li>4. Build a shortlist to vote on</li>
                <li>5. Make the call</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf trip planning checklist</a></li>
                <li><a href="/golf-trip-cost-per-person" className="text-forest-900 underline-offset-2 hover:underline">Golf trip cost per person</a></li>
                <li><a href="/golf-trip-itinerary-template" className="text-forest-900 underline-offset-2 hover:underline">Golf trip itinerary template</a></li>
                <li><a href="/how-it-works" className="text-forest-900 underline-offset-2 hover:underline">How Outing.golf works</a></li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Group golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Organize your golf trip in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf gives golf trip organizers one place to collect group input, compare options, and move
            from ideas to a real plan — without chasing replies across texts and spreadsheets.
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
