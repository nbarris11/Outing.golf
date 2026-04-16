import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Myrtle Beach Golf Trip Planner for Groups | Outing.golf",
  description:
    "How to navigate 80+ courses and plan the right Myrtle Beach golf trip for your group's budget and style.",
  alternates: { canonical: "https://www.outing.golf/myrtle-beach-golf-trip-planner" }
};

export default function MyrtleBeachGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Myrtle Beach golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Myrtle Beach is the most popular group golf destination in the US. It has more courses than any other
            market — over 80 within the Grand Strand — a wide pricing range, and strong lodging infrastructure for
            groups of 4 to 16. That variety is both the best and the hardest thing about planning a Myrtle Beach
            golf trip.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why too many courses is actually the problem
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Having 80+ courses available sounds like an advantage until you start planning. Without a budget
              filter and a sense of the group's course preferences, the shortlist never narrows. Groups end up
              going back and forth on courses that sound good in the abstract without anyone doing the actual
              comparison work.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The right approach is to establish the group's budget range first, then let that narrow the field.
              Myrtle Beach has a wider pricing spread than almost any other destination — greens fees can range
              from $40 at a quality daily-fee course to $200+ at a marquee resort. Knowing whether your group is
              looking at $60–$90 rounds or $120–$180 rounds immediately cuts the options in half.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              What to know about the Myrtle Beach budget range
            </h2>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Myrtle Beach trip cost — per person, all-in
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$500–$750",
                    profile: "Budget-focused",
                    courses: "Quality public daily-fee courses, 2–3 rounds",
                    lodging: "Shared condo or inland hotel"
                  },
                  {
                    range: "$750–$1,100",
                    profile: "Mid-range",
                    courses: "Mix of daily-fee and resort courses, 3–4 rounds",
                    lodging: "Oceanfront condo or branded hotel"
                  },
                  {
                    range: "$1,100–$1,500",
                    profile: "Premium",
                    courses: "Marquee resort courses (TPC Myrtle Beach, Caledonia), 3–4 rounds",
                    lodging: "Resort property or premium rental"
                  }
                ].map((row) => (
                  <div key={row.range} className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_1fr_1.4fr_1.2fr]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Budget</p>
                      <p className="mt-1 text-sm font-semibold text-charcoal">{row.range}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Profile</p>
                      <p className="mt-1 text-sm text-charcoal/68">{row.profile}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Courses</p>
                      <p className="mt-1 text-sm text-charcoal/68">{row.courses}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">Lodging</p>
                      <p className="mt-1 text-sm text-charcoal/68">{row.lodging}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When to go
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Spring (March through May) and fall (September through November) are the best windows for group
              golf trips to Myrtle Beach. Weather is good, rates are reasonable, and the courses are not at
              summer peak heat. Summer is hot and humid but pricing drops significantly — groups with flexible
              schedules can find strong value in June through August if heat is not a concern.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Peak season (late March through mid-May) sees the highest demand for tee times at marquee courses.
              If your group has specific courses in mind, book tee times as soon as the group's dates are locked.
              Popular courses at Myrtle Beach fill up weeks in advance during spring.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Where to stay
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Most groups stay in one of three areas: Ocean Boulevard (oceanfront), the north end near Little
              River (quieter, closer to some of the top courses), or inland near the courses themselves. Oceanfront
              condos are popular for groups that want the beach option alongside golf. Resort properties like
              Grande Dunes or Barefoot Resort put you on property with courses and simplified logistics.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              For groups of 8 or more, a large rental property is often more economical than individual hotel
              rooms. A 4-bedroom oceanfront condo shared among 8 players typically comes in well below two hotel
              rooms per person once you factor in the full cost.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              How to narrow the course shortlist
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              With 80+ courses, the only practical way to build a shortlist is to filter first, then vote. Start
              by eliminating courses outside the group's budget range. Then filter by style preference — links-style,
              resort, parkland, water-heavy layouts — based on what the group has said they enjoy. Most groups end
              up with 6 to 10 reasonable options, which is a manageable shortlist for a vote.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Standout courses worth knowing: Caledonia Golf and Fish Club (widely considered one of the best
              public courses in the Southeast), TPC Myrtle Beach, Pawleys Plantation, and Arcadian Shores are
              all consistently strong picks across different budget tiers.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "How to collect real budget ranges from your group before you research a single course."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist covering everything from first message to final itinerary."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "How Myrtle Beach compares to Scottsdale, Pinehurst, Bandon Dunes, and other top destinations."
            },
            {
              title: "How it works",
              href: "/how-it-works",
              body: "See how Outing.golf collects input, narrows options, and gets the group to a decision."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Myrtle Beach golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Plan your Myrtle Beach trip in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from your group so you can narrow 80+
            courses to the right shortlist and get everyone aligned before you book anything.
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
