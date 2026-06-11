import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Buddies Golf Trip Planner for Annual Group Trips | Outing.golf",
  description:
    "A buddies golf trip planner built for the organizer who always ends up doing all the work — collect budgets, align on dates, and get everyone to a decision without the endless group chat.",
  path: "/buddies-golf-trip-planner"
});

export default function BuddiesGolfTripPlannerPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Buddies Golf Trip Planner for Annual Group Trips | Outing.golf",
          description:
            "A buddies golf trip planner built for the organizer who always ends up doing all the work — collect budgets, align on dates, and get everyone to a decision without the endless group chat.",
          path: "/buddies-golf-trip-planner"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Buddies golf trip planner", path: "/buddies-golf-trip-planner" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Use case</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Buddies golf trip planner
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A buddies golf trip comes together when the organizer collects three things up front — availability,
            a private budget range, and destination preferences — instead of asking open-ended questions in the
            group chat. Done through one shared link, that collection step takes each guy about 3 minutes, and the
            median group responds within 24 hours. The annual trip runs on good intentions and bad logistics; here
            is how to make this year's version easier for the person running it.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              The organizer problem
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Every buddies trip has one person who does most of the planning — sending the group texts, researching
              destinations, tracking responses, and eventually making the call that nobody else will make. That job
              gets harder every year as everyone gets busier.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The planning overhead is what causes trips to stall or fall apart. A group golf trip planner that
              collects input automatically takes a real chunk of that work off the organizer's plate.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Getting availability without the back-and-forth
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Date alignment is the first thing that should happen and the thing that takes the longest in a group
              chat. Asking "when works for everyone?" in a text thread produces a week of partial replies, forgotten
              responses, and conflicting suggestions.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Collecting availability through a single flow — where everyone responds on their own time — is faster
              than waiting for a group chat to converge, and produces a real answer instead of a guess.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Setting a budget the whole group can live with
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Long-running friend groups often have a mix of financial situations that changes year to year. The
              budget conversation is one most groups avoid in the chat because nobody wants to be the person who
              sets the ceiling.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Collecting budget ranges privately before anyone discusses them publicly gives you the real range
              without the social friction. Once you know where the group actually lines up, picking a destination
              tier becomes straightforward.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Picking a destination everyone is actually excited about
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Annual trips often rotate destinations or revisit favorites. Collecting destination preferences from
              the group — along with course quality priorities and lodging preferences — gives the organizer real
              data to work with instead of going on gut instinct.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Present two or three real options with courses and lodging attached, let the group weigh in, and pick
              one. That is faster than trying to build consensus on an open-ended question.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Moving from alignment to booking
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Once budget, dates, and destination are aligned, the organizer can move quickly. The planning work is
              mostly done. What kills trips at this stage is losing momentum — the window closes, someone pulls out,
              or a better option appears and reopens the whole conversation.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              When alignment is clear, the call is easier to make. Book the lodging, lock the tee times, send the
              summary.
            </p>
          </div>
        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "How do you plan a buddies golf trip without one person doing all the work?",
            answer:
              "Separate input collection from decision-making. Have everyone submit dates, a private budget range, and destination preferences through one link — then the organizer's job shrinks to presenting two or three real options and calling the vote, instead of chasing replies across a text thread."
          },
          {
            question: "How do you handle different budgets in a long-running friend group?",
            answer:
              "Collect ranges privately before anyone discusses numbers publicly. Financial situations shift year to year, and nobody wants to be the one who sets the ceiling in the chat. Private submission removes the social friction and shows you the real overlap."
          },
          {
            question: "How far in advance should an annual buddies trip be planned?",
            answer:
              "Start collecting dates and budgets 4–6 months out for a fly-to trip — peak-season tee times and group lodging at popular destinations book up well ahead. A drive-to weekend can come together in 6–8 weeks, but the budget and date collection should still happen first."
          },
          {
            question: "What group size works best for a buddies golf trip?",
            answer:
              "Multiples of four — 8 and 12 are the sweet spots. Clean foursomes keep tee sheets simple, and an 8–12 person group fills a rental house efficiently, which is usually the best per-person lodging value."
          }
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How to organize a golf trip with friends",
              href: "/organize-a-golf-trip-with-friends",
              body: "The five-step process for getting a group from scattered interest to a confirmed plan."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "Phase-by-phase checklist from first message to final itinerary."
            },
            {
              title: "Annual golf trip checklist",
              href: "/annual-golf-trip-checklist",
              body: "Built for organizers running the same trip every year — what to do differently once it repeats."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Group golf trip planner</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Make this the year it actually comes together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, and destination preferences from the group in one place so the
            organizer can stop chasing replies and start making decisions.
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
