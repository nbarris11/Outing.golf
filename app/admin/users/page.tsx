import Link from "next/link";
import { redirect } from "next/navigation";

import { RemoveUserButton } from "@/components/admin/remove-user-button";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { setUserRoleAction } from "@/lib/actions/admin";
import { requireProfile } from "@/lib/auth";
import { isAdmin } from "@/modules/outings/permissions";
import { getAdminUsers } from "@/modules/admin/service";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const users = await getAdminUsers();
  const admins = users.filter((u) => u.appRole === "admin");
  const members = users.filter((u) => u.appRole !== "admin");

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
            {users.length} total user{users.length !== 1 ? "s" : ""} · {admins.length} admin{admins.length !== 1 ? "s" : ""}
          </p>
        </div>

        {params.success && (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            ✓ {params.success.replace(/\+/g, " ")}
          </p>
        )}
        {params.error && (
          <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error.replace(/\+/g, " ")}
          </p>
        )}

        {/* Admins */}
        <Card className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">Admins</h2>
            <Badge className="bg-amber-100 text-amber-700">{admins.length}</Badge>
          </div>
          <p className="text-sm text-charcoal/55 mb-5">
            Admins have full access to this dashboard. Use caution when demoting — you cannot demote yourself.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/8 text-left text-xs uppercase tracking-[0.15em] text-charcoal/45">
                  <th className="pb-3 pr-6 font-medium">Name</th>
                  <th className="pb-3 pr-6 font-medium">Email</th>
                  <th className="pb-3 pr-6 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/6">
                {admins.map((user) => {
                  const isSelf = user.id === profile.id;
                  return (
                    <tr key={user.id} className="hover:bg-cream/50">
                      <td className="py-3.5 pr-6 font-medium text-charcoal">
                        {user.fullName}
                        {isSelf && <span className="ml-2 text-xs text-charcoal/40">(you)</span>}
                      </td>
                      <td className="py-3.5 pr-6 text-charcoal/68">{user.email}</td>
                      <td className="py-3.5 pr-6 text-charcoal/55">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3.5">
                        {!isSelf && (
                          <form action={setUserRoleAction} className="inline">
                            <input type="hidden" name="targetId" value={user.id} />
                            <input type="hidden" name="newRole" value="member" />
                            <SubmitButton
                              label="Demote to member"
                              pendingLabel="Saving…"
                              className="rounded-full border border-charcoal/15 bg-white px-3 py-1 text-xs text-charcoal/60 hover:border-amber-300 hover:text-amber-700 transition-colors"
                            />
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Members */}
        <Card className="mt-6">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">Members</h2>
            <Badge className="bg-charcoal/8 text-charcoal/60">{members.length}</Badge>
          </div>
          <p className="text-sm text-charcoal/55 mb-5">
            Promote a member to admin to give them dashboard access. Remove a user to delete their account and all associated data — this cannot be undone.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/8 text-left text-xs uppercase tracking-[0.15em] text-charcoal/45">
                  <th className="pb-3 pr-6 font-medium">Name</th>
                  <th className="pb-3 pr-6 font-medium">Email</th>
                  <th className="pb-3 pr-6 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/6">
                {members.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-charcoal/45">No members yet.</td>
                  </tr>
                )}
                {members.map((user) => (
                  <tr key={user.id} className="hover:bg-cream/50">
                    <td className="py-3.5 pr-6 font-medium text-charcoal">{user.fullName}</td>
                    <td className="py-3.5 pr-6 text-charcoal/68">{user.email}</td>
                    <td className="py-3.5 pr-6 text-charcoal/55">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <form action={setUserRoleAction} className="inline">
                          <input type="hidden" name="targetId" value={user.id} />
                          <input type="hidden" name="newRole" value="admin" />
                          <SubmitButton
                            label="Make admin"
                            pendingLabel="Saving…"
                            className="rounded-full border border-charcoal/15 bg-white px-3 py-1 text-xs text-charcoal/60 hover:border-forest-900/30 hover:text-forest-900 transition-colors"
                          />
                        </form>
                        <RemoveUserButton
                          userId={user.id}
                          userName={user.fullName ?? user.email}
                        />
                      </div>
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
