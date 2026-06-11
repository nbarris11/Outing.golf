import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArticleByline } from "@/components/marketing/article-byline";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Scottsdale Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a Scottsdale golf trip for your group? Real cost ranges ($1,000–$2,500 per person), the best courses, seasonal timing, and the logistics organizers need to know.",
  path: "/scottsdale-golf-trip-planner"
});

const scottsdaleFaqs = [
  {
    question: "How much does a group golf trip to Scottsdale cost?",
    answer:
      "As of 2026, plan on $1,000–$2,500 per person for a 3-night, 3-round Scottsdale trip. The low end gets you a shared rental house and value-tier courses; the high end is peak-season resort lodging with marquee rounds like the TPC Scottsdale Stadium Course or Troon North. Season matters more here than in most destinations — the same itinerary can cost 40–50% less in summer than in February."
  },
  {
    question: "When is the best time for a Scottsdale golf trip?",
    answer:
      "January through April is peak season — the best weather and the highest prices. For the best balance of weather, availability, and cost, target late October through early December or early May. June through August is brutally hot (110°F+ afternoons) but greens fees drop dramatically, and early-morning rounds are playable for heat-tolerant groups."
  },
  {
    question: "How many golf courses are in the Scottsdale area?",
    answer:
      "The greater Phoenix–Scottsdale metro has roughly 200 courses, with several dozen quality public and resort options concentrated in Scottsdale itself and the nearby Fort McDowell and Fountain Hills corridors. Most groups can build a 3–4 round itinerary without ever driving more than 45 minutes."
  },
  {
    question: "Where should a golf group stay in Scottsdale?",
    answer:
      "Groups of 6 or more usually do best in a shared rental house in North Scottsdale, which puts you within 20–30 minutes of Troon North, Grayhawk, and We-Ko-Pa and typically costs less per person than two-to-a-room resort lodging. Smaller groups or groups that want zero logistics often prefer resort properties along the Scottsdale corridor — convenient, but expect a meaningful premium in peak season."
  },
  {
    question: "Do you need rental cars for a Scottsdale golf trip?",
    answer:
      "Yes. Courses are spread across a 30–45 minute radius and ride-share to far North Scottsdale courses gets expensive fast. Most groups of 8 rent two SUVs at Phoenix Sky Harbor — splitting two vehicles eight ways usually runs $40–$70 per person for the trip, as of 2026."
  }
];

export default function ScottsdaleGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Scottsdale Golf Trip Planner for Groups | Outing.golf",
          description:
            "Planning a Scottsdale golf trip for your group? Real cost ranges ($1,000–$2,500 per person), the best courses, seasonal timing, and the logistics organizers need to know.",
          path: "/scottsdale-golf-trip-planner"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Best Golf Trip Destinations", path: "/best-golf-trip-destinations" },
          { name: "Scottsdale Golf Trip Planner", path: "/scottsdale-golf-trip-planner" }
        ])}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Scottsdale golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A 3-night, 3-round Scottsdale golf trip costs $1,000–$2,500 per person as of 2026, depending on
            season and course tier — making it the premium option among the big group destinations. What you get
            for that money: the most reliable golf weather in the country, courses at every price point, and
            enough lodging variety to fit different groups. But a good destination does not fix a disorganized
            group. Before you start shopping rates, get the group aligned on dates and budget first.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Why groups choose Scottsdale
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Weather",
                  body: "Scottsdale has more reliable golf weather than almost any other US destination. October through April is the main window, with low humidity and minimal rain."
                },
                {
                  title: "Course range",
                  body: "Scottsdale has courses at every price point — from accessible public layouts to high-end resort courses. A mixed group can usually find a combination that works."
                },
                {
                  title: "Logistics",
                  body: "Phoenix Sky Harbor is well-connected, rental car availability is strong, and most courses are within 30 to 45 minutes of each other and the main resort corridors."
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
              How much does a Scottsdale golf trip cost?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Scottsdale has a wide range, which is part of what makes it work for different groups. A trip built
              around value-tier courses and a shared rental house lands in a very different range than one built
              around resort lodging and high-end greens fees. The destination supports both — the question is which
              version fits your group. The figures below assume 3 nights, 3 rounds, peak-adjacent season, as of 2026.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Scottsdale trip cost — per person, 3 nights, 3 rounds (as of 2026)
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$1,000–$1,400",
                    profile: "Budget",
                    courses: "Quality munis and value publics (Papago, We-Ko-Pa off-peak), 3 rounds",
                    lodging: "Shared rental house, 2 per room, North Scottsdale or Fountain Hills"
                  },
                  {
                    range: "$1,400–$1,900",
                    profile: "Mid-range",
                    courses: "We-Ko-Pa, Grayhawk, Troon North shoulder-season, 3 rounds",
                    lodging: "Nicer rental house with a pool, or mid-tier resort"
                  },
                  {
                    range: "$1,900–$2,500+",
                    profile: "Premium",
                    courses: "TPC Scottsdale Stadium, Troon North Monument, peak-season rates",
                    lodging: "Resort on-property along the Scottsdale corridor"
                  }
                ].map((row) => (
                  <div key={row.range} className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_0.7fr_1.6fr_1.3fr]">
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
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Collect budget ranges from everyone before you start researching — the range you get back determines
              which tier you are actually planning. For how Scottsdale stacks up against cheaper destinations, see
              the full <a href="/golf-trip-cost-per-person" className="font-medium text-forest-900 underline-offset-2 hover:underline">golf trip cost per person</a> breakdown.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When should you go?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              January through April is peak season — the best weather, the most demand, and the highest rates of
              the year. Marquee courses charge their top greens fees, and lodging in the Scottsdale corridor prices
              accordingly. February around the WM Phoenix Open is the single most expensive and crowded week on the
              calendar; unless attending the tournament is the point of the trip, avoid it.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              June through August is the opposite: brutally hot, with afternoon temperatures regularly above 110°F —
              and greens fees that drop 40–60% from peak, as of 2026. A heat-tolerant group playing 7am tee times
              can do a premium-course itinerary at mid-range prices. It is a real strategy, but be honest about
              whether your group will actually enjoy it.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              If the group has flexibility, late October through early December and early May hit the best balance
              of weather, availability, and price. Courses are in good shape (watch for fall overseeding closures in
              October), and rates sit meaningfully below the January–April peak.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses to consider
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Scottsdale has more course options than most groups can research efficiently. A few that come up
              frequently for group trips across different budget tiers:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">TPC Scottsdale</span> — Home of the WM
                Phoenix Open. The Stadium Course is the area&apos;s bucket-list round; the Champions Course next
                door is more accessible.
              </li>
              <li>
                <span className="font-medium text-charcoal">Troon North</span> — Two layouts in a dramatic desert
                setting. The Monument Course is widely regarded as one of the best in the area.
              </li>
              <li>
                <span className="font-medium text-charcoal">We-Ko-Pa</span> — Two courses (Saguaro and Cholla) in
                the Fort McDowell area, slightly outside the main corridor, with strong conditions, no housing
                lining the fairways, and good value relative to the top-tier resorts.
              </li>
              <li>
                <span className="font-medium text-charcoal">Grayhawk</span> — Two courses (Raptor and Talon) that
                hosted three straight NCAA Championships. A reliable mid-to-upper-tier pick with good group
                infrastructure.
              </li>
              <li>
                <span className="font-medium text-charcoal">Papago</span> — A classic Phoenix municipal with a
                strong renovation history. The best value round in the market and a smart budget-tier anchor.
              </li>
              <li>
                <span className="font-medium text-charcoal">Quintero</span> — A more remote option northwest of
                Phoenix with a strong reputation among serious golfers. Worth the drive for one round.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting there and logistics
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Fly into Phoenix Sky Harbor (PHX) — one of the best-connected airports in the country, with direct
              flights from nearly every major US city. From PHX it is roughly 25 minutes to Old Town Scottsdale and
              35–45 minutes to the North Scottsdale course corridor. You need rental cars: courses are spread
              across a 30–45 minute radius, and ride-share to far-flung morning tee times is unreliable and
              expensive. For a group of 8, two SUVs split eight ways typically adds $40–$70 per person for the
              trip, as of 2026.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The rental-house-versus-resort math favors the house for groups of six or more. A 5-bedroom North
              Scottsdale rental with a pool often splits to $90–$160 per person per night, while comparable resort
              rooms in peak season run $200+ per person at double occupancy — before resort fees. Resorts win on
              convenience and on-property amenities; the house wins on cost, a shared hangout space, and not paying
              for four separate breakfasts. Either way, the lodging decision should come after you have confirmed
              your date window and budget range — not before.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Scottsdale is NOT right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Scottsdale is the wrong call for budget-first groups. If the group&apos;s honest range is under
              $1,000 per person, <a href="/myrtle-beach-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Myrtle Beach</a> delivers
              more rounds and better lodging for the same money, and{" "}
              <a href="/palm-springs-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Palm Springs</a> splits
              the difference for West Coast groups. It is also a poor summer destination for anyone unwilling to
              tee off at dawn — the discount is real, but so is the heat.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              And if your group wants a pure golf-immersion trip — walkable village, golf as the entire point, no
              nightlife pulling people in different directions —{" "}
              <a href="/pinehurst-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Pinehurst</a> does
              that better. Scottsdale is a cart-golf, resort-and-restaurant destination. That is a feature for most
              groups, but not all of them.
            </p>
          </div>
        </div>
      </section>

      <FaqSection title="Scottsdale golf trip FAQs" faqs={scottsdaleFaqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "How Scottsdale compares to Myrtle Beach, Palm Springs, Pinehurst, and other top destinations."
            },
            {
              title: "Myrtle Beach golf trip planner",
              href: "/myrtle-beach-golf-trip-planner",
              body: "The budget alternative: 80+ courses and the lowest per-person cost of the major destinations."
            },
            {
              title: "Palm Springs golf trip planner",
              href: "/palm-springs-golf-trip-planner",
              body: "The West Coast desert option — similar golf, softer price point than Scottsdale."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic cost ranges by destination tier so you can set a real budget window."
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
            Get the group aligned before you shop Scottsdale rates
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and course preferences from your group in one place — so you know
            what you are actually planning before you start researching.
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
