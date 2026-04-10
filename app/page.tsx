import Link from "next/link";
import { CalendarRange, CheckCircle2, CircleDollarSign, MapPinned, MessageSquareText } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDemoState } from "@/lib/demo/store";

const painPoints = [
  "The date discussion lives in three different places.",
  "Nobody knows the real budget range until it is too late.",
  "Course and lodging ideas get buried in the chat.",
  "The organizer ends up rebuilding the whole trip in a spreadsheet."
];

const steps = [
  {
    step: "1",
    title: "Start the outing",
    body: "Set the destination idea, date windows, budget target, and trip style in a minute or two."
  },
  {
    step: "2",
    title: "Collect the group input",
    body: "Everyone shares budgets, available dates, lodging preferences, and destination lean in one short flow."
  },
  {
    step: "3",
    title: "See the best plan",
    body: "Outing.golf highlights the strongest overlap so the group can narrow the trip and book faster."
  }
];

const outcomes = [
  {
    icon: CircleDollarSign,
    title: "Know the real budget early",
    body: "See where the group actually lines up before you waste time planning the wrong trip."
  },
  {
    icon: CalendarRange,
    title: "Spot date overlap instantly",
    body: "The easiest date window rises to the top so the organizer can move the group forward."
  },
  {
    icon: MapPinned,
    title: "Compare destinations in one place",
    body: "Courses, lodging, and group votes stay tied to the same shortlist instead of scattered ideas."
  },
  {
    icon: MessageSquareText,
    title: "Keep one decision thread",
    body: "The group stays in one planning flow, which means fewer side texts and fewer repeated questions."
  }
];

export default async function LandingPage() {
  const { contentBlocks } = await getDemoState();
  const faq = contentBlocks.find((block) => block.key === "faq");

  return (
    <PageShell minimalHeader>
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <Badge className="bg-forest-900/10 text-forest-900">Golf trip planning, simplified</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-charcoal sm:text-6xl lg:text-7xl">
              Plan the golf trip without the group text chaos
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-charcoal/66">
              Collect budgets, dates, courses, and lodging in one place so your group can actually decide and book faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up">
                <Button className="w-full sm:w-auto">Start Planning Free</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="secondary" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Collect budgets and dates fast",
                "See the strongest overlap clearly",
                "Move the group to a real plan"
              ].map((line) => (
                <div key={line} className="rounded-[22px] bg-white/84 px-4 py-4 text-sm text-charcoal/68 ring-1 ring-charcoal/8">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_top,rgba(217,200,167,0.26),transparent_42%),linear-gradient(135deg,rgba(20,58,44,0.2),transparent_65%)] blur-2xl" />
            <Card className="relative overflow-hidden rounded-[40px] border-none bg-white/90 p-0 shadow-[0_30px_90px_rgba(33,36,35,0.1)]">
              <div className="border-b border-charcoal/8 bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] px-5 py-5 text-cream sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cream/55">Subtle product preview</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Phoenix spring foursome</h2>
                    <p className="mt-2 text-sm text-cream/72">A calm snapshot of what the organizer sees when the group starts aligning.</p>
                  </div>
                  <Badge className="bg-white/10 text-cream">Planning</Badge>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="rounded-[28px] bg-cream p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-charcoal/48">Decision readiness</p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-charcoal">82%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-charcoal/48">Best date overlap</p>
                      <p className="mt-2 text-sm font-medium text-charcoal">May 10-13</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-white">
                    <div className="h-2.5 w-[82%] rounded-full bg-forest-900" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[26px] border border-charcoal/8 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-charcoal/38">Top destination</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-charcoal">Scottsdale Sun Split</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/62">Best weather fit, direct flights, and enough group-friendly lodging options.</p>
                  </div>
                  <div className="rounded-[26px] border border-charcoal/8 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-charcoal/38">Budget window</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-charcoal">$900-$1,400</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/62">Most of the group is comfortably aligned inside one realistic budget range.</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-charcoal/8 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-charcoal">What the app is doing</p>
                    <Badge>Simple, not noisy</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Collecting missing inputs from the last two invitees",
                      "Ranking destination, course, and lodging options together",
                      "Keeping the whole decision in one thread instead of scattered texts"
                    ].map((line) => (
                      <div key={line} className="flex items-start gap-3 rounded-[20px] bg-cream px-4 py-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-900" />
                        <p className="text-sm leading-6 text-charcoal/68">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Why this exists</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
              Golf trips fall apart in the gap between idea and decision
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/66">
              Most groups do not need more options. They need one clean place to collect the basics, see what overlaps, and make a call.
            </p>
          </div>
          <div className="grid gap-3">
            {painPoints.map((point) => (
              <div key={point} className="rounded-[26px] border border-charcoal/8 bg-white/86 px-5 py-4 text-sm leading-6 text-charcoal/68">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">How it works</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            Three simple steps from messy idea to real plan
          </h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.step} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900 text-sm font-semibold text-cream">
                {item.step}
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/66">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">What you get</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            The outcomes that actually make planning easier
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {outcomes.map((item) => (
            <Card key={item.title} className="p-6">
              <item.icon className="h-5 w-5 text-forest-900" />
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/66">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Social proof</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
              Built for the person who always ends up organizing the trip
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/66">
              This placeholder is ready for testimonials and launch partners later. For now, it signals the kind of confidence the product is designed to create.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "People actually fill out their preferences because it feels quick.",
              "The organizer can immediately see what is still blocking the decision.",
              "Course and lodging options stay tied to the same shortlist.",
              "The group gets to a confident next step much faster."
            ].map((line) => (
              <div key={line} className="rounded-[24px] bg-cream px-4 py-4 text-sm leading-6 text-charcoal/68">
                {line}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            {
              question: "Do invitees need accounts?",
              answer: "For the MVP, yes. It keeps outing access private and makes permissions simple."
            },
            {
              question: "Can we compare multiple destinations at once?",
              answer: "Yes. The compare view keeps destinations, courses, and lodging together so tradeoffs stay clear."
            },
            {
              question: faq?.title ?? "Can I test this before live provider APIs are connected?",
              answer:
                faq?.body ??
                "Yes. The product ships with mock provider adapters and seeded data so the full workflow can be tested now."
            },
            {
              question: "Is this trying to replace booking tools?",
              answer: "Not in version one. The goal is to get the group to a clear plan first, then layer official booking integrations in later."
            }
          ].map((item) => (
            <Card key={item.question} className="p-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/66">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Start planning</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Make the plan obvious for everyone
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Bring budgets, dates, courses, and lodging into one calm workflow so the group can stop circling and start deciding.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button className="bg-cream text-charcoal hover:bg-white">Start Planning Free</Button>
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
