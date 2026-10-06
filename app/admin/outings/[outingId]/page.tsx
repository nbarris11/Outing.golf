import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { currency, formatLongDateLabel } from "@/lib/utils";
import { isAdmin } from "@/modules/outings/permissions";
import { getAdminOutingDetail } from "@/modules/outings/service";

export default async function AdminOutingDetailPage({ params }: { params: Promise<{ outingId: string }> }) {
  const profile = await requireProfile();
  if (!isAdmin(profile)) redirect("/dashboard");

  const { outingId } = await params;
  const detail = await getAdminOutingDetail(outingId);
  if (!detail) notFound();

  const { outing, members, destinations, golfCourses, lodging, invites, messages, profiles } = detail;
  const organizer = profiles.find((person) => person.id === outing.organizerId);

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/admin/outings" className="text-sm text-forest-900 hover:underline">← All trips</Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Admin trip view</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">{outing.name}</h1>
            <p className="mt-3 text-charcoal/65">
              Created by {organizer?.fullName ?? "Unknown user"}{organizer?.email ? ` (${organizer.email})` : ""}
            </p>
          </div>
          <Badge>{outing.status.replaceAll("_", " ")}</Badge>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">Trip details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-charcoal/50">Destination</dt><dd>{outing.destinationLabel ?? "Not chosen"}</dd></div>
              <div><dt className="text-charcoal/50">Players</dt><dd>{outing.numberOfPlayers}</dd></div>
              <div><dt className="text-charcoal/50">Budget target</dt><dd>{outing.budgetTarget ? currency(outing.budgetTarget) : "Not set"}</dd></div>
              <div><dt className="text-charcoal/50">Created</dt><dd>{new Date(outing.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</dd></div>
              <div><dt className="text-charcoal/50">Notes</dt><dd className="whitespace-pre-wrap">{outing.notes || "None"}</dd></div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Dates and activity</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-charcoal/50">Preferred dates</p>
                {outing.preferredDateWindows.length ? (
                  <ul className="mt-1 space-y-1">
                    {outing.preferredDateWindows.map((window, index) => (
                      <li key={index}>{formatLongDateLabel(window.start)} – {formatLongDateLabel(window.end)}</li>
                    ))}
                  </ul>
                ) : <p>Not set</p>}
              </div>
              <p><span className="text-charcoal/50">Members:</span> {members.length}</p>
              <p><span className="text-charcoal/50">Invites:</span> {invites.length}</p>
              <p><span className="text-charcoal/50">Messages:</span> {messages.length}</p>
            </div>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">Members</h2>
            {members.length ? <ul className="mt-4 divide-y divide-charcoal/8 text-sm">{members.map((member) => {
              const person = profiles.find((item) => item.id === member.profileId);
              return <li key={member.id} className="py-2"><span className="font-medium">{person?.fullName ?? "Unknown user"}</span><span className="ml-2 text-charcoal/50">{member.role}</span><span className="block text-charcoal/60">{person?.email}</span></li>;
            })}</ul> : <p className="mt-4 text-sm text-charcoal/60">No members yet.</p>}
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Trip options</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div><h3 className="font-medium">Destinations ({destinations.length})</h3><p className="text-charcoal/65">{destinations.map((item) => item.name).join(", ") || "None"}</p></div>
              <div><h3 className="font-medium">Golf courses ({golfCourses.length})</h3><p className="text-charcoal/65">{golfCourses.map((item) => item.name).join(", ") || "None"}</p></div>
              <div><h3 className="font-medium">Lodging ({lodging.length})</h3><p className="text-charcoal/65">{lodging.map((item) => item.name).join(", ") || "None"}</p></div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
