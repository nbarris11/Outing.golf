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
  title: "Golf Trip Budget Planner for Groups | Outing.golf",
  description:
    "Stop guessing what everyone can spend. Outing.golf collects individual budget ranges from your group so you can plan a trip that fits everyone.",
  path: "/golf-trip-budget-planner"
});

export default function GolfTripBudgetPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Golf Trip Budget Planner for Groups | Outing.golf",
          description:
            "Stop guessing what everyone can spend. Outing.golf collects individual budget ranges from your group so you can plan a trip that fits everyone.",
          path: "/golf-trip-budget-planner"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Golf trip budget planner", path: "/golf-trip-budget-planner" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip budget planner for groups
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            The right way to budget a group golf trip is to collect each player's all-in per-person range privately
            before anyone proposes a destination — under $600 points to a drive-to trip, $600–$1,000 to a regional
            fly-to like Myrtle Beach, $1,000–$1,800 to a premium market like Scottsdale or Pinehurst, and $1,800+
            to bucket-list territory. Budget is the first thing that should get resolved and the last thing most
            groups actually talk about — and when nobody knows the real range, the organizer ends up planning a
            trip that does not fit.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why budget comes first
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Destination options, course quality, and lodging choices all flow from budget. A group aligned on
              $700 per person plans a different trip than a group aligned on $1,500. If you start planning before
              you know the real range, you risk building a shortlist the group cannot afford — or undershooting and
              leaving money on the table.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The budget conversation should happen before anything else is decided.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              The problem with budget conversations in group chat
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              When you ask "what is everyone's budget?" in a group text, the first number someone posts becomes the
              anchor. Everyone else calibrates to it — up or down — based on social dynamics, not their actual
              range. You end up with a false consensus that falls apart when it is time to actually book.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Collecting budget ranges privately, before any group discussion, gives you the real distribution.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              What a real budget range tells you
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Destination tier",
                  body: "Budget determines whether you are looking at a local drive-to, a regional fly-to, or a bucket-list destination."
                },
                {
                  title: "Course quality",
                  body: "Greens fees vary widely. Knowing the budget tells you whether the group is looking at public daily-fee courses or private-access resorts."
                },
                {
                  title: "Lodging options",
                  body: "Budget overlap tells you whether you are splitting a rental house, booking hotel rooms, or staying at a golf resort on property."
                }
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{item.body}</p>
                </Card>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">Budget reference — per person, all-in</p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "Under $600",
                    destination: "Drive-to regional",
                    courses: "Public daily-fee",
                    lodging: "Shared house or budget hotel",
                    example: "Regional markets, local golf trails"
                  },
                  {
                    range: "$600–$1,000",
                    destination: "Regional fly-to",
                    courses: "Mid-tier resort / daily-fee mix",
                    lodging: "Hotel or condo rental",
                    example: "Myrtle Beach, Wisconsin, Branson"
                  },
                  {
                    range: "$1,000–$1,800",
                    destination: "Premium fly-to",
                    courses: "Resort and semi-private access",
                    lodging: "Golf resort on property",
                    example: "Scottsdale, Pinehurst, Palm Springs"
                  },
                  {
                    range: "$1,800+",
                    destination: "Bucket-list",
                    courses: "Private-access and top-100 courses",
                    lodging: "Full-service resort",
                    example: "Bandon Dunes, Streamsong, destination resorts"
                  }
                ].map((row) => (
                  <div key={row.range} className="grid gap-1 px-5 py-4 sm:grid-cols-[1fr_1fr_1fr_1.2fr]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Budget</p>
                      <p className="mt-1 text-sm font-semibold text-charcoal">{row.range}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Destination</p>
                      <p className="mt-1 text-sm text-charcoal/68">{row.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Courses</p>
                      <p className="mt-1 text-sm text-charcoal/68">{row.courses}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Examples</p>
                      <p className="mt-1 text-sm text-charcoal/68">{row.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-charcoal/55">
              Ranges are rough guides. Myrtle Beach, for example, can work for groups anywhere from $500 to $1,200
              depending on course mix and lodging choice — which is exactly why knowing the group's real range matters
              before you start building a shortlist.{" "}
              <a href="/myrtle-beach-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">
                See the Myrtle Beach trip planner
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              How Outing.golf handles budget collection
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              When you create an outing, each invitee submits their budget range privately. Outing.golf aggregates
              the responses and shows you where the group actually lines up — the real range, not the number
              someone shouted first in a group chat.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              That budget window then informs the destination shortlist and course options, so everything you
              research is already within range for the group.
            </p>
          </div>
        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "Why should golf trip budgets be collected privately?",
            answer:
              "Because group chats anchor. The first number posted becomes the reference point and everyone else calibrates to it — up or down — based on social dynamics rather than their actual range. Private submissions give you the real distribution, which is the only number worth planning around."
          },
          {
            question: "What budget question should the organizer actually ask?",
            answer:
              "Ask for an all-in per-person range — 'what range works for you, all-in for the trip?' — not a yes-or-no to a specific number. Ranges surface the overlap; a single proposed number just gets a polite yes that falls apart at booking time."
          },
          {
            question: "What does each budget tier realistically buy?",
            answer:
              "As a rough 2026 guide, all-in per person: under $600 supports a drive-to regional trip on public daily-fee courses; $600–$1,000 covers a regional fly-to like Myrtle Beach with a mid-tier course mix; $1,000–$1,800 reaches premium markets like Scottsdale or Pinehurst with resort lodging; $1,800+ opens bucket-list destinations like Bandon Dunes."
          },
          {
            question: "When in the planning process should budget be settled?",
            answer:
              "First — before destinations, dates research, or course shortlists. Destination tier, course quality, and lodging type all flow from the budget window, so settling it first means everything you research afterward is already affordable for the group."
          }
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How it works",
              href: "/how-it-works",
              body: "See the full workflow Outing.golf uses to collect group input and move toward a decision."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist covering everything from budget to the final itinerary."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "What each major destination costs and what to know before you plan there."
            },
            {
              title: "Golf trip budget breakdown",
              href: "/golf-trip-budget-breakdown",
              body: "How greens fees, lodging, travel, food, and extras split across the per-person total."
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
            Know the real budget before you plan anything
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects individual budget ranges, dates, and preferences from your group in one place so
            you are not guessing what everyone can actually spend.
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
