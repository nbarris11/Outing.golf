import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { isAdmin } from "@/modules/outings/permissions";
import { getAdminUsers } from "@/modules/admin/service";

export default async function AdminUsersPage() {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const users = await getAdminUsers();

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
            Users
          </h1>
          <p className="mt-3 text-base text-charcoal/68">
            {users.length} total user{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        <Card className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/8 text-left text-xs uppercase tracking-[0.15em] text-charcoal/45">
                  <th className="pb-3 pr-6 font-medium">Name</th>
                  <th className="pb-3 pr-6 font-medium">Email</th>
                  <th className="pb-3 pr-6 font-medium">Role</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/6">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-cream/50">
                    <td className="py-3.5 pr-6 font-medium text-charcoal">{user.fullName}</td>
                    <td className="py-3.5 pr-6 text-charcoal/68">{user.email}</td>
                    <td className="py-3.5 pr-6">
                      <Badge className={user.appRole === "admin" ? "bg-amber-100 text-amber-700" : ""}>
                        {user.appRole}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-charcoal/55">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
