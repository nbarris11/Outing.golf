import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, ServerCog, TestTube2, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  appEnvironment,
  deploymentUrl,
  environmentLabel,
  isDemoMode,
  isPreviewEnvironment,
  isProductionEnvironment,
  isSupabaseConfigured,
  productionAppUrl
} from "@/lib/env";

const smokeChecks = [
  {
    href: "/",
    label: "Landing page",
    description: "Confirm the value prop is obvious, the hero loads cleanly, and the main CTA is visible immediately."
  },
  {
    href: "/sign-up",
    label: "Auth flow",
    description: "Create or sign into an account and make sure the app moves into the product without confusion."
  },
  {
    href: "/dashboard",
    label: "Organizer dashboard",
    description: "Check the top recommendation summary, member progress, and clear next action."
  },
  {
    href: "/outings/new",
    label: "Create outing",
    description: "Make sure the three-step flow feels fast enough to finish in under a minute."
  },
  {
    href: "/admin",
    label: "Admin screen",
    description: "Verify content editing and feature controls still feel simple for a non-technical owner."
  },
  {
    href: "/api/health",
    label: "Health endpoint",
    description: "Confirm the app reports the current environment, mode, and provider configuration."
  }
];

const releaseChecks = [
  "Preview env vars point at the QA Supabase project, not production.",
  "Demo mode is turned off for shared QA unless you intentionally want a mock-only review.",
  "Landing, create outing, compare, and admin flows all work on mobile width.",
  "Provider adapters are still set to the intended QA-safe sources.",
  "Legal content and support links are acceptable for the audience seeing this build."
];

export default function QAPage() {
  const providerSummary = [
    `Destination: ${process.env.OUTING_DESTINATION_PROVIDER ?? "mock"}`,
    `Golf courses: ${process.env.OUTING_GOLF_COURSE_PROVIDER ?? "mock"}`,
    `Lodging: ${process.env.OUTING_LODGING_PROVIDER ?? "mock"}`,
    `Tee times: ${process.env.OUTING_TEE_TIME_PROVIDER ?? "mock"}`,
    `Vacation rentals: ${process.env.OUTING_VACATION_RENTAL_PROVIDER ?? "mock"}`
  ];

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Badge className="bg-white/80">{environmentLabel}</Badge>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em] text-charcoal sm:text-5xl">
            QA and Preview Screen
          </h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68 sm:text-lg">
            This is the quick confidence page for shared previews. It gives anyone reviewing the build one
            place to confirm the environment, test the main flows, and see what is safe to ship next.
          </p>
        </div>

        <Card className="mt-8 overflow-hidden p-0">
          <div className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] px-6 py-6 text-cream sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.25em] text-cream/58">Current deployment</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                  {isProductionEnvironment
                    ? "Production is live"
                    : isPreviewEnvironment
                      ? "Preview is ready for QA"
                      : "Local build is ready for review"}
                </h2>
                <p className="mt-4 text-base leading-7 text-cream/76">
                  {isProductionEnvironment
                    ? "Use this screen to confirm production-safe settings and quickly inspect the most important product flows."
                    : "Use this screen before sharing the build so QA can move from landing page to dashboard without guessing where to start."}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/8 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cream/55">Primary URL</p>
                <a
                  href={deploymentUrl}
                  className="mt-2 block text-lg font-semibold text-cream underline decoration-white/20 underline-offset-4"
                >
                  {deploymentUrl.replace(/^https?:\/\//, "")}
                </a>
                <p className="mt-2 text-sm text-cream/68">
                  {isProductionEnvironment ? "Live customer-facing deployment" : "Best link to share with QA"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 xl:px-8">
            <div className="rounded-[24px] bg-cream p-5">
              <p className="text-sm text-charcoal/48">Environment</p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">{environmentLabel}</p>
              <p className="mt-2 text-sm text-charcoal/60">Detected from Vercel and app env settings.</p>
            </div>
            <div className="rounded-[24px] bg-cream p-5">
              <p className="text-sm text-charcoal/48">Data mode</p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">
                {isDemoMode ? "Demo mode" : "Supabase mode"}
              </p>
              <p className="mt-2 text-sm text-charcoal/60">
                {isDemoMode
                  ? "Safe for quick UI checks with seeded demo data."
                  : "Using environment-backed auth and database settings."}
              </p>
            </div>
            <div className="rounded-[24px] bg-cream p-5">
              <p className="text-sm text-charcoal/48">Supabase config</p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">
                {isSupabaseConfigured ? "Connected" : "Not connected"}
              </p>
              <p className="mt-2 text-sm text-charcoal/60">Only public-safe status is shown here.</p>
            </div>
            <div className="rounded-[24px] bg-cream p-5">
              <p className="text-sm text-charcoal/48">Production URL</p>
              <a
                href={productionAppUrl}
                className="mt-2 block text-base font-semibold tracking-[-0.03em] text-charcoal underline decoration-charcoal/15 underline-offset-4"
              >
                {productionAppUrl.replace(/^https?:\/\//, "")}
              </a>
              <p className="mt-2 text-sm text-charcoal/60">Useful when comparing preview and live behavior.</p>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center gap-3">
              <TestTube2 className="h-5 w-5 text-forest-900" />
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Smoke test this build</h2>
                <p className="mt-1 text-sm text-charcoal/66">
                  Open the core routes in order and make sure the product still feels effortless.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {smokeChecks.map((check, index) => (
                <div
                  key={check.href}
                  className="flex flex-col gap-4 rounded-[24px] border border-charcoal/8 bg-cream/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {index + 1}. {check.label}
                    </p>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-charcoal/64">{check.description}</p>
                  </div>
                  <a href={check.href} className="sm:self-center">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3">
                <ServerCog className="h-5 w-5 text-forest-900" />
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em]">Current setup</h2>
                  <p className="mt-1 text-sm text-charcoal/66">
                    Enough deployment context to spot mistakes quickly without exposing secrets.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-charcoal/72">
                <div className="rounded-[22px] bg-cream p-4">
                  <p className="font-medium text-charcoal">App environment</p>
                  <p className="mt-1">{appEnvironment}</p>
                </div>
                <div className="rounded-[22px] bg-cream p-4">
                  <p className="font-medium text-charcoal">Inventory providers</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {providerSummary.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
                {isDemoMode ? (
                  <div className="rounded-[22px] bg-cream p-4">
                    <p className="font-medium text-charcoal">Demo accounts</p>
                    <p className="mt-1">host@outing.golf, friend@outing.golf, admin@outing.golf</p>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-forest-900" />
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em]">Ready to share?</h2>
                  <p className="mt-1 text-sm text-charcoal/66">
                    A short release checklist so preview reviews stay consistent.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {releaseChecks.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] bg-cream p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-900" />
                    <p className="text-sm leading-6 text-charcoal/72">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto">Open dashboard</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Review product flow
                  </Button>
                </Link>
                <Link href="/api/health">
                  <Button variant="ghost" className="w-full sm:w-auto">
                    Health JSON
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
