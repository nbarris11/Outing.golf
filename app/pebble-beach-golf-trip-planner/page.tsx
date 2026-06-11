import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthCta } from "@/components/marketing/auth-cta";
import { ArticleByline } from "@/components/marketing/article-byline";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Pebble Beach Golf Trip Planner for Groups | Outing.golf",
  description:
    "A practical guide to planning a group golf trip to Pebble Beach — realistic 2026 costs ($2,500–$5,000+ per person), the resort-stay tee time reality, when to go, and which Monterey Peninsula courses to pair with it.",
  path: "/pebble-beach-golf-trip-planner"
});

const pebbleFaqs = [
  {
    question: "How much does a group golf trip to Pebble Beach cost?",
    answer:
      "As of 2026, plan on $2,500–$5,000+ per person for a 3-night, 3-round trip that includes one Pebble Beach round. The Pebble Beach Golf Links green fee alone runs roughly $675+ per person. Staying off-property in Monterey or Pacific Grove and filling the schedule with value courses like Pacific Grove and Del Monte keeps you near the bottom of that range; an on-resort stay with Spyglass Hill pushes toward the top."
  },
  {
    question: "Is Pebble Beach worth it for a buddies trip?",
    answer:
      "For a group of serious golfers treating it as a bucket-list trip — yes, almost universally. The 18th at Pebble is a round your group will talk about for years. It is not worth it as a casual annual trip: at this price, a group that is not fully bought in financially will fracture during planning. Confirm everyone's real budget before you say the words Pebble Beach out loud."
  },
  {
    question: "Do you have to stay at the resort to play Pebble Beach?",
    answer:
      "Practically, yes, if you want to plan ahead. Resort guests (typically with a two-night minimum at The Lodge or other Pebble Beach Resorts properties) can book tee times well in advance; non-guests are generally limited to short-notice availability, usually within a day or two of play. For a group trip built around a specific date, the resort stay is effectively part of the cost of the round."
  },
  {
    question: "What is the best time of year for a Pebble Beach trip?",
    answer:
      "September through November is the sweet spot — the clearest, most reliable weather on the Monterey Peninsula. It is playable year-round, but December through February carries real rain risk, and June and July bring morning fog that can sit on the coastline past your tee time. Also avoid early February unless you are going to watch the AT&T Pro-Am, which closes the course to public play."
  },
  {
    question: "What airport do you fly into for Pebble Beach?",
    answer:
      "Monterey Regional (MRY) is 10–15 minutes away but has limited routes and higher fares. San Jose (SJC) is about 1 hour 15 minutes by car and usually the best balance of fares and drive time for groups. San Francisco (SFO) is roughly 2 hours and has the most flight options."
  }
];

export default function PebbleBeachGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          articleSchema({
            title: "Pebble Beach Golf Trip Planner for Groups",
            description:
              "A practical guide to planning a group golf trip to Pebble Beach — realistic 2026 costs ($2,500–$5,000+ per person), the resort-stay tee time reality, when to go, and which Monterey Peninsula courses to pair with it.",
            path: "/pebble-beach-golf-trip-planner"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Best Golf Trip Destinations", path: "/best-golf-trip-destinations" },
            { name: "Pebble Beach", path: "/pebble-beach-golf-trip-planner" }
          ])
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Pebble Beach golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A 3-night, 3-round group trip to Pebble Beach runs $2,500–$5,000+ per person as of 2026, with the
            Pebble Beach Golf Links green fee alone at roughly $675+. It is the most iconic public golf
            destination in the US — consistently ranked the top public course in the country, sitting on the
            Monterey Peninsula alongside Spyglass Hill and a deep bench of supporting layouts. Planning a group
            trip here requires serious budget alignment, advance booking, and a clear sense of what the group
            actually wants from the experience.
          </p>
          <ArticleByline />
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
                  body: "The Monterey Peninsula has a strong supporting cast: Spyglass Hill, Poppy Hills, Del Monte, and the Pacific Grove muni. Most group trips combine one Pebble Beach round with Spyglass Hill and a value course to balance the budget."
                },
                {
                  title: "Coastal scenery",
                  body: "The 17-Mile Drive corridor and the Pacific coastline make this one of the most scenic golf destinations in the world. Carmel, Monterey, and the surrounding area provide strong non-golf options for groups with mixed interests."
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
              How much does a Pebble Beach golf trip cost?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pebble Beach is among the most expensive public golf experiences in the US. As of 2026, the
              green fee at Pebble Beach Golf Links runs roughly $675+ per person, before the cart or caddie.
              Spyglass Hill typically lands in the $300–$450 range, Poppy Hills and Del Monte well under that,
              and the Pacific Grove muni under $100. All-in, a realistic 3-night, 3-round group trip is
              $2,500–$5,000+ per person depending on lodging and how many marquee rounds you stack.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Pebble Beach trip cost — per person, 3 nights, 3 rounds (as of 2026)
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$2,500–$3,200",
                    profile: "Pebble + value courses",
                    courses: "1 Pebble Beach round + Del Monte + Pacific Grove or Poppy Hills",
                    lodging: "Carmel or Monterey hotel (off-property)"
                  },
                  {
                    range: "$3,200–$5,000",
                    profile: "Resort stay, Pebble-focused",
                    courses: "1 Pebble Beach round + Spyglass Hill + one more",
                    lodging: "Pebble Beach Resorts on-property (tee time priority)"
                  },
                  {
                    range: "$5,000+",
                    profile: "Full resort package",
                    courses: "Multiple rounds across the marquee courses, caddies",
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
              Budget conversations matter more here than almost anywhere else. Confirm the group&apos;s real
              range before you start discussing Pebble Beach as a destination — our{" "}
              <a href="/golf-trip-cost-per-person" className="font-medium text-forest-900 underline-offset-2 hover:underline">golf trip cost per person guide</a>{" "}
              shows where this sits against every other tier of trip.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting there &amp; logistics
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Three airport options, in order of convenience: Monterey Regional (MRY) is 10–15 minutes from the
              course but has limited routes and premium fares; San Jose (SJC) is about 1 hour 15 minutes by car
              and is usually the sweet spot for groups; San Francisco (SFO) is roughly 2 hours but has the most
              flight inventory. Plan on rental cars either way — the Peninsula is not a walkable destination,
              and note that 17-Mile Drive has a per-vehicle gate fee unless you are a resort guest or have a
              tee time.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The biggest logistics decision is the resort-stay question, and the reality is blunt: resort
              guests (typically a two-night minimum at The Lodge or other Pebble Beach Resorts properties) get
              advance tee time access at Pebble Beach Golf Links, while non-guests are largely limited to
              short-notice availability. For a group trip pinned to specific dates, the resort stay is
              effectively part of the price of the round. Staying in Carmel-by-the-Sea or Monterey — both
              within 15 to 20 minutes — cuts lodging cost significantly, but you trade away the booking
              priority that makes the marquee round plannable.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When should you go to Pebble Beach?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pebble Beach is genuinely a year-round destination — the Monterey Peninsula climate is mild in
              every month — but each season has a catch. September through November is the sweet spot: the
              clearest skies, the most reliable weather, and firm conditions. Spring (March through May) is a
              close second.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The honest caveats: winter (December through February) carries real rain risk — green fees do not
              get refunded for drizzle — and June and July bring marine-layer fog that can sit on the coast
              through morning tee times before burning off midday. Neither ruins a trip, but a group flying
              across the country for one Pebble round should weight the calendar toward fall. And the AT&amp;T
              Pebble Beach Pro-Am closes the course to public play for several days in early February — verify
              availability before booking anything else in that window.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses to consider
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Most groups planning a Pebble Beach trip structure their schedule around one Pebble Beach round
              and fill additional days with other Peninsula courses across a wide price spread.
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Pebble Beach Golf Links</span> — The centerpiece of
                any trip here. Oceanfront holes on the back nine and the famous 18th are as good as any finish
                in public golf. Roughly $675+ as of 2026; book the moment your window opens.
              </li>
              <li>
                <span className="font-medium text-charcoal">Spyglass Hill</span> — Considered by many serious
                golfers to be a better test than Pebble Beach. Starts in the dunes by the ocean, moves into the
                Del Monte Forest, and has a strong reputation among golfers who care about difficulty and design.
              </li>
              <li>
                <span className="font-medium text-charcoal">The Links at Spanish Bay</span> — The resort&apos;s
                links-style course has been undergoing a full rebuild, with a reimagined layout planned in its
                place. Its status is in flux as of 2026 — check the current status with the resort before
                planning a round there.
              </li>
              <li>
                <span className="font-medium text-charcoal">Del Monte</span> — The oldest continuously operating
                course west of the Mississippi, in Monterey proper. Short, historic, and far cheaper than the
                coastal courses. A smart arrival-day round.
              </li>
              <li>
                <span className="font-medium text-charcoal">Pacific Grove Golf Links</span> — The value play. A
                municipal course whose back nine runs along the ocean by the Point Pinos lighthouse — locals
                call it the poor man&apos;s Pebble. Under $100 and worth every dollar for a group watching the
                total.
              </li>
              <li>
                <span className="font-medium text-charcoal">Poppy Hills</span> — A solid, affordable Del Monte
                Forest layout and a good option for a third day or for groups with a wider range of budgets.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Pebble Beach is NOT right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pebble Beach is the wrong destination for budget-sensitive groups, full stop. There is no version
              of this trip under roughly $2,500 per person that includes the course everyone came for, and a
              group where two members are stretching to afford it will feel that tension all weekend. If the
              group wants a great multi-round trip at a third of the price, a{" "}
              <a href="/scottsdale-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Scottsdale trip</a>{" "}
              delivers more golf, more sun, and more nightlife per dollar.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              It is also a mediocre fit for groups that measure trips in rounds played — the budget buys one or
              two marquee rounds here, not 72 holes of variety — and for first-time group trips where the
              organizer has never herded eight people through a booking window before. Comparable bucket-list
              alternatives worth pricing side by side:{" "}
              <a href="/kiawah-island-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Kiawah Island</a>{" "}
              (the Ocean Course at a lower all-in) and{" "}
              <a href="/pinehurst-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Pinehurst</a>{" "}
              (more rounds, golf-village pace, half the price floor).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Organizer notes
            </h2>
            <div className="mt-4 rounded-[18px] bg-cream px-5 py-4">
              <ul className="space-y-3 text-sm leading-6 text-charcoal/68">
                <li>Pebble Beach tee times are among the most competitive in the country. If you want a specific date, book as soon as the window opens — don&apos;t wait for the group to finalize everything first.</li>
                <li>Confirm everyone&apos;s real budget before you commit to this destination. At $2,500–$5,000+ per person, a group member who is not aligned can derail the whole plan late in the process.</li>
                <li>Resort guest tee time access is a genuine advantage. If the group&apos;s budget allows for on-property lodging, it simplifies the booking process significantly.</li>
                <li>This is a bucket-list trip for most groups. The planning experience should match — collect preferences carefully, be deliberate about the round lineup, and make the trip feel as intentional as the destination.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FaqSection title="Pebble Beach golf trip FAQs" faqs={pebbleFaqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Kiawah Island golf trip planner",
              href: "/kiawah-island-golf-trip-planner",
              body: "The East Coast bucket-list alternative — Ocean Course costs, timing, and logistics."
            },
            {
              title: "Pinehurst golf trip planner",
              href: "/pinehurst-golf-trip-planner",
              body: "More rounds for the money: the golf-village pilgrimage with No. 2 as the anchor."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic cost ranges by destination tier so you can set expectations before the group conversation."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "How Pebble Beach compares to Kiawah Island, Bandon Dunes, Scottsdale, and other top destinations."
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
            <AuthCta className="bg-cream text-charcoal hover:bg-white">Start Planning Free</AuthCta>
            <Button href="/how-it-works" className="border border-cream/30 bg-transparent text-cream hover:bg-white/10">
              See How It Works
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
