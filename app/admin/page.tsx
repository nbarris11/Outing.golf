import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  updateAdminSettingAction,
  runLiteApiSandboxTestAction,
  toggleFeatureFlagAction,
  toggleOptionFlagAction,
  updateContentBlockAction
} from "@/lib/actions/admin";
import { requireProfile } from "@/lib/auth";
import { isAdmin } from "@/modules/outings/permissions";
import { getAdminDashboardData } from "@/modules/admin/service";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const data = await getAdminDashboardData();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Admin dashboard</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Simple controls for content, featured options, and launch readiness
          </h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            This admin area is designed to feel more like editing a polished workspace than managing a database.
          </p>
        </div>

        {params.success ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {params.success}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            { label: "Users", value: data.analytics.totalUsers, href: "/admin/users" },
            { label: "Outings", value: data.analytics.totalOutings, href: "/admin/outings" },
            { label: "Pending invites", value: data.analytics.activeInvites, href: "/admin/invites" },
            { label: "Messages", value: data.analytics.totalMessages, href: "/admin/messages" }
          ].map((stat) => (
            <a key={stat.label} href={stat.href} className="block rounded-[28px] bg-white p-6 shadow-[0_4px_20px_rgba(33,36,35,0.06)] ring-1 ring-charcoal/6 transition hover:shadow-[0_8px_30px_rgba(33,36,35,0.10)] hover:ring-charcoal/12">
              <p className="text-sm text-charcoal/50">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{stat.value}</p>
              <p className="mt-2 text-xs text-forest-900">View all →</p>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Quick actions</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  "Refresh homepage copy",
                  "Feature the strongest mock options",
                  "Check QA notes before preview review"
                ].map((item) => (
                  <div key={item} className="rounded-[24px] bg-cream p-4 text-sm leading-6 text-charcoal/68">
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Owner settings</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/62">
                Safe live-site settings live here. API keys and anything sensitive still stay in Vercel or Supabase.
              </p>
              <form action={updateAdminSettingAction} className="mt-5 rounded-[28px] bg-cream p-5">
                <input type="hidden" name="key" value="site_profile" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Business name</FieldLabel>
                    <Input name="legalBusinessName" defaultValue={data.ownerSettings.legalBusinessName} />
                  </div>
                  <div>
                    <FieldLabel>Support email</FieldLabel>
                    <Input name="supportEmail" type="email" defaultValue={data.ownerSettings.supportEmail} />
                  </div>
                  <div>
                    <FieldLabel>Hero badge</FieldLabel>
                    <Input name="heroBadge" defaultValue={data.ownerSettings.heroBadge} />
                  </div>
                  <div>
                    <FieldLabel>Launch status label</FieldLabel>
                    <Input name="launchStatusLabel" defaultValue={data.ownerSettings.launchStatusLabel} />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Footer tagline</FieldLabel>
                    <Textarea
                      name="footerTagline"
                      defaultValue={data.ownerSettings.footerTagline}
                      className="min-h-24"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <SubmitButton label="Save owner settings" pendingLabel="Saving..." />
                </div>
              </form>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Homepage copy and FAQ</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/62">
                Quick headline-level edits. The full landing-page content controls sit in the next card.
              </p>
              <div className="mt-5 space-y-5">
                {data.contentBlocks.map((block) => (
                  <form key={block.key} action={updateContentBlockAction} className="rounded-[28px] bg-cream p-5">
                    <input type="hidden" name="key" value={block.key} />
                    <div className="grid gap-4">
                      <div>
                        <FieldLabel>Block title</FieldLabel>
                        <Input name="title" defaultValue={block.title} />
                      </div>
                      <div>
                        <FieldLabel>Body</FieldLabel>
                        <Textarea name="body" defaultValue={block.body} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <FieldLabel>CTA label</FieldLabel>
                          <Input name="ctaLabel" defaultValue={block.ctaLabel ?? ""} placeholder="Optional" />
                        </div>
                        <div>
                          <FieldLabel>CTA href</FieldLabel>
                          <Input name="ctaHref" defaultValue={block.ctaHref ?? ""} placeholder="/sign-up" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <SubmitButton label="Save block" pendingLabel="Saving..." />
                      </div>
                    </div>
                  </form>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Landing page content</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/62">
                Use this to update the broader marketing copy without touching code.
              </p>
              <form action={updateAdminSettingAction} className="mt-5 space-y-6 rounded-[28px] bg-cream p-5">
                <input type="hidden" name="key" value="landing_page" />

                <div className="grid gap-4">
                  <div>
                    <FieldLabel>Pain points title</FieldLabel>
                    <Input name="painPointsTitle" defaultValue={data.landingPageSettings.painPointsTitle} />
                  </div>
                  <div>
                    <FieldLabel>Pain points body</FieldLabel>
                    <Textarea
                      name="painPointsBody"
                      defaultValue={data.landingPageSettings.painPointsBody}
                      className="min-h-24"
                    />
                  </div>
                  {data.landingPageSettings.painPoints.map((item, index) => (
                    <div key={`pain-point-${index + 1}`}>
                      <FieldLabel>{`Pain point ${index + 1}`}</FieldLabel>
                      <Input name={`painPoint${index + 1}`} defaultValue={item} />
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  <div>
                    <FieldLabel>How it works title</FieldLabel>
                    <Input name="stepsTitle" defaultValue={data.landingPageSettings.stepsTitle} />
                  </div>
                  {data.landingPageSettings.steps.map((step, index) => (
                    <div key={`step-${index + 1}`} className="grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>{`Step ${index + 1} title`}</FieldLabel>
                        <Input name={`step${index + 1}Title`} defaultValue={step.title} />
                      </div>
                      <div>
                        <FieldLabel>{`Step ${index + 1} body`}</FieldLabel>
                        <Textarea
                          name={`step${index + 1}Body`}
                          defaultValue={step.body}
                          className="min-h-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  <div>
                    <FieldLabel>Outcomes title</FieldLabel>
                    <Input name="outcomesTitle" defaultValue={data.landingPageSettings.outcomesTitle} />
                  </div>
                  {data.landingPageSettings.outcomes.map((outcome, index) => (
                    <div key={`outcome-${index + 1}`} className="grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>{`Outcome ${index + 1} title`}</FieldLabel>
                        <Input name={`outcome${index + 1}Title`} defaultValue={outcome.title} />
                      </div>
                      <div>
                        <FieldLabel>{`Outcome ${index + 1} body`}</FieldLabel>
                        <Textarea
                          name={`outcome${index + 1}Body`}
                          defaultValue={outcome.body}
                          className="min-h-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  <div>
                    <FieldLabel>Social proof title</FieldLabel>
                    <Input name="socialProofTitle" defaultValue={data.landingPageSettings.socialProofTitle} />
                  </div>
                  <div>
                    <FieldLabel>Social proof body</FieldLabel>
                    <Textarea
                      name="socialProofBody"
                      defaultValue={data.landingPageSettings.socialProofBody}
                      className="min-h-24"
                    />
                  </div>
                  {data.landingPageSettings.socialProofItems.map((item, index) => (
                    <div key={`social-proof-${index + 1}`}>
                      <FieldLabel>{`Social proof point ${index + 1}`}</FieldLabel>
                      <Input name={`socialProofItem${index + 1}`} defaultValue={item} />
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  {data.landingPageSettings.faqs.map((faq, index) => (
                    <div key={`faq-${index + 1}`} className="grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>{`FAQ ${index + 1} question`}</FieldLabel>
                        <Input name={`faq${index + 1}Question`} defaultValue={faq.question} />
                      </div>
                      <div>
                        <FieldLabel>{`FAQ ${index + 1} answer`}</FieldLabel>
                        <Textarea
                          name={`faq${index + 1}Answer`}
                          defaultValue={faq.answer}
                          className="min-h-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Final CTA eyebrow</FieldLabel>
                    <Input name="finalCtaEyebrow" defaultValue={data.landingPageSettings.finalCtaEyebrow} />
                  </div>
                  <div>
                    <FieldLabel>Final CTA button label</FieldLabel>
                    <Input name="finalCtaLabel" defaultValue={data.landingPageSettings.finalCtaLabel} />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Final CTA title</FieldLabel>
                    <Input name="finalCtaTitle" defaultValue={data.landingPageSettings.finalCtaTitle} />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Final CTA body</FieldLabel>
                    <Textarea
                      name="finalCtaBody"
                      defaultValue={data.landingPageSettings.finalCtaBody}
                      className="min-h-24"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Final CTA href</FieldLabel>
                    <Input name="finalCtaHref" defaultValue={data.landingPageSettings.finalCtaHref} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <SubmitButton label="Save landing page content" pendingLabel="Saving..." />
                </div>
              </form>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Users and outings</h2>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-sm text-charcoal/50">Users</p>
                  <div className="mt-3 space-y-3">
                    {data.users.map((user) => (
                      <div key={user.id} className="rounded-[24px] bg-cream p-4">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-charcoal/60">{user.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-charcoal/50">Outings</p>
                  <div className="mt-3 space-y-3">
                    {data.outings.map((outing) => (
                      <div key={outing.id} className="rounded-[24px] bg-cream p-4">
                        <p className="font-medium">{outing.name}</p>
                        <p className="text-sm text-charcoal/60">{outing.status.replaceAll("_", " ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Lodging integration status</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/62">
                Quick visibility into whether liteAPI is configured and whether sandbox search is healthy.
              </p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/50">Provider</p>
                  <p className="mt-2 font-medium">{data.lodgingIntegration?.provider ?? "unknown"}</p>
                </div>
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/50">Configuration</p>
                  <p className="mt-2 font-medium">
                    {data.lodgingIntegration?.configured ? "liteAPI env vars detected" : "Missing liteAPI env vars"}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/55">
                    {data.lodgingIntegration?.baseUrl || "No base URL configured"}
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/50">Dev fallback</p>
                  <p className="mt-2 font-medium">
                    {data.lodgingIntegration?.devMockFallbackEnabled ? "Enabled for local testing" : "Disabled"}
                  </p>
                </div>
              </div>

              <form action={runLiteApiSandboxTestAction} className="mt-5 rounded-[28px] bg-cream p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>Sandbox destination</FieldLabel>
                    <Input name="destination" defaultValue="Scottsdale, Arizona" />
                  </div>
                  <div>
                    <FieldLabel>Check-in</FieldLabel>
                    <Input name="checkIn" type="date" defaultValue={new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10)} />
                  </div>
                  <div>
                    <FieldLabel>Check-out</FieldLabel>
                    <Input name="checkOut" type="date" defaultValue={new Date(Date.now() + 86400000 * 33).toISOString().slice(0, 10)} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <SubmitButton label="Run sandbox test" pendingLabel="Testing..." />
                </div>
              </form>

              <div className="mt-5 space-y-3">
                <p className="text-sm font-medium text-charcoal">Recent lodging API errors</p>
                {data.lodgingIntegration?.recentErrors?.length ? (
                  data.lodgingIntegration.recentErrors.map((item: { id: string; route: string; error_message: string; created_at: string }) => (
                    <div key={item.id} className="rounded-[24px] bg-red-50 p-4 text-sm text-red-700">
                      <p className="font-medium">{item.route}</p>
                      <p className="mt-1">{item.error_message}</p>
                      <p className="mt-1 text-xs text-red-500">{item.created_at}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-cream p-4 text-sm text-charcoal/60">
                    No recent lodging API errors logged.
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Feature flags</h2>
              <div className="mt-5 space-y-3">
                {data.featureFlags.map((flag) => (
                  <form key={flag.key} action={toggleFeatureFlagAction} className="rounded-[24px] bg-cream p-4">
                    <input type="hidden" name="key" value={flag.key} />
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{flag.label}</p>
                        <p className="text-sm text-charcoal/60">{flag.key}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={flag.enabled ? "bg-emerald-100 text-emerald-700" : ""}>
                          {flag.enabled ? "enabled" : "disabled"}
                        </Badge>
                        <SubmitButton label="Toggle" pendingLabel="Updating..." />
                      </div>
                    </div>
                  </form>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Featured destinations and stays</h2>
              <div className="mt-5 space-y-5">
                {[
                  {
                    title: "Destinations",
                    collection: "destinationOptions" as const,
                    options: data.destinationOptions
                  },
                  {
                    title: "Courses",
                    collection: "golfCourseOptions" as const,
                    options: data.golfCourseOptions
                  },
                  {
                    title: "Lodging",
                    collection: "lodgingOptions" as const,
                    options: data.lodgingOptions
                  }
                ].map((group) => (
                  <div key={group.title}>
                    <p className="text-sm font-semibold text-charcoal">{group.title}</p>
                    <div className="mt-3 space-y-3">
                      {group.options.length === 0 ? (
                        <EmptyState
                          title={`No ${group.title.toLowerCase()} yet`}
                          body="Seed data will show up here once available."
                        />
                      ) : (
                        group.options.map((option) => (
                          <div key={option.id} className="rounded-[24px] bg-cream p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium">{option.name}</p>
                                <p className="mt-1 text-sm text-charcoal/60">{option.summary}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge className={option.featured ? "bg-emerald-100 text-emerald-700" : ""}>
                                  {option.featured ? "featured" : "standard"}
                                </Badge>
                                {option.hidden ? <Badge>hidden</Badge> : null}
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <form action={toggleOptionFlagAction}>
                                <input type="hidden" name="collection" value={group.collection} />
                                <input type="hidden" name="id" value={option.id} />
                                <input type="hidden" name="field" value="featured" />
                                <SubmitButton
                                  label={option.featured ? "Remove feature" : "Mark featured"}
                                  pendingLabel="Saving..."
                                />
                              </form>
                              <form action={toggleOptionFlagAction}>
                                <input type="hidden" name="collection" value={group.collection} />
                                <input type="hidden" name="id" value={option.id} />
                                <input type="hidden" name="field" value="hidden" />
                                <SubmitButton
                                  label={option.hidden ? "Show again" : "Hide"}
                                  pendingLabel="Saving..."
                                />
                              </form>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Audit and moderation hooks</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-charcoal/68">
                <li>Activity log structure is in the schema for later staff review workflows.</li>
                <li>Chat moderation hooks stay represented through feature flags and expandable policies.</li>
                <li>Featured and hidden controls are exposed here so non-technical edits do not require code changes.</li>
                <li>Secret API keys still belong in Vercel or Supabase settings, but text and launch messaging can now be edited here.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
