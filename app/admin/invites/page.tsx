import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { isAdmin } from "@/modules/outings/permissions";
import { getAdminInvites } from "@/modules/admin/service";

export default async function AdminInvitesPage() {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const invites = await getAdminInvites();
  const pending = invites.filter((i) => i.status === "pending");
  const accepted = invites.filter((i) => i.status === "accepted");
  const declined = invites.filter((i) => i.status === "declined");

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-charcoal/55 transition hover:text-charcoal"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Admin dashboard
          </Link>
        </div>

        <div className="mt-6 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Invites
          </h1>
          <p className="mt-3 text-base text-charcoal/68">
            {invites.length} total · {pending.length} pending · {accepted.length} accepted · {declined.length} declined
          </p>
        </div>

        <Card className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/8 text-left text-xs uppercase tracking-[0.15em] text-charcoal/45">
                  <th className="pb-3 pr-6 font-medium">Email</th>
                  <th className="pb-3 pr-6 font-medium">Outing</th>
                  <th className="pb-3 pr-6 font-medium">Status</th>
                  <th className="pb-3 font-medium">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/6">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-cream/50">
                    <td className="py-3.5 pr-6 font-medium text-charcoal">{invite.email}</td>
                    <td className="py-3.5 pr-6">
                      <Link
                        href={`/outings/${invite.outingId}`}
                        className="text-charcoal/68 hover:text-forest-900 hover:underline"
                      >
                        View outing →
                      </Link>
                    </td>
                    <td className="py-3.5 pr-6">
                      <Badge
                        className={
                          invite.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : invite.status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                        }
                      >
                        {invite.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-charcoal/55">
                      {new Date(invite.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
