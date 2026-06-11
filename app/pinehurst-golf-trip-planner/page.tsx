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
  title: "Pinehurst Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a group golf trip to Pinehurst? Realistic 2026 costs ($1,200–$3,000 per person with No. 2 in the mix), the courses worth playing, when to go, and how to get the group aligned before you book.",
  path: "/pinehurst-golf-trip-planner"
});

const pinehurstFaqs = [
  {
    question: "How much does a group golf trip to Pinehurst cost?",
    answer:
      "As of 2026, plan on $1,200–$3,000 per person for a 3-night, 3-round Pinehurst trip with No. 2 in the mix. Groups that skip No. 2 and build around Mid Pines, Pine Needles, and Sandhills daily-fee courses can do the trip for $800–$1,200 per person. The biggest swing factors are whether you play No. 2 and whether you stay on the Pinehurst Resort property."
  },
  {
    question: "Is Pinehurst worth it for a buddies trip?",
    answer:
      "Yes — if everyone in the group actually wants to play golf. Pinehurst is arguably the best pure-golf buddies trip in the country: walkable village, 40+ courses within a short drive, and a bucket-list anchor in No. 2. It is not worth it for groups that want nightlife or a beach alongside the golf — Myrtle Beach or Scottsdale fit those groups better."
  },
  {
    question: "Do you have to stay at the resort to play Pinehurst No. 2?",
    answer:
      "Generally yes. Tee times on No. 2 are largely reserved for Pinehurst Resort guests and members, so most groups access it through a stay-and-play package. If No. 2 is the point of the trip, price the resort package first and build the rest of the schedule around it."
  },
  {
    question: "How far in advance should you book a Pinehurst trip?",
    answer:
      "For a group of 8+ targeting spring or fall, start 6–9 months out. Resort packages for peak weekends fill early, and the surrounding courses (Mid Pines, Pine Needles, Tobacco Road) book group blocks well in advance. Get the group's dates and budgets locked before you call — packages are quoted per-person and change shape fast when half the group has not committed."
  },
  {
    question: "What airport do you fly into for Pinehurst?",
    answer:
      "Raleigh-Durham (RDU) is the main gateway — about 1 hour 15 minutes by car. Greensboro (GSO) is a similar drive and occasionally cheaper to fly into. Either way you will want at least one rental car or van; once you are in the village, most of the resort experience is walkable or shuttle-served."
  }
];

export default function PinehurstGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          articleSchema({
            title: "Pinehurst Golf Trip Planner for Groups",
            description:
              "Planning a group golf trip to Pinehurst? Realistic 2026 costs ($1,200–$3,000 per person with No. 2 in the mix), the courses worth playing, when to go, and how to get the group aligned before you book.",
            path: "/pinehurst-golf-trip-planner"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Best Golf Trip Destinations", path: "/best-golf-trip-destinations" },
            { name: "Pinehurst", path: "/pinehurst-golf-trip-planner" }
          ])
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Pinehurst golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A 3-night, 3-round group golf trip to Pinehurst runs $1,200–$3,000 per person with No. 2 in the
            mix, as of 2026 — and it is the closest thing the US has to a dedicated golf village. The entire
            area — courses, lodging, dining — exists around golf, which makes it an exceptional destination for
            groups where everyone is genuinely there to play. It is not a resort destination in the Scottsdale
            or Palm Springs sense. It is a golf destination, and the organizer should plan accordingly.
          </p>
          <ArticleByline />
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
              How much does a Pinehurst golf trip cost?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              As of 2026, a 3-night, 3-round Pinehurst trip runs $1,200–$3,000 per person if No. 2 is in the
              mix. Groups that skip No. 2 entirely and build around the area&apos;s mid-tier courses can land
              in the $800–$1,200 range. The two levers that move the number most are the No. 2 round itself
              and whether you stay on the resort property — everything else is rounding error by comparison.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Pinehurst trip cost — per person, 3 nights, 3 rounds (as of 2026)
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  { range: "$800–$1,200", profile: "Value (no No. 2)", courses: "Mid-tier Sandhills daily-fee courses + Mid Pines or Pine Needles", lodging: "Village inn or nearby hotel" },
                  { range: "$1,200–$2,000", profile: "Mid-range", courses: "Pinehurst No. 4, Mid Pines, Pine Needles", lodging: "Pinehurst Resort standard rooms" },
                  { range: "$2,000–$3,000", profile: "Premium with No. 2", courses: "Pinehurst No. 2 (bucket list) + No. 4 + one more", lodging: "Pinehurst Resort hotel or cottage" }
                ].map((row) => (
                  <div key={row.range} className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_0.9fr_1.5fr_1.2fr]">
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
              These tiers describe genuinely different trips, which is why collecting real budget ranges from
              the group first matters. Our <a href="/golf-trip-cost-per-person" className="font-medium text-forest-900 underline-offset-2 hover:underline">golf trip cost per person guide</a> breaks
              down how Pinehurst compares to other destination tiers.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting there &amp; logistics
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Raleigh-Durham (RDU) is the primary airport — roughly a 1 hour 15 minute drive to the village,
              with strong direct-flight coverage from most of the country. Greensboro (GSO) is a comparable
              drive and occasionally cheaper, which matters when eight people are buying tickets. There is no
              meaningful public transit option, so plan on at least one rental car or a van for groups of six
              or more.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Once you arrive, logistics get easy. The village of Pinehurst is walkable, the resort runs
              shuttles between its courses and lodging, and the off-resort courses (Mid Pines, Pine Needles,
              Tobacco Road) are all within a 20–35 minute drive. The practical organizer decision is resort
              versus off-resort lodging: resort packages bundle rounds and simplify everything but cost more,
              while a rented house in the area saves money and adds driving. Decide based on the group&apos;s
              budget data, not on which website you found first.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When should you go to Pinehurst?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Spring (March through May) and fall (September through November) are the best windows. The
              climate is moderate, the courses are in their best condition, and the pace of the village is
              pleasant. Summer is hot and humid — playable, and rates dip, but afternoon rounds in July are a
              grind. Winter is mild by Southeast standards and offers real value, though some courses run
              slower conditions and overseeded greens.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              One honest warning: the week of the US Open (when Pinehurst hosts) is not a good time to plan a
              group trip — course availability drops significantly and the village is crowded. Check the
              championship calendar before locking dates.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses worth knowing
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Pinehurst No. 2</span> — The Donald Ross original
                and one of the most famous courses in the world. Host of multiple US Opens. Green fees are
                significant but it is a bucket-list round for any serious golfer. Worth building the trip around
                if the budget supports it.
              </li>
              <li>
                <span className="font-medium text-charcoal">Pinehurst No. 4</span> — Renovated by Gil Hanse,
                widely considered one of the best renovations in recent years. Comparable experience to No. 2
                at a somewhat lower premium. Strong option for groups that want a true Pinehurst layout
                without the No. 2 price.
              </li>
              <li>
                <span className="font-medium text-charcoal">Mid Pines and Pine Needles</span> — Two adjacent
                Donald Ross courses in Southern Pines that offer a classic Sandhills experience at mid-range
                pricing. Strong conditions and historic feel. Good complement to a No. 2 or No. 4 round.
              </li>
              <li>
                <span className="font-medium text-charcoal">Tobacco Road</span> — A Mike Strantz design about
                35 minutes north that is unlike anything else in the market — dramatic, unconventional, and
                memorable. Not for everyone, but it is the round your group will argue about at dinner.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Pinehurst is NOT right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Pinehurst is the wrong call for groups with non-golfers or casual golfers who will be looking
              for entertainment after 18 holes. There is no beach, no casino, no nightlife district — dinner
              and a drink in the village is the evening. If half your group plays twice a year and wants a
              party scene, you will get more buy-in from a{" "}
              <a href="/myrtle-beach-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Myrtle Beach trip</a>{" "}
              or a <a href="/scottsdale-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Scottsdale trip</a>,
              both of which pair real golf with real non-golf options.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              For groups of serious players who want to do Pinehurst No. 2 at some point in their lives, it is
              one of the best-organized group golf destinations in the country. The resort handles logistics
              well, the courses are well-maintained, and the surrounding village has everything a golf-focused
              group actually needs. If your group is split on what kind of trip this is, that is the
              conversation to have before anyone calls the resort — and it is exactly the conversation
              Outing.golf is built to collect.
            </p>
          </div>

        </div>
      </section>

      <FaqSection title="Pinehurst golf trip FAQs" faqs={pinehurstFaqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Kiawah Island golf trip planner", href: "/kiawah-island-golf-trip-planner", body: "The other Carolinas bucket-list trip — Ocean Course costs, timing, and logistics." },
            { title: "Pebble Beach golf trip planner", href: "/pebble-beach-golf-trip-planner", body: "What the West Coast bucket-list version of this trip costs and requires." },
            { title: "Golf trip cost per person", href: "/golf-trip-cost-per-person", body: "Realistic cost ranges by destination tier so you can set a real budget window for the group." },
            { title: "Best golf trip destinations", href: "/best-golf-trip-destinations", body: "How Pinehurst compares to Scottsdale, Myrtle Beach, Palm Springs, and other top destinations." }
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
            <AuthCta className="bg-cream text-charcoal hover:bg-white">Start Planning Free</AuthCta>
            <Button href="/how-it-works" className="border border-cream/30 bg-transparent text-cream hover:bg-white/10">See How It Works</Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
