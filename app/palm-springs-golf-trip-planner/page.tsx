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
  title: "Palm Springs Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a group golf trip to Palm Springs? Real costs ($800–$1,800 per person), the best Coachella Valley courses, when to go, and how to coordinate lodging without group-text chaos.",
  path: "/palm-springs-golf-trip-planner"
});

const palmSpringsFaqs = [
  {
    question: "How much does a group golf trip to Palm Springs cost?",
    answer:
      "As of 2026, plan on $800–$1,800 per person for a 3-night, 3-round Palm Springs trip — cheaper than Scottsdale, pricier than Myrtle Beach. The low end is a shared pool-house rental and value courses like Desert Willow; the high end is winter peak season with marquee rounds at PGA WEST and resort lodging at La Quinta or Indian Wells."
  },
  {
    question: "When is the best time for a Palm Springs golf trip?",
    answer:
      "January through March is peak — the best weather and the highest rates of the year. November and early December offer nearly identical conditions at noticeably lower prices, which makes them the smart organizer's window. Summer (June–September) regularly tops 110°F, but greens fees drop 50% or more for groups willing to play at dawn."
  },
  {
    question: "How many golf courses are in the Palm Springs area?",
    answer:
      "The Coachella Valley has over 100 courses spread across Palm Springs, Palm Desert, Rancho Mirage, Indian Wells, and La Quinta. A meaningful share are private, but the public and resort-access inventory is still deep enough that most groups need a budget filter before the shortlist narrows."
  },
  {
    question: "Where should a golf group stay in Palm Springs?",
    answer:
      "Pool-house rentals in the Palm Springs–Palm Desert corridor are the default for groups of 6–12: lower per-person cost than hotel rooms, one shared hangout space, and a real pool. Groups that want zero logistics stay on-property at resorts like La Quinta or Westin Mission Hills, where lodging and courses share an address — at a meaningful premium."
  },
  {
    question: "Do you need to fly into Palm Springs (PSP)?",
    answer:
      "No, and often you shouldn't. PSP is 15–30 minutes from most of the valley but has limited direct routes and higher fares. Many groups fly into Ontario (ONT, about 75 minutes away) or LAX (about 2 hours without traffic) and drive. Southern California groups skip flights entirely — it's a 2-hour drive from LA. Either way, plan on one rental vehicle per foursome."
  }
];

export default function PalmSpringsGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Palm Springs Golf Trip Planner for Groups | Outing.golf",
          description:
            "Planning a group golf trip to Palm Springs? Real costs ($800–$1,800 per person), the best Coachella Valley courses, when to go, and how to coordinate lodging without group-text chaos.",
          path: "/palm-springs-golf-trip-planner"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Best Golf Trip Destinations", path: "/best-golf-trip-destinations" },
          { name: "Palm Springs Golf Trip Planner", path: "/palm-springs-golf-trip-planner" }
        ])}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Palm Springs golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A 3-night, 3-round Palm Springs golf trip costs $800–$1,800 per person as of 2026 — squarely between
            Myrtle Beach and Scottsdale on price. The Coachella Valley has over 100 golf courses spread across
            Palm Springs, Palm Desert, Rancho Mirage, and La Quinta, making it the most accessible winter golf
            destination for West Coast groups. The challenge is the same as any market with deep course inventory:
            without budget and preference data from the group, the shortlist never narrows.
          </p>
          <ArticleByline />
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
                  body: "Desert mountain layouts, classic resort courses, and public daily-fee options give groups a mix of styles and price points. PGA WEST and La Quinta are well-known anchors; plenty of strong mid-tier courses fill the schedule."
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
              How much does a Palm Springs golf trip cost?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Think of Palm Springs as the middle option: roughly 25–30% cheaper than a comparable Scottsdale
              itinerary, and a step up in price from Myrtle Beach. The figures below assume 3 nights, 3 rounds,
              in-season, as of 2026.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Palm Springs trip cost — per person, 3 nights, 3 rounds (as of 2026)
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$800–$1,100",
                    profile: "Budget",
                    courses: "Public daily-fee and value resort courses (Desert Willow, Indian Wells)",
                    lodging: "Shared pool-house rental, 2 per room"
                  },
                  {
                    range: "$1,100–$1,450",
                    profile: "Mid-range",
                    courses: "Mix of resort courses — Westin Mission Hills, La Quinta, one PGA WEST round",
                    lodging: "Larger villa rental or mid-tier resort hotel"
                  },
                  {
                    range: "$1,450–$1,800+",
                    profile: "Premium",
                    courses: "PGA WEST Stadium, La Quinta, peak-season rates",
                    lodging: "Resort on-property at La Quinta or comparable"
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
              For the same numbers across every major destination, see the{" "}
              <a href="/golf-trip-cost-per-person" className="font-medium text-forest-900 underline-offset-2 hover:underline">golf trip cost per person</a> guide.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When should you go?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              January through March is peak season — the best weather and the highest demand of the year, which
              means course availability tightens and both greens fees and lodging run at their annual high.
              November and early December are the organizer&apos;s window: nearly identical conditions, lower
              rates, and far less competition for tee times. April is warm and works well early in the month,
              before spring break and festival-season crowds (Coachella weekends spike lodging prices across the
              entire valley) push rates back up.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Summer is the deal season — with a caveat. From June through September, temperatures regularly
              exceed 110°F, and greens fees drop 50% or more, as of 2026. Groups that genuinely commit to 6–7am
              tee times can play premium courses at budget prices and spend afternoons at the pool. If your group
              will not get up at dawn, do not book a Palm Springs summer trip — there is no playable afternoon.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses worth knowing
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">PGA WEST Stadium Course</span> — The Pete Dye design
                that hosts the PGA Tour&apos;s American Express, and one of the most famous (and most difficult)
                resort courses in the country. The island-green par-3 17th, &quot;Alcatraz,&quot; is a group golf
                trip moment. Worth the premium for the right group.
              </li>
              <li>
                <span className="font-medium text-charcoal">La Quinta Resort (Mountain &amp; Dunes)</span> — Two
                distinctly different Pete Dye layouts at one classic resort stop. The Mountain Course, set against
                the Santa Rosa foothills, is the signature round.
              </li>
              <li>
                <span className="font-medium text-charcoal">Indian Wells Golf Resort</span> — Two city-owned
                courses (Celebrity and Players) with resort-level conditioning at a mid-tier price. One of the
                best value-to-quality ratios in the valley.
              </li>
              <li>
                <span className="font-medium text-charcoal">Desert Willow Golf Resort</span> — Palm Desert&apos;s
                municipal flagship and consistently strong value. Two courses (Firecliff and Mountain View) at a
                price point well below the marquee resorts.
              </li>
              <li>
                <span className="font-medium text-charcoal">Westin Mission Hills</span> — Two courses, good
                conditions, accessible pricing relative to the top resort courses, and strong on-site lodging for
                groups that want everything in one place.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting there and logistics
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Palm Springs International (PSP) is the close option — 15–30 minutes from most of the valley — but
              its route map is limited and winter fares run high. Many flying groups land at Ontario (ONT),
              about 75 minutes away, or LAX, about 2 hours without traffic, and drive in. For Southern California
              groups the math is simpler: it is a 2-hour drive from LA, which is exactly why the valley fills up
              with weekend golf groups all winter.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              You need cars regardless. The valley&apos;s courses stretch 30+ miles from Palm Springs proper to La
              Quinta, and a PGA WEST tee time is 35–40 minutes from a downtown Palm Springs rental. Plan on one
              vehicle per foursome. On lodging math: a 4–5 bedroom pool house in the Palm Desert corridor
              typically splits to $70–$130 per person per night for groups of 8 as of 2026 — usually well below
              two-to-a-room resort pricing in season — and the pool is a real amenity in the desert. On-property
              resort lodging at La Quinta or Westin Mission Hills eliminates the morning shuttle problem entirely;
              the premium is meaningful, so it works best when the group&apos;s budget range supports it.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Palm Springs is NOT right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Palm Springs is the wrong call for East Coast groups — by the time you connect into PSP or drive in
              from LAX, <a href="/myrtle-beach-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Myrtle Beach</a> or{" "}
              <a href="/pinehurst-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Pinehurst</a> gets
              you more golf for less travel. It is also a non-starter as a summer destination for any group that
              will not commit to dawn tee times.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              And groups chasing maximum public-access trophy golf may find{" "}
              <a href="/scottsdale-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Scottsdale</a> a
              better fit — a larger share of the Coachella Valley&apos;s 100+ courses are private or
              members-first, so the bookable inventory is thinner than the raw course count suggests. Palm
              Springs rewards groups that want a relaxed pool-house trip with very good golf attached, more than
              groups building an itinerary of nothing but marquee rounds.
            </p>
          </div>

        </div>
      </section>

      <FaqSection title="Palm Springs golf trip FAQs" faqs={palmSpringsFaqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Best golf trip destinations", href: "/best-golf-trip-destinations", body: "How Palm Springs compares to Scottsdale, Myrtle Beach, and other top destinations." },
            { title: "Scottsdale golf trip planner", href: "/scottsdale-golf-trip-planner", body: "The other desert option — more public trophy courses at a higher price point." },
            { title: "Myrtle Beach golf trip planner", href: "/myrtle-beach-golf-trip-planner", body: "The value play: 80+ courses and the lowest per-person cost of the major destinations." },
            { title: "Golf trip cost per person", href: "/golf-trip-cost-per-person", body: "Realistic cost ranges by destination tier so you can set a real budget window." }
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
