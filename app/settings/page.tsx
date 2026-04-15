import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateProfileAction, updatePasswordAction } from "@/lib/actions/profile";
import { requireProfile } from "@/lib/auth";
import { adminEmails } from "@/lib/env";
import { isAdmin } from "@/modules/outings/permissions";

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const profile = await requireProfile();
  const { success, error } = await searchParams;

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Account</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Profile settings
          </h1>
        </div>

        {success ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
        ) : null}
        {error ? (
          <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        {/* Profile info form */}
        <Card className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">Your profile</h2>
            <Badge>{profile.appRole}</Badge>
          </div>
          <p className="mt-2 text-sm text-charcoal/55">
            This information follows you into any outing you join.
          </p>
          <form action={updateProfileAction} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={profile.fullName}
                  placeholder="Taylor Brooks"
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="cursor-not-allowed opacity-60"
                />
              </div>
              <div>
                <FieldLabel htmlFor="homeCity">Home city</FieldLabel>
                <Input
                  id="homeCity"
                  name="homeCity"
                  defaultValue={profile.homeCity ?? ""}
                  placeholder="Chicago, IL"
                />
              </div>
              <div>
                <FieldLabel htmlFor="homeAirport">Home airport (IATA code)</FieldLabel>
                <Input
                  id="homeAirport"
                  name="homeAirport"
                  defaultValue={profile.homeAirport ?? ""}
                  placeholder="ORD"
                  maxLength={3}
                />
              </div>
              <div>
                <FieldLabel htmlFor="handicap">Golf handicap</FieldLabel>
                <Input
                  id="handicap"
                  name="handicap"
                  defaultValue={profile.handicap ?? ""}
                  placeholder="e.g. 12.4"
                />
              </div>
            </div>
            <div className="pt-2">
              <SubmitButton label="Save profile" pendingLabel="Saving..." />
            </div>
          </form>
        </Card>

        {/* Change password (only for non-OAuth accounts) */}
        <Card className="mt-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Change password</h2>
          <p className="mt-2 text-sm text-charcoal/55">
            Must be at least 8 characters and include a number and a special character.
          </p>
          <form action={updatePasswordAction} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="password">New password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New password"
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
            <div className="pt-2">
              <SubmitButton label="Update password" pendingLabel="Updating..." />
            </div>
          </form>
        </Card>

        {isAdmin(profile) ? (
          <Card className="mt-6">
            <p className="text-sm uppercase tracking-[0.22em] text-charcoal/45">Admin access</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">You can manage the live site</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/68">
              Use the admin dashboard to update homepage text, FAQ content, the coming-soon gate message, and simple
              launch controls without touching code.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/admin">
                <Button>Open admin dashboard</Button>
              </Link>
              {adminEmails.length > 0 ? (
                <p className="text-sm text-charcoal/55">
                  Admin access is currently locked to the configured owner email list.
                </p>
              ) : (
                <p className="text-sm text-charcoal/55">
                  Right now the first real signed-in account becomes admin automatically.
                </p>
              )}
            </div>
          </Card>
        ) : null}
      </section>
    </PageShell>
  );
}
