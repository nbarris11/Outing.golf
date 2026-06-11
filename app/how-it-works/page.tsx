import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { AuthCta } from "@/components/marketing/auth-cta";
import { FaqSection } from "@/components/marketing/faq-section";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "How Outing.golf Works — Group Golf Trip Planning Tool",
  description:
    "See how Outing.golf works — from creating an outing to collecting group input and getting everyone aligned on one confirmed plan.",
  path: "/how-it-works"
});

const faqs = [
  {
    question: "Is Outing.golf really free?",
    answer:
      "Yes — free for the organizer and free for every group member. There is no trial clock, no per-trip fee, and members are never asked to pay anything. You can plan a full outing end to end without entering a credit card."
  },
  {
    question: "Do group members need accounts?",
    answer:
      "Yes, but it is fast and free. When a member opens the organizer's invite link, they create a free account (or sign in) and land right back on that exact outing to submit their dates, budget range, and preferences. The whole thing takes a couple of minutes, and members never pay."
  },
  {
    question: "Does Outing.golf book tee times?",
    answer:
      "No. Outing.golf is the decision layer that comes before booking — it gets your group aligned on dates, budget, courses, and lodging so the organizer knows exactly what to book. You then reserve tee times and lodging directly with the course or property, which usually gets you better group rates anyway."
  },
  {
    question: "How is this different from a spreadsheet?",
    answer:
      "A spreadsheet collects whatever people type into it, whenever they get around to it. Outing.golf asks each member a structured set of questions — budget range, availability, destination lean, lodging preference — then shows the organizer the overlap automatically, with live course and lodging options to vote on. Median group response time is about 24 hours, mostly because answering takes two minutes instead of finding the row with your name on it."
  }
];

export default function HowItWorksPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "How Outing.golf Works — Group Golf Trip Planning Tool",
          description:
            "See how Outing.golf works — from creating an outing to collecting group input and getting everyone aligned on one confirmed plan.",
          path: "/how-it-works"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">How it works</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            How the golf trip planning tool works
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Outing.golf is a free golf trip planning app that collects dates, budgets, and course votes from your
            group in one place. The organizer creates an outing and shares one link; everyone else answers a short
            set of questions; and the group lands on one confirmed plan — no spreadsheets, no copy-pasted notes,
            no wondering which text thread has the latest answer.
          </p>
          <p className="mt-3 text-lg leading-8 text-charcoal/68">
            It is built for groups of 4–16, it is free for the organizer and every member, and the median group
            gets all responses back within about 24 hours. Here is exactly how it works.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <ProcessSteps />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">The walkthrough</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            What actually happens at each step
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">1. Set the trip frame</h3>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                The organizer creates an outing and sets the loose parameters: a budget target, one or more
                preferred date windows, a destination type or specific destination, a lodging lean (house vs.
                resort), and the trip style. None of it is locked yet — the frame exists so the group reacts to
                something concrete instead of an open-ended &quot;so... where should we go?&quot; This takes about five
                minutes, and it is the only setup the organizer does.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">2. Invite the group</h3>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                One shareable link goes out — drop it in the group text, the email chain, wherever your group
                lives. Each member opens it, creates a free account, and lands directly on the outing. The
                organizer&apos;s dashboard shows who has responded and who still needs a nudge, which replaces the
                worst part of organizing: scrolling back through a thread trying to remember who never answered.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">3. Collect preferences</h3>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Each member submits their real budget range, their date availability, their destination lean, their
                course quality preference, and any comments — privately, in one short flow. The private part
                matters: in a group chat, the first number posted anchors everyone else, and the guy whose ceiling
                is $700 never says so after someone types &quot;I&apos;m good for whatever.&quot; Structured individual answers
                are why the median group has everything back within about 24 hours.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">4. Compare, vote, decide</h3>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                The organizer sees the overlap — where budgets and dates actually align — and the group votes on
                live course and lodging options pulled from real providers, not a hand-built list of links. Once
                the call is made, the plan lives in a shared Trip HQ: round-by-round schedule, packing list, and a
                countdown, so the final answer to every &quot;wait, what time Saturday?&quot; is one link instead of a
                scroll through three weeks of messages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Scope</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            What Outing.golf is — and isn&apos;t
          </h2>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            Outing.golf sits at the decision layer of trip planning — the messy stretch between &quot;we should do a
            trip&quot; and &quot;here is what to book.&quot; That stretch is where most trips die, and it is the part group
            chats and spreadsheets handle worst, so it is the part this tool is built to own.
          </p>
          <p className="mt-3 text-base leading-7 text-charcoal/68">
            It is <em>not</em> a booking engine, a tee-time app, or a scoring app. Outing.golf does not reserve
            your tee times, hold your lodging, or track your skins game. Once the group has decided, the organizer
            books directly with the course and the property — where group rates are usually negotiated anyway —
            and the confirmed details go into the shared Trip HQ. If you want the full organizer&apos;s playbook for
            that whole sequence,{" "}
            <a href="/how-to-plan-a-golf-trip" className="text-forest-900 underline-offset-2 hover:underline">
              the step-by-step golf trip planning guide
            </a>{" "}
            covers it end to end.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          {
            title: "Organizer control",
            body: "Create the outing, set the destination and budget parameters, invite the group, and guide the final decision — without chasing replies across multiple threads."
          },
          {
            title: "Invitee simplicity",
            body: "Everyone responds in one short flow: budget range, available dates, destination lean, and lodging preference. No spreadsheet, no separate survey link."
          },
          {
            title: "Budget and destination comparison",
            body: "See where the group's budgets and dates overlap, compare destination options side by side, and move to a clear decision faster than you would in a group chat."
          }
        ].map((item) => (
          <Card key={item.title}>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-charcoal/68">{item.body}</p>
          </Card>
        ))}
      </section>

      <FaqSection title="How it works FAQs" faqs={faqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related guides</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist covering everything from budget collection to the final itinerary."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why collecting real budget ranges early changes the entire planning process."
            },
            {
              title: "Planner vs. spreadsheet",
              href: "/golf-trip-planner-vs-spreadsheet",
              body: "How a purpose-built golf trip planning tool compares to a shared doc."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Ready to start</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Stop organizing by group text
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, courses, and lodging preferences in one place so the group can
            actually make a decision.
          </p>
          <div className="mt-8">
            <AuthCta className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </AuthCta>
            <p className="mt-3 text-sm text-cream/65">Free for the organizer · Group members never pay</p>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
