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
  title: "Kiawah Island Golf Trip Planner for Groups | Outing.golf",
  description:
    "Planning a group golf trip to Kiawah Island? Realistic 2026 costs ($1,500–$3,500 per person with the Ocean Course), the resort courses worth playing, when to go, and how to book it as a group.",
  path: "/kiawah-island-golf-trip-planner"
});

const kiawahFaqs = [
  {
    question: "How much does a group golf trip to Kiawah Island cost?",
    answer:
      "As of 2026, plan on $1,500–$3,500 per person for a 3-night, 3-round Kiawah trip that includes one Ocean Course round. Skipping the Ocean Course and playing the other resort courses (Osprey Point, Turtle Point, Cougar Point) brings the floor down toward $1,500; multiple Ocean Course rounds plus oceanfront villa lodging pushes past $3,500."
  },
  {
    question: "Is Kiawah Island worth it for a buddies trip?",
    answer:
      "Yes, for golf-first groups. The Ocean Course is a genuine bucket-list round, the other four resort courses are strong, and a shared villa keeps the group together. The honest caveat: Kiawah is quiet. If your group measures a trip by the bar scene, you will be happier in Myrtle Beach, 90 minutes up the coast, or in Scottsdale."
  },
  {
    question: "How far in advance should you book the Ocean Course?",
    answer:
      "For a group with a fixed date window, 6–12 months out is normal — especially for spring. Ocean Course tee times are the scarcest resource on the trip, so most organizers lock that round first and build the rest of the schedule around it."
  },
  {
    question: "Should a group stay at the resort or rent a villa on Kiawah?",
    answer:
      "For groups of six or more, a villa rental is usually more cost-effective than hotel rooms at The Sanctuary and keeps everyone under one roof. The island is gated, so nearly all lodging is effectively on-property either way. Staying in Charleston is cheaper and livelier but adds a 45-minute commute each way to every tee time."
  },
  {
    question: "What airport do you fly into for Kiawah Island?",
    answer:
      "Charleston International (CHS), about 45 minutes from the island. It has solid direct-flight coverage from the East Coast and Midwest. Plan on rental cars or a van — there is no practical alternative for getting a group onto the island."
  }
];

export default function KiawahIslandGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          articleSchema({
            title: "Kiawah Island Golf Trip Planner for Groups",
            description:
              "Planning a group golf trip to Kiawah Island? Realistic 2026 costs ($1,500–$3,500 per person with the Ocean Course), the resort courses worth playing, when to go, and how to book it as a group.",
            path: "/kiawah-island-golf-trip-planner"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Best Golf Trip Destinations", path: "/best-golf-trip-destinations" },
            { name: "Kiawah Island", path: "/kiawah-island-golf-trip-planner" }
          ])
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Kiawah Island golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A 3-night, 3-round group trip to Kiawah Island runs $1,500–$3,500 per person with an Ocean Course
            round included, as of 2026. Kiawah is one of the most celebrated golf destinations in the US — home
            to the Ocean Course, a bucket-list Pete Dye layout on the Atlantic that has hosted multiple major
            championships. Planning a group trip here requires more lead time, a higher budget, and more
            deliberate logistics than most domestic destinations. Done right, it is one of the best group golf
            experiences available.
          </p>
          <ArticleByline />
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
              How much does a Kiawah Island golf trip cost?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              As of 2026, a 3-night, 3-round Kiawah trip runs $1,500–$3,500 per person with one Ocean Course
              round in the schedule. The Ocean Course green fee typically lands in the $400–$600 range
              depending on season; the other resort courses run roughly $150–$300. Lodging is the other big
              line item — on-island villas and resort rooms are premium-priced, and there is essentially no
              budget-lodging escape hatch on the island itself.
            </p>
            <div className="mt-6 overflow-hidden rounded-[22px] border border-charcoal/8">
              <div className="bg-charcoal/4 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                  Kiawah Island trip cost — per person, 3 nights, 3 rounds (as of 2026)
                </p>
              </div>
              <div className="divide-y divide-charcoal/6">
                {[
                  {
                    range: "$1,500–$2,200",
                    profile: "Resort courses only",
                    courses: "Osprey Point, Turtle Point, Cougar Point (no Ocean Course)",
                    lodging: "Shared villa on-island"
                  },
                  {
                    range: "$2,200–$2,800",
                    profile: "One Ocean Course round",
                    courses: "1 Ocean Course round + 2 resort courses",
                    lodging: "Villa or resort room"
                  },
                  {
                    range: "$2,800–$3,500+",
                    profile: "Full bucket-list",
                    courses: "Ocean Course + best of the resort lineup, caddies",
                    lodging: "The Sanctuary or oceanfront villa"
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
              Collect individual budget ranges from your group before you start researching rates. Kiawah&apos;s
              wide price spread means the experience differs significantly depending on which courses and
              lodging tier you build around — our{" "}
              <a href="/golf-trip-cost-per-person" className="font-medium text-forest-900 underline-offset-2 hover:underline">cost per person guide</a>{" "}
              shows where Kiawah sits against other destinations.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting there &amp; logistics
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Fly into Charleston International (CHS) — the island is about 45 minutes away by car, and the
              airport has good direct coverage from the East Coast and Midwest. There is no realistic way to
              move a group around without vehicles, so budget for rental cars or a van. The island is gated,
              which simplifies security and quiet but means arrivals need coordinating: every guest needs a
              pass, and members trickling in on different flights is a real organizer headache without a
              shared itinerary.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The lodging decision is resort versus villa. The Sanctuary is the luxury hotel option; villa
              rentals across the island are typically more cost-effective for groups of six or more and keep
              everyone under one roof — usually the right call for a buddies trip. Charleston itself, about 25
              miles away, can serve as a base if the group wants real dining and nightlife alongside the golf,
              but the daily commute to tee times wears thin fast. Most golf-first groups stay on the island
              and do one Charleston dinner.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              When should you go to Kiawah?
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Spring (March through May) and fall (September through November) are the best windows. South
              Carolina coastal weather is good across both — mild temperatures, manageable humidity, and lower
              rain risk than summer. Spring is peak demand, especially for Ocean Course tee times, and is
              priced accordingly.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The shoulder seasons are the value play: late fall and winter bring noticeably lower villa rates
              and easier tee sheets, and coastal South Carolina winters are mild enough that golf is genuinely
              playable most days. Summer is hot, humid, and thunderstorm-prone in the afternoons — doable with
              morning tee times, and rates can come in under peak spring. If your group has a fixed spring
              window for the Ocean Course, booking 6 to 12 months in advance is normal.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Courses to consider
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Kiawah Island Golf Resort operates all five courses on the island. Most groups build their
              schedule around one marquee Ocean Course round and fill the other days with the resort&apos;s
              secondary courses.
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-charcoal/68">
              <li>
                <span className="font-medium text-charcoal">Ocean Course</span> — The signature course. Walking
                the dunes alongside the Atlantic is the defining Kiawah experience. Difficult, windy, and worth
                it for serious golfers.
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
                <span className="font-medium text-charcoal">Cougar Point</span> — Gary Player design running
                along the Kiawah River with marsh views. Plays friendlier than the Ocean Course and is a good
                opening-day round while the group finds its swing.
              </li>
              <li>
                <span className="font-medium text-charcoal">Oak Point</span> — The most value-oriented of the
                resort courses, located just off the main island. Good option for a warm-up round or for groups
                with mixed budgets.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Who Kiawah is NOT right for
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Kiawah is the wrong destination for groups that want nightlife. The island is gated, residential,
              and deliberately quiet — evenings are a villa dinner, a porch, and maybe the resort bar. There is
              no strip, no late-night scene, and Charleston is a 45-minute drive each way. If your group&apos;s
              ideal trip includes going out after the round, a{" "}
              <a href="/myrtle-beach-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Myrtle Beach trip</a>{" "}
              delivers more golf per dollar with an actual nightlife district attached.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              It is also not a budget trip. At $1,500+ per person there is no cheap version of Kiawah, so get
              real budget ranges from everyone before you present it as the destination. For comparison
              shopping at this tier, see how it stacks up against{" "}
              <a href="/pebble-beach-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Pebble Beach</a>{" "}
              and <a href="/pinehurst-golf-trip-planner" className="font-medium text-forest-900 underline-offset-2 hover:underline">Pinehurst</a> —
              both bucket-list trips with very different personalities and price floors.
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

      <FaqSection title="Kiawah Island golf trip FAQs" faqs={kiawahFaqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Pebble Beach golf trip planner",
              href: "/pebble-beach-golf-trip-planner",
              body: "The West Coast bucket-list equivalent — costs, tee time realities, and timing."
            },
            {
              title: "Pinehurst golf trip planner",
              href: "/pinehurst-golf-trip-planner",
              body: "The other Carolinas pilgrimage: golf-village pace, No. 2, and a lower price floor."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic cost ranges by destination tier so you can set a real budget window for the group."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "How Kiawah Island compares to Pebble Beach, Scottsdale, Bandon Dunes, and other top destinations."
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
