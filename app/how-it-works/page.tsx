import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How It Works | Golf Trip Planning Software | Outing.golf",
  description:
    "See how Outing.golf works as a golf trip organizer tool. Collect group budgets, dates, and preferences, compare destinations, and get to a decision faster."
};

export default async function HowItWorksPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">How it works</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            A structured flow for the person planning the trip
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            Outing.golf is a golf trip planning tool that gives the organizer one place to collect group input and
            move toward a real decision. No spreadsheets. No copy-pasted notes. No wondering which text thread has
            the latest answer.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <ProcessSteps />
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

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related guides</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Back to home",
              href: "/",
              body: "See what Outing.golf does and start your first outing."
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
            <Button href="/sign-up" className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
