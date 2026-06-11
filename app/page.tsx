import type { Metadata } from "next";
import { CalendarRange, CheckCircle2, CircleDollarSign, MapPinned, MessageSquareText } from "lucide-react";

import { buildMetadata } from "@/lib/seo";

import { DemoLoop } from "@/components/marketing/demo-loop";
import { FounderNote } from "@/components/marketing/founder-note";
import { Testimonial } from "@/components/marketing/testimonial";

import { AuthCta, SignedOutOnly } from "@/components/marketing/auth-cta";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = buildMetadata({
  title: "Golf Trip Planner for Groups | Outing.golf",
  description:
    "Collect dates, budgets, and course votes from your group in one place. Outing.golf is the planning tool built for golf trip organizers.",
  path: "/"
});

export default async function LandingPage() {
  const { landingPage } = await getPublicSiteSettings();

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Outing.golf",
    applicationCategory: "TravelApplication",
    description: "Golf trip planning tool for group organizers. Collect dates, budgets, and course votes in one place.",
    url: "https://www.outing.golf",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    operatingSystem: "Web"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Outing.golf",
    url: "https://www.outing.golf",
    logo: "https://www.outing.golf/icon.svg",
    sameAs: ["https://www.instagram.com/outing.golf/"],
    contactPoint: { "@type": "ContactPoint", email: "hello@outing.golf", contactType: "customer support" },
    founder: { "@type": "Person", name: "Neil Barris", url: "https://www.outing.golf/about" }
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
  const outcomeIcons = [CircleDollarSign, CalendarRange, MapPinned, MessageSquareText];

  return (
    <PageShell minimalHeader>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-charcoal/50">
              For the one who plans the trip
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-charcoal sm:text-6xl lg:text-7xl">
              Get your group to <span className="italic text-forest-900">Bandon</span> this fall.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-charcoal/68">
              One link to the group, one shared Trip HQ when the plan locks in. No spreadsheet, no
              four-text-thread tax — just real courses, real budgets, and a tee time on the books before
              Labor Day.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AuthCta className="w-full sm:w-auto">
                Plan my trip →
              </AuthCta>
              <Button href="/sample-trip" variant="secondary" className="w-full sm:w-auto">
                See a real Trip HQ
              </Button>
            </div>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-charcoal/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Free for the organizer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Group members never pay
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                24h median response time
              </span>
            </p>
            <SignedOutOnly>
              <p className="mt-4 hidden text-sm text-charcoal/60 sm:block">
                Already have an account?{" "}
                <a href="/sign-in" className="font-medium text-forest-900 underline-offset-2 hover:underline">
                  Sign in
                </a>
              </p>
            </SignedOutOnly>
          </div>

          {/* TODO: replace placeholder hero illustration with real Bandon Dunes photograph (1600×2000, ≤250kb). Path: /hero/bandon-dunes.jpg */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(217,200,167,0.26),transparent_42%),linear-gradient(135deg,rgba(20,58,44,0.2),transparent_65%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[40px] shadow-[0_30px_90px_rgba(33,36,35,0.18)]">
              <div
                className="relative aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(255,229,178,0.5) 0%, rgba(217,200,167,0.7) 22%, rgba(110,138,127,0.85) 55%, rgba(20,58,44,0.95) 92%), radial-gradient(ellipse 80% 30% at 50% 100%, rgba(10,24,18,0.95), transparent 60%)"
                }}
              >
                {/* Stylized dune silhouette */}
                <svg className="absolute inset-x-0 bottom-0 h-2/5 w-full" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 200 L0 130 Q 60 90 120 110 T 240 100 T 400 80 L400 200 Z" fill="#143a2c" opacity="0.85" />
                  <path d="M0 200 L0 160 Q 80 130 160 145 T 320 140 T 400 130 L400 200 Z" fill="#10231b" />
                  {/* Flagstick */}
                  <rect x="290" y="50" width="1.5" height="92" fill="#f7f4ee" />
                  <path d="M291 52 L312 58 L291 64 Z" fill="#c8932e" />
                </svg>
              </div>

              {/* Overlays */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-cream">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-forest-900">
                  <span className="h-2 w-2 rounded-full bg-flag-red" />
                  4 of 4 responded · Trip HQ live
                </span>
                <div className="mt-auto flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-3xl tracking-[-0.03em]">Bandon Dunes</h3>
                    <p className="mt-1 text-sm text-cream/80">June 12–15 · Pacific Dunes, Old Mac, Bandon Trails</p>
                  </div>
                  <div className="text-right font-serif">
                    <p className="text-3xl leading-none text-gold-soft">$1,180</p>
                    <p className="mt-1 font-sans text-xs font-medium uppercase tracking-wider text-cream/70">per player</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-up benefits — moved below hero photo per Sprint 2.8 mobile diet */}
        <div className="mt-12 hidden gap-3 sm:grid sm:grid-cols-3">
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
        <div className="mt-10 sm:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {[
              "Live courses and hotels matched to your group",
              "Group voting without the group-text chaos",
              "One Trip HQ the whole group can see"
            ].map((line) => (
              <div
                key={line}
                className="snap-start shrink-0 w-[78%] rounded-[22px] bg-white/84 px-4 py-4 text-sm text-charcoal/68 ring-1 ring-charcoal/8"
              >
                {line}
              </div>
            ))}
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
            <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-charcoal/68">
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
              <p className="mt-3 text-[15.5px] leading-[1.6] text-charcoal/68">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <DemoLoop />

      {/* Stats bar — TODO: pull live counts from Supabase via daily ISR (export const revalidate = 86400) */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 rounded-[28px] border border-charcoal/8 bg-white/86 p-6 sm:p-8">
          {[
            { value: "18", label: "Trips planned in preview" },
            { value: "24", label: "Group responses collected" },
            { value: "24h", label: "Median group response time" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl font-semibold tracking-[-0.04em] text-gold sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-charcoal/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof — moved above features for conversion lift */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">From the organizers</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-charcoal">
            From the organizers using it
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* CTA after testimonials — peak persuasion moment */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <AuthCta className="inline-flex">See where my group lands →</AuthCta>
          <p className="mt-2 text-sm text-charcoal/55">Free for the organizer · Group members never pay</p>
        </div>
      </section>

      {/* Built-on trust row */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-charcoal/45">
          Built on infrastructure trusted by 100,000+ teams
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/partners/supabase.svg" alt="Supabase" className="h-5" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/partners/vercel.svg" alt="Vercel" className="h-5" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/partners/google-maps-platform.svg" alt="Google Maps Platform" className="h-5" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/partners/resend.svg" alt="Resend" className="h-5" />
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
              <p className="mt-3 text-[15.5px] leading-[1.6] text-charcoal/68">{item.body}</p>
            </Card>
            );
          })}
        </div>
      </section>

      <FounderNote />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {landingPage.faqs.map((item) => (
            <Card key={item.question} className="p-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{item.question}</h3>
              <p className="mt-3 text-[15.5px] leading-[1.6] text-charcoal/68">{item.answer}</p>
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
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
              title: "Best golf trip destinations",
              href: "/best-golf-trip-destinations",
              body: "What each major destination costs and what to know before you plan there."
            },
            {
              title: "Golf trip cost per person",
              href: "/golf-trip-cost-per-person",
              body: "Realistic per-person cost ranges by destination tier — from drive-to to bucket-list."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Collect everyone's real budget range before anyone falls in love with the wrong trip."
            },
            {
              title: "Best golf trip planner apps",
              href: "/best-golf-trip-planner-apps",
              body: "An honest comparison of the tools groups actually use to plan golf trips in 2026."
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
        <div className="mt-6">
          <a href="/how-to-plan-a-golf-trip" className="text-sm font-medium text-forest-900 underline-offset-2 hover:underline">
            See all planning guides →
          </a>
        </div>
      </section>

      {/* Destination strip */}
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-charcoal/45">Built for trips to</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            { label: "Myrtle Beach", href: "/myrtle-beach-golf-trip-planner" },
            { label: "Scottsdale", href: "/scottsdale-golf-trip-planner" },
            { label: "Pinehurst", href: "/pinehurst-golf-trip-planner" },
            { label: "Palm Springs", href: "/palm-springs-golf-trip-planner" },
            { label: "Pebble Beach", href: "/pebble-beach-golf-trip-planner" },
            { label: "Kiawah Island", href: "/kiawah-island-golf-trip-planner" }
          ].map((dest) => (
            <a
              key={dest.label}
              href={dest.href}
              className="rounded-full border border-charcoal/12 bg-white/70 px-4 py-1.5 text-sm text-charcoal/65 transition hover:border-charcoal/20 hover:bg-white hover:text-charcoal/80"
            >
              {dest.label}
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
