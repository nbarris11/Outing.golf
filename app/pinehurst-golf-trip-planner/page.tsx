import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pinehurst Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a group golf trip to Pinehurst? A guide to courses, costs, and what to know before you organize a trip to the Sandhills — including what makes Pinehurst different from other golf destinations."
};

export default function PinehurstGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Pinehurst golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Pinehurst is the closest thing the US has to a dedicated golf village. The entire area — courses,
            lodging, dining — exists around golf, which makes it an exceptional destination for groups where
            everyone is genuinely there to play. It is not a resort destination in the Scottsdale or Palm Springs
            sense. It is a golf destination, and the organizer should plan accordingly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              What makes Pinehurst different
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Golf is the entire point",
                  body: "Unlike Scottsdale or Myrtle Beach, Pinehurst has no beach, no nightlife district, and no non-golf entertainment infrastructure. The trade-off is a focused, unhurried golf experience that serious players find hard to match elsewhere."
                },
                {
                  title: "The resort offers everything on property",
                  body: "The Pinehurst Resort has nine courses, multiple lodging options, dining, and a spa all on one property. For groups that want to minimize logistics, it is as turnkey as a golf trip gets."
                },
                {
                  title: "Course variety within one market",
                  body: "Beyond the resort, the Sandhills region has 40+ courses — from high-end private-access options to accessible mid-tier daily-fee courses. Groups can mix and match across price tiers within a short drive."
                }
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Budget ranges for a Pinehurst golf trip
            </h2>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Pinehurst trip cost — per person, 3–4 days, 3 rounds
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  { range: "$700–$1,000", profile: "Value", courses: "Mid-tier Sandhills daily-fee courses + one No. 4 or similar", lodging: "Village Inn or nearby hotel" },
                  { range: "$1,000–$1,500", profile: "Mid-range", courses: "Pinehurst No. 4, Mid Pines, Pine Needles", lodging: "Pinehurst Resort standard rooms" },
                  { range: "$1,500–$2,500+", profile: "Premium", courses: "Pinehurst No. 2 (bucket list) + No. 4 + premium option", lodging: "Pinehurst Resort hotel or cottage" }
                ].map((row) => (
                  <div key={row.range} className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_0.8fr_1.6fr_1.2fr]">
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
              Best time to go
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Spring (March through May) and fall (September through November) are the best windows for Pinehurst.
              The climate is moderate, the courses are in good condition, and the pace of the village is pleasant.
              Summer is warm and humid — playable but not ideal. Winter is mild by Southeast standards and can
              offer strong value, though some courses run slower conditions.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The week of the US Open (when Pinehurst hosts) is not a good time to plan a group trip — course
              availability drops significantly and the village is crowded.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses worth knowing
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Pinehurst No. 2</span> — The Donald Ross original
                and one of the most famous courses in the world. Host of multiple US Opens. Greens fees are
                significant but it is a bucket-list round for any serious golfer. Worth building the trip around
                if the budget supports it.
              </li>
              <li>
                <span className="font-medium text-charcoal">Pinehurst No. 4</span> — Recently renovated by Gil
                Hanse, widely considered one of the best renovations in recent years. Comparable experience to
                No. 2 at a somewhat lower premium. Strong option for groups that want a true Pinehurst layout
                without the No. 2 price.
              </li>
              <li>
                <span className="font-medium text-charcoal">Mid Pines and Pine Needles</span> — Two adjacent
                Donald Ross courses that offer a classic Sandhills experience at mid-range pricing. Strong
                conditions and historic feel. Good complement to a No. 2 or No. 4 round.
              </li>
              <li>
                <span className="font-medium text-charcoal">Tobacco Road</span> — A Mike Strantz design that
                is unlike anything else in the market — dramatic, unconventional, and memorable. Not for
                everyone but a strong option for groups that want variety.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Pinehurst is right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pinehurst is the right call when everyone in the group actually wants to play golf — where the trip
              is about the courses, the pace, and the experience, not the nightlife or the beach. It is not a good
              fit for groups with casual golfers who will be looking for non-golf entertainment after 18 holes.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              For groups of serious players who want to do Pinehurst No. 2 at some point in their lives, it is
              one of the best-organized group golf destinations in the country. The resort handles logistics well,
              the courses are well-maintained, and the surrounding village has everything a golf-focused group
              actually needs.
            </p>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Best golf trip destinations", href: "/best-golf-trip-destinations", body: "How Pinehurst compares to Scottsdale, Myrtle Beach, Palm Springs, and other top destinations." },
            { title: "Golf trip budget breakdown", href: "/golf-trip-budget-breakdown", body: "How to break down greens fees, lodging, travel, and food before you commit." },
            { title: "Golf trip planning checklist", href: "/golf-trip-planning-checklist", body: "Phase-by-phase checklist from first message to final itinerary." },
            { title: "How it works", href: "/how-it-works", body: "See how Outing.golf collects group input and gets everyone aligned." }
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Pinehurst golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Get the group aligned before you plan Pinehurst
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from your group so you know which version
            of the Pinehurst trip — budget mix, No. 2, premium — actually fits before you start shopping rates.
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
