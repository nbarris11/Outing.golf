import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Bachelor Golf Trip Planner: How to Organize the Outing",
  description:
    "How to organize a bachelor golf trip when the group has mixed budgets, a hard deadline, and high expectations.",
  alternates: { canonical: "https://www.outing.golf/bachelor-golf-trip-planner" }
};

export default function BachelorGolfTripPlannerPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Use case</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Bachelor golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A bachelor golf trip has one extra layer of complexity: the groom may or may not know what is being
            planned, and the group usually has a wider spread of budgets, availability, and golf experience than a
            regular buddies trip. Someone has to organize it, and that job is harder than it looks.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Start with the group and the groom
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Before you pick a destination, figure out who is coming. Bachelor trips often have a mix of close
              friends and family members who golf at very different levels and have very different budgets. Knowing
              the group composition early changes which destinations make sense and what kind of courses to book.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              If the groom has a bucket-list course or destination in mind, that is worth knowing before you
              research anything. If this is a surprise, you have more flexibility — but the organizer still needs
              to make the call.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Lock in the budget window first
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Bachelor trips tend to have the widest budget spread of any group golf trip. Some guys want to go all
              out; others are managing real constraints. Collecting budget ranges privately before the group
              discussion prevents anyone from feeling pressure to overspend — or from tanking the trip with a low
              anchor number.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Once you know the realistic range, you can plan a trip that actually works for most of the group
              rather than just hoping everyone is flexible.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Find the date window that works for the core crew
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Bachelor trips are usually three to four days — for a day-by-day breakdown of how that structure
              typically works, see the{" "}
              <a href="/bachelor-golf-trip-itinerary" className="text-forest-900 underline-offset-2 hover:underline">
                bachelor golf trip itinerary template
              </a>
              . The date conversation is often the hardest part
              because it involves coordinating work schedules, family schedules, and the wedding timeline. Get
              everyone's availability in the first round of planning, set a deadline for responses, and pick the
              window that works for the core group.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Not everyone will make every date work. Pick the window and move.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Pick a destination that fits the group, not just the golf
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Great bachelor golf destinations have courses worth playing and enough non-golf options to give
              non-golfers or lighter golfers something to do. Scottsdale, Myrtle Beach, and Las Vegas all work well
              because they have strong golf alongside other activities. Pure golf destinations like Bandon Dunes or
              Pinehurst are better fits for groups where everyone is serious about the game.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Keep lodging simple
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              A shared rental house or a hotel block usually works better than booking individual rooms across
              different properties. Keeping the group together makes logistics easier and usually brings the per-person
              cost down. Decide on lodging before you start sending people to book their own arrangements.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "A step-by-step guide that applies to any group golf trip, including bachelor trips."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist so nothing falls through the cracks."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why collecting real budget ranges privately matters — especially for mixed-budget groups."
            },
            {
              title: "Back to home",
              href: "/",
              body: "See how Outing.golf collects group input and moves everyone toward one plan."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Group golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            One place for the whole bachelor trip plan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and preferences from the crew in one place — so the organizer can
            stop herding cats and start actually planning the trip.
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
