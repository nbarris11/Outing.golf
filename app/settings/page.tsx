import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { adminEmails } from "@/lib/env";
import { isAdmin } from "@/modules/outings/permissions";

export default async function SettingsPage() {
  const profile = await requireProfile();

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Account</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.05em]">
            Profile settings
          </h1>
        </div>
        <Card className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">{profile.fullName}</h2>
            <Badge>{profile.appRole}</Badge>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-cream p-4">
              <p className="text-sm text-charcoal/50">Email</p>
              <p className="mt-2 font-medium">{profile.email}</p>
            </div>
            <div className="rounded-[24px] bg-cream p-4">
              <p className="text-sm text-charcoal/50">Home airport</p>
              <p className="mt-2 font-medium">{profile.homeAirport ?? "Add later"}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-charcoal/65">
            This settings surface is intentionally small in MVP. It’s ready for profile edits, notification preferences,
            and connected-account management once Supabase-backed profile writes are enabled.
          </p>
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
