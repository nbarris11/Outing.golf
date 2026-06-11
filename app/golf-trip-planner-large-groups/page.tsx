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
  title: "Golf Trip Planner for Large Groups (8, 12, or 16 Players)",
  description:
    "What changes when you're planning for 8, 12, or 16 players — and how to keep the decision-making from falling apart.",
  path: "/golf-trip-planner-large-groups"
});

const faqs = [
  {
    question: "How far in advance should you plan a golf trip for a large group?",
    answer:
      "Start collecting availability 3 to 4 months out. That is not premature for 8 to 12 players — it is the minimum lead time you need to find a workable date window. Set a specific response deadline ('respond by the 15th') or availability requests will sit in inboxes for weeks."
  },
  {
    question: "How do tee times work for a group of 12?",
    answer:
      "Golf is played in foursomes, so 12 players is three foursomes with staggered tee times. Groups of 10 or 14 are the logistical wrinkle — someone goes out in a non-standard group, and many courses have preferences or restrictions about that. Confirm the final headcount before booking."
  },
  {
    question: "What about groups of 16 or more?",
    answer:
      "At 16+, ask courses about exclusive shotgun starts or full-course buyouts. They often need to be arranged weeks in advance, but they solve the staggered tee time problem and keep the whole group on the course at once."
  },
  {
    question: "Is a rental house or hotel better for a large golf group?",
    answer:
      "For 8 players, a single rental house usually wins on cost and logistics. For 12 to 16, you may need multiple properties or a villa/condo complex — Myrtle Beach and Scottsdale both have options that hold 8 to 16 in one footprint. Either way, book early; right-size properties fill fast."
  }
];

export default function GolfTripPlannerLargeGroupsPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Golf Trip Planner for Large Groups (8, 12, or 16 Players)",
          description:
            "What changes when you're planning for 8, 12, or 16 players — and how to keep the decision-making from falling apart.",
          path: "/golf-trip-planner-large-groups"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Golf trip planner for large groups", path: "/golf-trip-planner-large-groups" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Use case</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Golf trip planner for large groups
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Planning a golf trip for 8, 12, or 16 players comes down to four things: collect budget ranges
            privately (expect a $600–$800 spread in a group of 12), gather availability 3 to 4 months out with a
            hard response deadline, plan tee times in foursomes from the start, and lock group lodging before the
            right-size properties fill. Every planning problem that exists for a group of 4 gets amplified at
            this scale — and the organizer's inbox fills up fast.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Budget gets harder to pin down at scale
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              With 8 or more players, the budget spread is almost always wider than you expect. In a group of 4,
              you might have everyone in a $200 range of each other. In a group of 12, you will often find a gap
              of $600 to $800 between the low end and the high end. The only way to know the real distribution is
              to collect ranges privately — before anyone anchors the group chat with a number.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Once you have the real budget window, you can make a clear call: plan the trip for the realistic
              majority range and let outliers opt in or out, rather than designing the whole trip around a false
              consensus.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Date alignment with 8 guys takes longer — start earlier
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Getting 4 people to agree on a date is manageable. Getting 8 to 12 people to agree takes more time
              and usually requires flexibility on what "most of the group" means. For annual golf trips or large
              friend group outings, collecting availability windows 3 to 4 months out is not premature — it is the
              minimum lead time you need to find a workable window. If this is a recurring trip, the{" "}
              <a href="/annual-golf-trip-checklist" className="text-forest-900 underline-offset-2 hover:underline">
                annual golf trip checklist
              </a>{" "}
              covers how to capture what worked and build on it year over year.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Set a clear deadline for responses. If you leave availability open-ended, it will sit in people's
              inboxes for weeks. A specific deadline — "respond by the 15th" — gets you a much faster turnaround.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Plan for foursomes from the beginning
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Golf is played in foursomes. A group of 8 is two foursomes. A group of 12 is three. A group of 10
              or 14 is a logistical wrinkle — someone is going out in a different group. Knowing the final headcount
              before you book tee times matters because most courses have preferences (or restrictions) about
              non-standard group sizes, and staggered tee times may be required.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              For very large groups (16+), some courses offer exclusive shotgun starts or full-course buyouts.
              These are worth asking about early, as they often need to be arranged weeks in advance.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Lodging headcount math matters more than people think
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              For a group of 8, a single rental house often works well and brings the per-person cost down
              significantly compared to individual hotel rooms. For 12 or 16, you may need multiple properties —
              which means room assignments, logistics for getting to the courses, and a higher coordination burden.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              Some resort destinations have villa or condo complexes that can accommodate larger groups in a single
              footprint. Myrtle Beach and Scottsdale both have options that work well for groups of 8 to 16. Lock
              lodging early — the right-size properties book out faster than you expect.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Voting on courses when everyone has an opinion
            </h2>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              In a large group, everyone has heard of different courses, has bucket-list picks, and has varying
              ideas about what the trip should feel like. Presenting a curated shortlist of 4 to 5 courses —
              filtered by your group's actual budget and destination — and letting the group vote is far more
              efficient than opening a discussion with no structure.
            </p>
            <p className="mt-3 text-base leading-7 text-charcoal/68">
              The organizer's job is to narrow the field, not crowd-source the entire decision. Present the
              shortlist, collect votes, assign the top picks to specific days, and move on. For the full
              phase-by-phase sequence,{" "}
              <a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">
                see the golf trip planning checklist
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "The full planning sequence — steps that apply whether you have 4 players or 16."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why collecting budget ranges privately matters even more for large groups."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist for organizing a group trip from scratch."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "Which destinations handle large groups well — and what to know before you plan there."
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
            Collect input from 8, 12, or 16 players in one place
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf is built for exactly this — collecting budget ranges, dates, and preferences at scale so
            the organizer has what they need without running down 16 separate conversations.
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
