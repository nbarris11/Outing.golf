import { CalendarRange, CheckCircle2, CircleDollarSign, MapPinned, MessageSquareText } from "lucide-react";

import { Testimonial } from "@/components/marketing/testimonial";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicContentBlocks } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/site-settings";

export default async function LandingPage() {
  const contentBlocks = await getPublicContentBlocks();
  const { siteProfile, landingPage } = await getPublicSiteSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Outing.golf",
    url: "https://www.outing.golf",
    logo: "https://www.outing.golf/og-default.png",
    contactPoint: { "@type": "ContactPoint", email: "hello@outing.golf", contactType: "customer support" },
    founder: { "@type": "Person", name: "Neil Barris" }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Outing.golf",
    url: "https://www.outing.golf",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.outing.golf/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landingPage.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
  const hero = contentBlocks.find((block) => block.key === "hero");
  const outcomeIcons = [CircleDollarSign, CalendarRange, MapPinned, MessageSquareText];

  return (
    <PageShell minimalHeader>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <Badge className="bg-forest-900/10 text-forest-900">{siteProfile.heroBadge}</Badge>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-charcoal sm:text-6xl lg:text-7xl">
              {hero?.title ?? "Golf trip planner for groups"}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-charcoal/66">
              {hero?.body ??
                "Collect dates, budgets, and votes in one place — and finally book the trip your group has been talking about for two years."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={hero?.ctaHref ?? "/sign-up"} className="w-full sm:w-auto">
                {hero?.ctaLabel ?? "Start Planning Free"}
              </Button>
              <Button href="/sample-trip" variant="ghost" className="w-full sm:w-auto">
                See a sample Trip HQ
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
                "Live courses and hotels matched to your group",
                "Group voting without the group-text chaos",
                "One Trip HQ the whole group can see"
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
                    <p className="text-xs uppercase tracking-[0.24em] text-cream/55">Trip HQ</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Myrtle Beach · 4 players · June</h2>
                    <p className="mt-2 text-sm text-cream/72">The shared home base your whole group can see the moment the plan comes together.</p>
                  </div>
                  <Badge className="bg-white/10 text-cream">{siteProfile.launchStatusLabel}</Badge>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="rounded-[28px] bg-cream p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-charcoal/48">Group responses in</p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-charcoal">4 / 4</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-charcoal/48">Best date overlap</p>
                      <p className="mt-2 text-sm font-medium text-charcoal">June 12–15</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-white">
                    <div className="h-2.5 w-full rounded-full bg-forest-900" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[26px] border border-charcoal/8 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-charcoal/38">Top-voted course</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-charcoal">Caledonia Golf &amp; Fish Club</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/62">3 votes · Assigned to Day 1 of the schedule.</p>
                  </div>
                  <div className="rounded-[26px] border border-charcoal/8 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-charcoal/38">Budget window</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-charcoal">$800–$1,200</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal/62">All four players fall comfortably inside this range.</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-charcoal/8 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-charcoal">What's locked in</p>
                    <Badge>Ready to book</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "2 courses voted on and assigned to specific days",
                      "Hotel shortlist with live rates from the lodging API",
                      "Shared packing list — 6 items checked off, 2 outstanding"
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

      {/* Social proof */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">From the organizers</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            From the organizers using it
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* TODO: replace with real testimonials */}
          <Testimonial
            quote="I used to spend two weekends just collecting everyone's dates in a group text. With this, the whole group responded in under a day and I had my shortlist by Sunday night."
            author="Mike R."
            role="Organizer of an annual Pinehurst trip"
            tripDestination="Pinehurst, NC"
          />
          <Testimonial
            quote="The budget overlap view alone was worth it. I always assumed everyone was on the same page — turns out we had one guy at $600 and one at $1,800. Now we know before we book."
            author="Dave K."
            role="Annual trip organizer, 8 years running"
            tripDestination="Scottsdale, AZ"
          />
          <Testimonial
            quote="Trip HQ is the thing that finally made the whole group feel like they were on the same trip. Everyone could see the schedule, the courses, the packing list — no more 'wait, what hotel are we at?'"
            author="Chris M."
            role="Bachelor trip organizer"
            tripDestination="Myrtle Beach, SC"
          />
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
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
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist so nothing gets skipped and decisions happen in the right order."
            },
            {
              title: "Golf trip itinerary template",
              href: "/golf-trip-itinerary-template",
              body: "A day-by-day trip template with time slots, pre-trip checklist, and a 2-day weekend version."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic per-person cost ranges by destination tier — from drive-to to bucket-list."
            },
            {
              title: "Golf trip budget breakdown",
              href: "/golf-trip-budget-breakdown",
              body: "How greens fees, lodging, travel, food, and extras break down across a full trip."
            },
            {
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "What each major destination costs and what to know before you plan there."
            },
            {
              title: "Best budget destinations",
              href: "/best-budget-golf-trip-destinations",
              body: "Strong courses and real trip experiences without the premium price tag."
            },
            {
              title: "Bachelor golf trip planner",
              href: "/bachelor-golf-trip-planner",
              body: "How to organize a bachelor golf trip when the group has mixed budgets and a hard deadline."
            },
            {
              title: "Bachelor golf trip itinerary",
              href: "/bachelor-golf-trip-itinerary",
              body: "A 4-day day-by-day itinerary template built specifically for a bachelor golf trip."
            },
            {
              title: "Organize a trip with friends",
              href: "/organize-a-golf-trip-with-friends",
              body: "What to collect from the group, in what order, to move from scattered interest to a confirmed plan."
            },
            {
              title: "Annual golf trip checklist",
              href: "/annual-golf-trip-checklist",
              body: "Built for recurring trip organizers — how to build on what worked year over year."
            },
            {
              title: "Planner for large groups",
              href: "/golf-trip-planner-large-groups",
              body: "What changes when you are planning for 8, 12, or 16 players instead of 4."
            },
            {
              title: "Planner vs. spreadsheet",
              href: "/golf-trip-planner-vs-spreadsheet",
              body: "How a purpose-built planning tool compares to a shared doc."
            },
            {
              title: "Scottsdale golf trip planner",
              href: "/scottsdale-golf-trip-planner",
              body: "Courses, budget ranges, and what to know before organizing a Scottsdale group trip."
            },
            {
              title: "Myrtle Beach golf trip planner",
              href: "/myrtle-beach-golf-trip-planner",
              body: "How to navigate 100+ courses and build the right shortlist for your group."
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

      {/* Destination strip */}
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-charcoal/45">Built for trips to</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Myrtle Beach", "Scottsdale", "Pinehurst", "Bandon Dunes", "Streamsong", "Pebble Beach", "Kiawah Island"].map((dest) => (
            <span
              key={dest}
              className="rounded-full border border-charcoal/12 bg-white/70 px-4 py-1.5 text-sm text-charcoal/65"
            >
              {dest}
            </span>
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
