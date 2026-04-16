import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Best Budget Golf Trip Destinations for Groups | Outing.golf",
  description:
    "The best golf trip destinations for budget-conscious groups — strong courses and a real trip experience without the premium destination price tag.",
  alternates: { canonical: "https://www.outing.golf/best-budget-golf-trip-destinations" }
};

const destinations = [
  {
    name: "Myrtle Beach, SC",
    range: "$500–$900 per person",
    why: "Myrtle Beach has more courses than anywhere else in the US and a wide pricing spread — meaning strong budget options sit alongside marquee resort courses. A group can play 3 quality rounds, stay in a shared condo, and come in well under $800 per person if they pick the right courses.",
    bestCourses: "Caledonia Golf and Fish Club (worth the splurge), Pawleys Plantation, Arcadian Shores, TPC Myrtle Beach for groups with room in the budget",
    organizer: "Lock budget ranges before you start building a Myrtle Beach shortlist — the spread between a $40 round and a $200 round is enormous and changes the entire trip.",
    slug: "/myrtle-beach-golf-trip-planner"
  },
  {
    name: "Wisconsin",
    range: "$400–$800 per person",
    why: "Wisconsin is one of the most underrated budget golf destinations in the country. Strong public infrastructure, Whistling Straits and Erin Hills for groups that want a bucket-list element, and regional courses that deliver good value across the board. Drive-to for Midwest groups eliminates travel cost entirely.",
    bestCourses: "Whistling Straits (Straits Course), Erin Hills, Blackwolf Run, Sand Valley — strong options across all price tiers",
    organizer: "Season runs May through October. June through August is the sweet spot. Drive-to from Chicago, Minneapolis, or Milwaukee makes this a strong value play for Midwest groups.",
    slug: null
  },
  {
    name: "Gulf Coast (Alabama / Florida Panhandle)",
    range: "$500–$900 per person",
    why: "The stretch from Gulf Shores, AL to Destin, FL is an underappreciated golf market with quality courses, beach access for non-golf days, and strong lodging value in the shoulder season. Beach house rentals that fit 8 to 12 people bring per-person lodging cost down significantly.",
    bestCourses: "Kiva Dunes, Craft Farms, The Wharf, Perdido Bay",
    organizer: "Shoulder season (April–May, September–October) hits the best balance of weather, pricing, and availability. Peak summer is hot but lodging rates drop.",
    slug: null
  },
  {
    name: "Pinehurst, NC",
    range: "$700–$1,100 per person",
    why: "Pinehurst skews higher than the others on this list but delivers an experience that punches above its price — especially if the group plays Pinehurst No. 2. The golf-focused environment, walkable village, and strong mid-tier lodging make it strong value for serious golfers.",
    bestCourses: "Pinehurst No. 2 (bucket list), No. 4 (recently renovated), Dormie Club for private-feel access, Mid Pines and Pine Needles for value",
    organizer: "Best for groups where everyone actually wants to play golf. Not a great fit if half the group needs non-golf entertainment.",
    slug: "/pinehurst-golf-trip-planner"
  },
  {
    name: "Regional / Drive-to Markets",
    range: "$300–$600 per person",
    why: "Every region has strong public golf infrastructure that gets overlooked in favor of fly-to destinations. A drive-to trip eliminates travel cost, typically shortens the planning timeline, and can still deliver 2 to 3 quality rounds at a fraction of the all-in cost.",
    bestCourses: "Depends on your region — the Midwest, Southeast, and Mid-Atlantic all have strong public daily-fee and municipal courses worth researching",
    organizer: "Drive-to trips are the easiest to organize and the easiest to repeat annually. Once the group has a format and a set of courses they like, the planning overhead drops significantly year over year.",
    slug: null
  }
];

export default function BestBudgetGolfTripDestinationsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Best budget golf trip destinations for groups
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A strong group golf trip does not require a $2,000 per-person budget. The destinations below deliver
            real golf experiences — good courses, manageable logistics, solid lodging — without the premium price
            tag. What they have in common: value-friendly course options, lodging that works for groups, and
            infrastructure that does not require a resort account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {destinations.map((dest) => (
            <Card key={dest.name} className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">{dest.name}</h2>
                <span className="inline-flex items-center rounded-full bg-forest-900/10 px-4 py-1.5 text-sm font-semibold text-forest-900">
                  {dest.range}
                </span>
              </div>
              <p className="mt-4 text-base leading-7 text-charcoal/68">{dest.why}</p>
              <div className="mt-5 rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">Courses to consider</p>
                <p className="mt-1 text-sm leading-6 text-charcoal/68">{dest.bestCourses}</p>
              </div>
              <div className="mt-3 rounded-[18px] bg-cream px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">Organizer note</p>
                <p className="mt-1 text-sm leading-6 text-charcoal/68">{dest.organizer}</p>
              </div>
              {dest.slug && (
                <p className="mt-4">
                  <a href={dest.slug} className="text-sm font-medium text-forest-900 underline-offset-2 hover:underline">
                    Plan your {dest.name.split(",")[0]} trip →
                  </a>
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            How to maximize value at any destination
          </h2>
          <div className="mt-6 space-y-3">
            {[
              "Play one marquee course and fill the rest of the schedule with strong value options — one $180 round and two $70 rounds is a better trip than three $100 rounds",
              "Book a rental house instead of hotel rooms once your group is 6 or more — the per-person savings on lodging can fund an extra round",
              "Travel in shoulder season rather than peak — a 3-week shift in timing can reduce costs by 20–30% at popular destinations",
              "Collect budget ranges privately before you research anything — knowing the real window prevents planning a trip the group cannot afford"
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3 rounded-[18px] bg-cream px-4 py-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-900" />
                <p className="text-sm leading-6 text-charcoal/68">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Golf trip cost per person", href: "/golf-trip-cost-per-person", body: "Realistic cost ranges across all destination tiers." },
            { title: "Golf trip budget breakdown", href: "/golf-trip-budget-breakdown", body: "How to break down and track costs across every trip category." },
            { title: "Myrtle Beach golf trip planner", href: "/myrtle-beach-golf-trip-planner", body: "A detailed planning guide for the most popular budget golf destination." },
            { title: "Best golf trip destinations", href: "/best-golf-trip-destinations", body: "The full destination guide across all budget tiers." }
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Find out what your group can spend before you pick a destination
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budget ranges privately so you know the real per-person window — and which
            destinations are actually on the table — before anyone falls in love with the wrong trip.
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
