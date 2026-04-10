import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
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
          <Card>
            <p className="text-sm text-charcoal/50">Users</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{data.analytics.totalUsers}</p>
          </Card>
          <Card>
            <p className="text-sm text-charcoal/50">Outings</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{data.analytics.totalOutings}</p>
          </Card>
          <Card>
            <p className="text-sm text-charcoal/50">Pending invites</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{data.analytics.activeInvites}</p>
          </Card>
          <Card>
            <p className="text-sm text-charcoal/50">Messages</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{data.analytics.totalMessages}</p>
          </Card>
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
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Homepage copy and FAQ</h2>
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
                      <div className="flex justify-end">
                        <SubmitButton label="Save block" pendingLabel="Saving..." />
                      </div>
                    </div>
                  </form>
                ))}
              </div>
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
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
