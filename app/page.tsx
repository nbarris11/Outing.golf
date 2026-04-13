import { CalendarRange, CheckCircle2, CircleDollarSign, MapPinned, MessageSquareText } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicContentBlocks } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/site-settings";

export default async function LandingPage() {
  const contentBlocks = await getPublicContentBlocks();
  const { siteProfile, landingPage } = await getPublicSiteSettings();
  const hero = contentBlocks.find((block) => block.key === "hero");
  const outcomeIcons = [CircleDollarSign, CalendarRange, MapPinned, MessageSquareText];

  return (
    <PageShell minimalHeader>
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <Badge className="bg-forest-900/10 text-forest-900">{siteProfile.heroBadge}</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-charcoal sm:text-6xl lg:text-7xl">
              {hero?.title ?? "Golf trip planner for groups"}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-charcoal/66">
              {hero?.body ??
                "Collect budgets, dates, course preferences, and lodging ideas in one place so your group can align faster and actually book the trip."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={hero?.ctaHref ?? "/sign-up"} className="w-full sm:w-auto">
                {hero?.ctaLabel ?? "Start Planning Free"}
              </Button>
              <Button href="#how-it-works" variant="secondary" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </div>
            <p className="mt-4 text-sm text-charcoal/60">
              Already have an account?{" "}
              <a href="/sign-in" className="font-medium text-forest-900 underline-offset-2 hover:underline">
                Sign in
              </a>
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Collect budgets and dates fast",
                "Find the date and budget window that fits",
                "Go from scattered ideas to a confirmed trip"
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
                  <Badge className="bg-white/10 text-cream">{siteProfile.launchStatusLabel}</Badge>
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
              {landingPage.painPointsTitle}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal/66">
              {landingPage.painPointsBody}
            </p>
          </div>
          <div className="grid gap-3">
            {landingPage.painPoints.map((point) => (
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
            {landingPage.stepsTitle}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {landingPage.steps.map((item) => (
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
            {landingPage.outcomesTitle}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {landingPage.outcomes.map((item, index) => {
            const Icon = outcomeIcons[index] ?? CheckCircle2;

            return (
            <Card key={item.title} className="p-6">
              <Icon className="h-5 w-5 text-forest-900" />
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/66">{item.body}</p>
            </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {landingPage.faqs.map((item) => (
            <Card key={item.question} className="p-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/66">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guides</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            More resources for golf trip organizers
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How it works",
              href: "/how-it-works",
              body: "See the full planning workflow from outing creation to group decision."
            },
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "A step-by-step guide for getting your group from idea to booked trip."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why getting budget ranges from everyone early changes the whole planning process."
            },
            {
              title: "Planner vs. spreadsheet",
              href: "/golf-trip-planner-vs-spreadsheet",
              body: "How a purpose-built planning tool compares to a shared doc."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">{landingPage.finalCtaEyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            {landingPage.finalCtaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            {landingPage.finalCtaBody}
          </p>
          <div className="mt-8">
            <Button href={landingPage.finalCtaHref} className="bg-cream text-charcoal hover:bg-white">
              {landingPage.finalCtaLabel}
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
