import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pebble Beach Golf Trip Planner for Groups | Outing.golf",
  description:
    "A practical guide to planning a group golf trip to Pebble Beach — courses, realistic costs, timing, and what to know before you book.",
  alternates: { canonical: "https://www.outing.golf/pebble-beach-golf-trip-planner" }
};

export default function PebbleBeachGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Pebble Beach golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Pebble Beach is the most iconic public golf destination in the US. Consistently ranked the top public
            course in the country, it sits on the Monterey Peninsula alongside Spyglass Hill, Poppy Hills, and
            other strong layouts. Planning a group trip here requires significant budget alignment, advance booking,
            and a clear sense of what the group actually wants from the experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why groups choose Pebble Beach
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "The name",
                  body: "Pebble Beach is the bucket-list name in American golf. For groups where the destination itself is the draw — a trip the group has talked about for years — no other domestic course carries the same weight."
                },
                {
                  title: "Multiple course options",
                  body: "The Monterey Peninsula has a strong collection of courses alongside Pebble Beach: Spyglass Hill, Poppy Hills, Monterey Peninsula Country Club (members only), and Cypress Point (private). Most group trips combine Pebble Beach with Spyglass Hill and/or Poppy Hills."
                },
                {
                  title: "Coastal scenery",
                  body: "The 17 Mile Drive corridor and the Pacific coastline make this one of the most scenic golf destinations in the world. Carmel, Monterey, and the surrounding area provide strong non-golf options for groups with mixed interests."
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
              Budget ranges for a Pebble Beach golf trip
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pebble Beach is among the most expensive public golf experiences in the US. Greens fees at Pebble
              Beach Golf Links typically run $600 to $650 per person for resort guests and slightly higher for
              non-guests. Spyglass Hill runs $250 to $350. Poppy Hills is more accessible at $100 to $175. Budget
              accordingly before presenting this destination to your group.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Pebble Beach trip cost — per person, all-in
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$2,000–$3,000",
                    profile: "Pebble + secondary courses",
                    courses: "1 Pebble Beach round + Spyglass Hill + Poppy Hills",
                    lodging: "Carmel or Monterey hotel"
                  },
                  {
                    range: "$3,000–$5,000",
                    profile: "Pebble-focused with resort stay",
                    courses: "1–2 Pebble Beach rounds + Spyglass Hill",
                    lodging: "The Lodge or The Inn at Spanish Bay on-property"
                  },
                  {
                    range: "$5,000+",
                    profile: "Full resort package",
                    courses: "Multiple rounds across all major courses",
                    lodging: "The Lodge at Pebble Beach, premium ocean-view rooms"
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
              Budget conversations matter more here than almost anywhere else. Confirm the group's real range
              before you start discussing Pebble Beach as a destination.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Best time to go
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The Monterey Peninsula has a mild climate year-round, but summer fog is a real factor. June and July
              can bring morning fog that burns off by midday — not ideal for morning tee times. The clearest, most
              reliable weather tends to be September through November and March through May.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The AT&T Pebble Beach Pro-Am takes place in February and closes Pebble Beach to public play for
              several days around the event. If your group's window falls in early February, verify course
              availability before booking anything else.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses to consider
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Most groups planning a Pebble Beach trip structure their schedule around one Pebble Beach round and
              fill additional days with other Peninsula courses.
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Pebble Beach Golf Links</span> — The centerpiece of
                any trip here. Oceanfront holes on the back nine and the famous 18th are as good as any finish in
                public golf. Book as early as possible; tee times release up to two months in advance for resort
                guests.
              </li>
              <li>
                <span className="font-medium text-charcoal">Spyglass Hill</span> — Considered by many serious
                golfers to be a better test than Pebble Beach. Starts in the forest, moves to the oceanside, and
                has a strong reputation among golfers who care about difficulty and design.
              </li>
              <li>
                <span className="font-medium text-charcoal">Poppy Hills</span> — The most accessible and
                affordable of the Peninsula courses. Good option for a third day or for groups with a wider range
                of budgets.
              </li>
              <li>
                <span className="font-medium text-charcoal">The Links at Spanish Bay</span> — Links-style course
                adjacent to The Inn at Spanish Bay. Scenic and enjoyable, though less demanding than Pebble or
                Spyglass.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Lodging options
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pebble Beach Resorts operates The Lodge at Pebble Beach and The Inn at Spanish Bay as the primary
              on-property options. Both are premium properties. Resort guests get preferred access to tee times,
              which is a meaningful advantage given how competitive Pebble Beach booking is.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Groups looking to reduce the per-person cost can stay in Carmel-by-the-Sea or Monterey, both within
              15 to 20 minutes of the course. This sacrifices the tee time priority that comes with resort
              residency — worth factoring in if Pebble Beach availability is critical to the trip.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Organizer notes
            </h2>
            <div className="mt-4 rounded-[18px] bg-cream px-5 py-4">
              <ul className="space-y-3 text-sm leading-6 text-charcoal/68">
                <li>Pebble Beach tee times are among the most competitive in the country. If you want a specific date, book as soon as the window opens — don't wait for the group to finalize everything first.</li>
                <li>Confirm everyone's real budget before you commit to this destination. At $2,000–$5,000 per person, a group member who is not aligned can derail the whole plan late in the process.</li>
                <li>Resort guest tee time access is a genuine advantage. If the group's budget allows for on-property lodging, it simplifies the booking process significantly.</li>
                <li>This is a bucket-list trip for most groups. The planning experience should match — collect preferences carefully, be deliberate about the round lineup, and make the trip feel as intentional as the destination.</li>
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
              body: "How Pebble Beach compares to Kiawah Island, Bandon Dunes, Scottsdale, and other top destinations."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic cost ranges by destination tier so you can set expectations before the group conversation."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "Phase-by-phase checklist from first message to confirmed itinerary."
            },
            {
              title: "Kiawah Island golf trip planner",
              href: "/kiawah-island-golf-trip-planner",
              body: "Planning guide for another top bucket-list coastal golf destination."
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
            Get the group aligned before you book Pebble Beach
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from your group in one place — so you know
            what you are actually planning before you compete for Pebble Beach tee times.
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
