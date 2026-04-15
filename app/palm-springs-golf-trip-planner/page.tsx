import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Palm Springs Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a group golf trip to Palm Springs? Outing.golf helps you collect budgets, pick courses, and coordinate lodging for the Coachella Valley without managing it all over group text."
};

export default function PalmSpringsGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Palm Springs golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            The Coachella Valley has over 100 golf courses spread across Palm Springs, Palm Desert, Rancho Mirage,
            and La Quinta. For West Coast groups, it is one of the most accessible winter and spring golf
            destinations in the country. The challenge is the same as any market with deep course inventory:
            without budget and preference data from the group, the shortlist never narrows.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why Palm Springs works for group golf trips
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Weather window",
                  body: "November through April is the main season. Reliable sunshine, low humidity, and mild temperatures make it one of the most consistently playable destinations in the US during the winter months."
                },
                {
                  title: "Course variety",
                  body: "Desert mountain layouts, classic resort courses, and public daily-fee options give groups a mix of styles and price points. TPC Stadium and PGA WEST are well-known anchors; plenty of strong mid-tier courses fill the schedule."
                },
                {
                  title: "Resort infrastructure",
                  body: "Palm Springs has full resort infrastructure — hotels, rental houses, pool villas, and restaurant options — that works for groups ranging from 4 players to 16. Non-golf amenities are available if not everyone is playing every day."
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
              Budget ranges for a Palm Springs golf trip
            </h2>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Palm Springs trip cost — per person, 3–4 days, 3 rounds
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  { range: "$700–$1,000", profile: "Value", courses: "Public daily-fee and resort value courses", lodging: "Hotel or shared rental" },
                  { range: "$1,000–$1,600", profile: "Mid-range", courses: "Mix of resort and mid-tier courses", lodging: "Resort hotel or villa rental" },
                  { range: "$1,600–$2,500+", profile: "Premium", courses: "PGA WEST, TPC Stadium, top private-access courses", lodging: "Resort on-property or premium villa" }
                ].map((row) => (
                  <div key={row.range} className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_0.8fr_1.4fr_1.2fr]">
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
              January through March is peak season — best weather and highest demand, which means course
              availability tightens and rates run highest. November and early December offer good weather with
              lower rates and less competition for tee times. April is warm but spring break crowds drive rates
              up at the end of the month.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Summer is effectively off-limits — temperatures regularly exceed 110°F. If your group needs a
              spring or fall window, Palm Springs works well in November and December before the peak season
              pricing kicks in.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses worth knowing
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">PGA WEST (Stadium Course)</span> — One of the most
                difficult and well-known resort courses in the country. The island green par-3 is a group golf
                trip moment. Worth the premium for the right group.
              </li>
              <li>
                <span className="font-medium text-charcoal">TPC Stadium at PGA WEST</span> — Host of the American
                Express PGA Tour event. Strong conditions and a bucket-list feel for groups that want a tour-level
                experience.
              </li>
              <li>
                <span className="font-medium text-charcoal">Desert Willow Golf Resort</span> — City-owned and
                consistently strong value. Two courses (Firecliff and Mountain View) at a price point
                well below the resort marquee options.
              </li>
              <li>
                <span className="font-medium text-charcoal">Westin Mission Hills</span> — Two courses, good
                conditions, accessible pricing relative to the top resort courses, and strong on-site lodging.
              </li>
              <li>
                <span className="font-medium text-charcoal">La Quinta Mountain and Dunes</span> — Classic desert
                resort experience with two distinctly different layouts. Popular for groups looking for
                variety in one stop.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Lodging for groups
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pool villas in the Palm Springs and Palm Desert corridor are a strong choice for groups of 6 to 12.
              They bring lodging cost down relative to individual hotel rooms, keep the group together, and the
              pool is a real amenity in the desert climate. Rental platform inventory is strong in this market.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              On-property resort lodging at places like La Quinta or Westin Mission Hills works if the group
              wants to minimize logistics — everything is on site, tee times are easier to coordinate, and there
              is no rental car dependency. The premium is meaningful, so it works best when budget range supports it.
            </p>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Best golf trip destinations", href: "/best-golf-trip-destinations", body: "How Palm Springs compares to Scottsdale, Myrtle Beach, and other top destinations." },
            { title: "Golf trip budget breakdown", href: "/golf-trip-budget-breakdown", body: "How to break down greens fees, lodging, travel, and food before you commit." },
            { title: "Golf trip planning checklist", href: "/golf-trip-planning-checklist", body: "Everything to work through from first message to confirmed itinerary." },
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Palm Springs golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Plan your Palm Springs trip in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from your group so you can narrow 100+
            Coachella Valley courses to the right shortlist and get everyone aligned before you book anything.
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
