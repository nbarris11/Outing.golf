import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";

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
      </section>
    </PageShell>
  );
}
