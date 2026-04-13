import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Scottsdale Golf Trip Planner | Outing.golf",
  description:
    "Scottsdale is one of the top group golf trip destinations. Outing.golf helps you get your group aligned on dates, budget, and courses before you start shopping rates."
};

export default function ScottsdaleGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Destination guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Scottsdale golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Scottsdale is one of the most popular destinations for group golf trips — reliable weather, a strong
            mix of courses across different price points, and enough lodging variety to fit different budgets. But
            a good destination does not fix a disorganized group. Before you start shopping rates, get the group
            aligned on dates and budget first.
          </p>
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
              Budget ranges for a Scottsdale golf trip
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Scottsdale has a wide range, which is part of what makes it work for different groups. A trip built
              around value-tier courses and a shared rental house lands in a very different range than one built
              around resort lodging and high-end greens fees. The destination supports both — the question is which
              version fits your group.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Collect budget ranges from everyone before you start researching. The range you get back determines
              which courses and lodging options are actually worth looking at.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Best time to go
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              January through March is peak season — best weather, most availability, highest rates. October and
              November offer good weather with less crowding. April is strong for weather but can be busy around
              spring break. Summer is hot and rates drop significantly, but mid-day rounds are not practical for
              most groups.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              If the group has flexibility, late October or early March tends to hit the best balance of weather,
              availability, and price.
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
                <span className="font-medium text-charcoal">TPC Scottsdale</span> — Home of the Waste Management
                Phoenix Open. Stadium Course is a strong bucket-list option; Champions Course is more accessible.
              </li>
              <li>
                <span className="font-medium text-charcoal">Troon North</span> — Two layouts in a dramatic desert
                setting. Monument Course is widely regarded as one of the best in the area.
              </li>
              <li>
                <span className="font-medium text-charcoal">We-Ko-Pa</span> — Two courses in the Fort McDowell
                area, slightly outside the main corridor, with strong conditions and good value relative to the
                top-tier resorts.
              </li>
              <li>
                <span className="font-medium text-charcoal">Quintero</span> — A more remote option northwest of
                Phoenix with a strong reputation among serious golfers.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Lodging options
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Scottsdale has resort on-property options, short-term rental houses, and hotels across different
              price points. A shared rental house in the North Scottsdale or Fountain Hills area often provides
              good proximity to courses and is cost-effective for groups of six or more. On-property resort
              lodging offers convenience but tends to cost more.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The lodging decision should come after you have confirmed your date window and budget range — not
              before.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Best golf trip destinations for groups",
              href: "/best-golf-trip-destinations-for-groups",
              body: "Compare Scottsdale to other top group golf destinations across the US."
            },
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "A full step-by-step guide for getting your group from idea to booked trip."
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
