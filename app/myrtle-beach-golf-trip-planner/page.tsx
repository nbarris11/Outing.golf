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
  title: "Myrtle Beach Golf Trip Planner for Groups | Outing.golf",
  description:
    "How to plan the right Myrtle Beach golf trip for your group: real costs ($500–$1,200 per person), how to narrow 80+ courses, when to go, and where groups should stay.",
  path: "/myrtle-beach-golf-trip-planner"
});

const myrtleBeachFaqs = [
  {
    question: "How much does a group golf trip to Myrtle Beach cost?",
    answer:
      "As of 2026, plan on $500–$1,200 per person for a 3-night, 3-round Myrtle Beach trip — the lowest of any major US golf destination. The low end is a shared condo and quality daily-fee courses; the high end gets you oceanfront lodging and marquee rounds like Caledonia, the Dunes Club, or TPC Myrtle Beach."
  },
  {
    question: "When is the best time for a Myrtle Beach golf trip?",
    answer:
      "Spring (March–May) and fall (September–November) are prime: good weather, courses in their best condition, and reasonable rates. Spring is the busiest, so book marquee tee times early. Summer is hot and humid but heavily discounted, and winter is playable most days at the year's lowest prices."
  },
  {
    question: "How many golf courses does Myrtle Beach have?",
    answer:
      "Over 80 courses along the Grand Strand, a 60-mile stretch from Pawleys Island in the south to the North Carolina border. No other US market has that much course density — which is exactly why a budget filter and group preferences matter more here than anywhere else."
  },
  {
    question: "Where should a golf group stay in Myrtle Beach?",
    answer:
      "Most groups pick one of three zones: oceanfront condos along Ocean Boulevard (beach plus golf), the north end near Barefoot Resort and Little River (closer to many top courses), or Pawleys Island in the south near Caledonia and True Blue. For 8 or more, a large oceanfront condo or beach house usually beats hotel rooms on per-person cost."
  },
  {
    question: "Do you need a car for a Myrtle Beach golf trip?",
    answer:
      "Yes — courses are spread along 60 miles of coastline, and your three rounds will rarely be next door to each other. Many East Coast groups drive their own cars; flying groups should plan on one rental vehicle per 4 players from Myrtle Beach International (MYR)."
  }
];

export default function MyrtleBeachGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Myrtle Beach Golf Trip Planner for Groups | Outing.golf",
          description:
            "How to plan the right Myrtle Beach golf trip for your group: real costs ($500–$1,200 per person), how to narrow 80+ courses, when to go, and where groups should stay.",
          path: "/myrtle-beach-golf-trip-planner"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Best Golf Trip Destinations", path: "/best-golf-trip-destinations" },
          { name: "Myrtle Beach Golf Trip Planner", path: "/myrtle-beach-golf-trip-planner" }
        ])}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Myrtle Beach golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Myrtle Beach is the most popular group golf destination in the US — and the cheapest of the big ones,
            at $500–$1,200 per person for a 3-night, 3-round trip as of 2026. It has more courses than any other
            market — over 80 within the Grand Strand — a wide pricing range, and strong lodging infrastructure for
            groups of 4 to 16. That variety is both the best and the hardest thing about planning a Myrtle Beach
            golf trip.
          </p>
          <ArticleByline />
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
              filter and a sense of the group&apos;s course preferences, the shortlist never narrows. Groups end up
              going back and forth on courses that sound good in the abstract without anyone doing the actual
              comparison work.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The right approach is to establish the group&apos;s budget range first, then let that narrow the field.
              Myrtle Beach has a wider pricing spread than almost any other destination — greens fees can range
              from $40 at a quality daily-fee course to $200+ at a marquee resort. Knowing whether your group is
              looking at $60–$90 rounds or $120–$180 rounds immediately cuts the options in half.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              How much does a Myrtle Beach golf trip cost?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Less than anywhere else with this much golf. The figures below assume 3 nights, 3 rounds, spring or
              fall season, as of 2026 — for the same itinerary, Scottsdale runs roughly double.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Myrtle Beach trip cost — per person, 3 nights, 3 rounds (as of 2026)
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$500–$700",
                    profile: "Budget",
                    courses: "Quality daily-fee courses ($40–$80 rounds), 3 rounds",
                    lodging: "Shared condo or inland hotel, 2 per room"
                  },
                  {
                    range: "$700–$950",
                    profile: "Mid-range",
                    courses: "Mix of daily-fee and resort courses (Barefoot, True Blue), 3 rounds",
                    lodging: "Oceanfront condo or branded hotel"
                  },
                  {
                    range: "$950–$1,200+",
                    profile: "Premium",
                    courses: "Marquee rounds — Caledonia, Dunes Club, TPC Myrtle Beach",
                    lodging: "Resort property or premium oceanfront rental"
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
              For how these numbers compare across destinations, see the full{" "}
              <a href="/golf-trip-cost-per-person" className="font-medium text-forest-900 underline-offset-2 hover:underline">golf trip cost per person</a> guide.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When should you go?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Spring (March through May) and fall (September through November) are the prime windows. Weather is
              good, courses are in their best condition, and rates are reasonable. Spring is the single busiest
              stretch — late March through mid-May sees the highest demand of the year for tee times at marquee
              courses. If your group has specific courses in mind, book as soon as the group&apos;s dates are
              locked; popular courses fill up weeks in advance during spring.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Summer is hot and humid but pricing drops significantly — groups with flexible schedules can find
              strong value in June through August if heat is not a dealbreaker. Winter is the sleeper play: most
              days are playable (highs in the 50s and 60s), and December through February delivers the lowest
              greens fees and lodging rates of the year. You will trade some course conditioning and risk a cold
              snap, but a winter Myrtle Beach trip can come in under $500 per person all-in, as of 2026.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses worth knowing
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              With 80+ courses, the only practical way to build a shortlist is to filter by budget first, then
              vote. Most groups end up with 6 to 10 reasonable options. These come up consistently across tiers:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Caledonia Golf &amp; Fish Club</span> — Widely
                considered one of the best public courses in the Southeast. The Pawleys Island setting under
                live oaks is the round people remember. The premium anchor of most serious itineraries.
              </li>
              <li>
                <span className="font-medium text-charcoal">True Blue</span> — Caledonia&apos;s sister course
                across the street, a bigger, bolder Mike Strantz design. Playing both in one day is a classic
                Pawleys Island move.
              </li>
              <li>
                <span className="font-medium text-charcoal">The Dunes Golf &amp; Beach Club</span> — A Robert
                Trent Jones classic and the most historically significant course on the Strand. Limited public
                access through partner hotels and golf packages makes it a trip centerpiece.
              </li>
              <li>
                <span className="font-medium text-charcoal">Barefoot Resort</span> — Four courses (Dye, Fazio,
                Love, Norman) at one property in North Myrtle Beach. A group can stay and play multiple rounds
                without re-solving logistics each morning.
              </li>
              <li>
                <span className="font-medium text-charcoal">TPC Myrtle Beach</span> — Tour-caliber conditioning
                and a strong premium-tier pick on the south end.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting there and logistics
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Myrtle Beach International (MYR) sits 10–15 minutes from most of the Grand Strand and has direct
              flights from a long list of East Coast and Midwest cities — and a big share of Myrtle Beach groups
              skip flying entirely, since the Strand is within a day&apos;s drive of most of the eastern US. Either
              way you need vehicles: the courses stretch across 60 miles of coastline, and a Pawleys Island tee
              time is 45 minutes from a North Myrtle Beach condo. Plan on one car per foursome.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              On lodging math: for groups of 8 or more, a large oceanfront condo or beach house is usually the
              winner — a 4-bedroom oceanfront rental shared among 8 players typically comes in well below two
              hotel rooms per person once you factor in the full cost. The three main zones are Ocean Boulevard
              (oceanfront, central), the north end near Barefoot and Little River (quieter, near many top
              courses), and Pawleys Island in the south (closest to Caledonia and True Blue). Resort properties
              like Barefoot or Grande Dunes simplify logistics by putting lodging and multiple courses on one
              property — worth it if the group values convenience over the beachfront.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Myrtle Beach is NOT right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Myrtle Beach is the wrong call for groups chasing a singular bucket-list experience. There is no
              Pinehurst No. 2 here — the appeal is depth and value, not one famous round. Groups that want golf
              with prestige attached should look at{" "}
              <a href="/pinehurst-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Pinehurst</a>,
              three hours inland, or budget up for{" "}
              <a href="/scottsdale-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Scottsdale</a>.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              It is also not the pick for groups that want a quiet, refined trip. The Strand is a high-volume
              vacation town — minigolf, pancake houses, crowded summer beaches — and in peak season pace of play
              at popular courses can stretch past five hours. West Coast groups should also do the flight math
              first: by the time you connect into MYR,{" "}
              <a href="/palm-springs-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Palm Springs</a> is
              often the easier and better trip.
            </p>
          </div>
        </div>
      </section>

      <FaqSection title="Myrtle Beach golf trip FAQs" faqs={myrtleBeachFaqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "How Myrtle Beach compares to Scottsdale, Pinehurst, Bandon Dunes, and other top destinations."
            },
            {
              title: "Scottsdale golf trip planner",
              href: "/scottsdale-golf-trip-planner",
              body: "The premium desert alternative — reliable winter weather at roughly double the price."
            },
            {
              title: "Palm Springs golf trip planner",
              href: "/palm-springs-golf-trip-planner",
              body: "The West Coast option: 100+ Coachella Valley courses between Myrtle Beach and Scottsdale on price."
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
