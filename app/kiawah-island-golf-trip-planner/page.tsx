import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Kiawah Island Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a group golf trip to Kiawah Island? What to know about courses, budget, timing, and booking the Ocean Course.",
  alternates: { canonical: "https://www.outing.golf/kiawah-island-golf-trip-planner" }
};

export default function KiawahIslandGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Kiawah Island golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Kiawah Island is one of the most celebrated golf destinations in the US — home to the Ocean Course, a
            bucket-list layout on the Atlantic coast that has hosted multiple major championships. Planning a group
            trip here requires more lead time, a higher budget, and more deliberate logistics than most domestic
            destinations. Done right, it is one of the best group golf experiences available.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why groups choose Kiawah Island
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "The Ocean Course",
                  body: "The Ocean Course is consistently ranked among the top public courses in the US. Designed by Pete Dye and opened in 1991, it sits directly alongside the Atlantic with dramatic elevation changes and oceanfront views on nearly every hole."
                },
                {
                  title: "Multiple course options",
                  body: "Beyond the Ocean Course, Kiawah Island Golf Resort operates four additional courses — Osprey Point, Turtle Point, Oak Point, and Cougar Point — which offer a range of difficulty levels and price points within a single destination."
                },
                {
                  title: "Resort infrastructure",
                  body: "Kiawah Island has strong resort lodging, villa rentals, beach access, and dining options. It works well for groups where some members want a complete resort experience alongside the golf."
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
              Budget ranges for a Kiawah Island golf trip
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Kiawah Island is a premium destination. Greens fees at the Ocean Course typically range from $350 to
              $500 per round depending on season and availability. The other resort courses run $150 to $300.
              On-property villa and resort lodging adds significantly to the per-person total.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Kiawah Island trip cost — per person, all-in
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$1,500–$2,500",
                    profile: "Mid-range resort",
                    courses: "Mix of resort courses, 3 rounds (no Ocean Course)",
                    lodging: "Villa or hotel on-property"
                  },
                  {
                    range: "$2,500–$4,000",
                    profile: "Premium with Ocean Course",
                    courses: "1 Ocean Course round + 2–3 resort courses",
                    lodging: "On-property villa or resort room"
                  },
                  {
                    range: "$4,000+",
                    profile: "Full bucket-list",
                    courses: "Multiple Ocean Course rounds + resort courses",
                    lodging: "Premium villa rental, oceanfront"
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
            <p className="mt-4 text-sm leading-6 text-charcoal/60">
              Collect individual budget ranges from your group before you start researching rates. Kiawah's wide
              price spread means the experience differs significantly depending on which courses and lodging tier
              you build around.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Best time to go
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Spring (March through May) and fall (September through November) are the best windows. South Carolina
              coastal weather is good across both seasons — mild temperatures, manageable humidity, and lower chance
              of rain than summer. Summer is warm and humid but playable, with rates that can come in lower than
              peak spring.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Peak spring sees the highest demand, especially for Ocean Course tee times. If your group has a
              specific date window in mind for that course, booking 6 to 12 months in advance is not unusual for
              groups planning around a marquee round there.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses to consider
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Kiawah Island Golf Resort operates all five courses on the island. Most groups build their schedule
              around one marquee Ocean Course round and fill the other days with the resort's secondary courses.
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Ocean Course</span> — The signature course. Walking
                the dunes alongside the Atlantic is the defining Kiawah experience. Difficult, windy, and worth it
                for serious golfers.
              </li>
              <li>
                <span className="font-medium text-charcoal">Osprey Point</span> — Tom Fazio design with a mix of
                wooded and marsh-edged holes. More accessible than the Ocean Course with strong conditions.
              </li>
              <li>
                <span className="font-medium text-charcoal">Turtle Point</span> — Jack Nicklaus design with three
                oceanfront holes on the back nine. A strong secondary course for groups wanting oceanside play
                beyond the Ocean Course.
              </li>
              <li>
                <span className="font-medium text-charcoal">Oak Point</span> — The most value-oriented of the
                resort courses, located off the main island. Good option for a warm-up round or for groups with
                mixed budgets.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Lodging options
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The Kiawah Island Golf Resort operates The Sanctuary, a luxury hotel, alongside villa rentals across
              the island. For groups of six or more, a villa rental is typically more cost-effective than hotel
              rooms and keeps the group together. The island is gated, so nearly all accommodations are on-property
              — which simplifies logistics but limits outside lodging options.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Charleston is approximately 25 miles away and can serve as a base if the group wants more dining and
              nightlife options alongside the golf, though commuting to the island adds logistics.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Organizer notes
            </h2>
            <div className="mt-4 rounded-[18px] bg-cream px-5 py-4">
              <ul className="space-y-3 text-sm leading-6 text-charcoal/68">
                <li>Ocean Course tee times book early — do not wait until 30 days out if this round matters to your group.</li>
                <li>The island is gated access only. Factor that into arrival logistics, especially for larger groups arriving at different times.</li>
                <li>Kiawah is not a budget trip. Get real budget ranges from everyone before you present this as the destination.</li>
                <li>Non-golf activities (beach, spa, Charleston day trip) make it viable for groups with mixed levels of golf interest.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "How Kiawah Island compares to Pebble Beach, Scottsdale, Bandon Dunes, and other top destinations."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic cost ranges by destination tier so you can set a real budget window for the group."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "Phase-by-phase checklist from first message to confirmed itinerary."
            },
            {
              title: "Golf trip budget breakdown",
              href: "/golf-trip-budget-breakdown",
              body: "How to break down greens fees, lodging, travel, and food before you commit."
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
            Get the group aligned before you book Kiawah
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from your group in one place — so you know
            what you are actually planning before you start researching Ocean Course availability.
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
