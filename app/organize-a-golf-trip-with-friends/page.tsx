import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema, howToSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "How to Organize a Golf Trip with Friends | Outing.golf",
  description:
    "How to get your friend group from scattered interest to a confirmed golf trip — what to collect, in what order, and how to make the call.",
  path: "/organize-a-golf-trip-with-friends"
});

export default function OrganizeAGolfTripWithFriendsPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "How to Organize a Golf Trip with Friends | Outing.golf",
          description:
            "How to get your friend group from scattered interest to a confirmed golf trip — what to collect, in what order, and how to make the call.",
          path: "/organize-a-golf-trip-with-friends"
        })}
      />
      <JsonLd
        data={howToSchema({
          name: "How to organize a golf trip with friends",
          description:
            "The five-step sequence for getting a friend group from scattered interest to a confirmed golf trip.",
          path: "/organize-a-golf-trip-with-friends",
          steps: [
            {
              name: "Get input before you form opinions",
              text: "Collect each person's budget range, available dates, and trip preferences individually and privately before proposing any destination — group discussions anchor around whoever speaks first."
            },
            {
              name: "Lock in the budget window first",
              text: "Ask everyone for an all-in per-person range, not a yes-or-no to a specific number. The overlap of responses defines the destination tier you are planning for."
            },
            {
              name: "Find the date window that works for most people",
              text: "Aim for a window that works for 70–80% of the core group and set a specific deadline for availability responses — open-ended requests sit in inboxes indefinitely."
            },
            {
              name: "Build a shortlist the group can vote on",
              text: "Narrow to two or three real options with specific courses, lodging, and a per-person price attached, then collect votes instead of opening another discussion."
            },
            {
              name: "Make the call and book the lodging",
              text: "Pick the strongest option and book lodging to lock the dates. Courses, tee times, and dinners follow from there — the group adjusts to the plan once it exists."
            }
          ]
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Organize a golf trip with friends", path: "/organize-a-golf-trip-with-friends" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            How to organize a golf trip with friends
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Organizing a golf trip with friends takes five steps in a specific order: collect budgets and dates
            privately before sharing any ideas, lock the budget window, find a date that works for 70–80% of the
            core group, present a shortlist of two or three priced options, and book the lodging to lock it in.
            Someone always ends up running the trip — if that person is you, this guide covers the actual job,
            step by step, without spending three weeks in a group chat that goes nowhere.
          </p>
          <ArticleByline />
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
                <li><a href="/buddies-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">Buddies golf trip planner</a></li>
                <li><a href="/golf-weekend-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">Golf weekend planning checklist</a></li>
                <li><a href="/how-it-works" className="text-forest-900 underline-offset-2 hover:underline">How Outing.golf works</a></li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "What order should you plan a golf trip in?",
            answer:
              "Budget first, then dates, then destination, then courses and lodging, then the itinerary. Budget determines everything downstream — skip it and you will almost certainly build a shortlist the group cannot afford. The itinerary comes last, once everything else is decided."
          },
          {
            question: "How do you get friends to actually commit to a golf trip?",
            answer:
              "Deadlines and a booked deposit. Set a specific date for availability responses — 'let me know before the 15th' — instead of an open-ended ask, and once the group aligns, book the lodging. Lodging locks the dates, and the group commits to a plan that exists far faster than to an idea."
          },
          {
            question: "How many destination options should you present to the group?",
            answer:
              "Two or three, each with specific courses, lodging, and a per-person price attached. 'Myrtle Beach, 3 nights, 3 rounds, roughly $850 per person' is something people can vote on. An open-ended 'where should we go?' just produces another round of opinions."
          },
          {
            question: "Do you need everyone to be available before booking?",
            answer:
              "No — waiting for perfect attendance is how trips never get booked. Aim for a window that works for 70–80% of the core group, make the call, and let the schedule firm up around the people who can make it."
          }
        ]}
      />

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
