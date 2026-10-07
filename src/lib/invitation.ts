import "server-only";
import { isDemoMode } from "@/lib/env";
import { getDemoState } from "@/lib/demo/store";
import { resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  mapOutingRow,
  mapGolfRow,
  mapLodgingRow,
} from "@/modules/outings/service";

/** Only call with an invitation token. Never expose member emails or private notes. */
export async function getInvitation(token: string, kind: "join" | "invite") {
  const admin = isDemoMode ? null : createSupabaseAdminClient();
  const demo = isDemoMode ? await getDemoState() : null;
  const invite =
    kind === "invite"
      ? demo
        ? demo.invites.find((i) => i.token === token)
        : (
            await admin
              ?.from("invites")
              .select("outing_id,email,status")
              .eq("token", token)
              .maybeSingle()
          )?.data
      : null;
  if (kind === "invite" && (!invite || invite.status === "declined"))
    return null;
  const outingId =
    kind === "join"
      ? await resolveOutingIdFromShareToken(token)
      : invite && ("outingId" in invite ? invite.outingId : invite.outing_id);
  if (!outingId) return null;
  if (demo) {
    const outing = demo.outings.find((o) => o.id === outingId);
    if (!outing) return null;
    return {
      outing,
      courses: demo.golfCourseOptions.filter(
        (c) => c.outingId === outingId && c.featured && !c.hidden,
      ),
      lodging:
        demo.lodgingOptions.find(
          (l) => l.outingId === outingId && l.featured && !l.hidden,
        ) ?? null,
      organizerName:
        demo.profiles.find((p) => p.id === outing.organizerId)?.fullName ??
        "Your organizer",
      joined: demo.outingMembers.filter((m) => m.outingId === outingId).length,
      inviteEmail: invite?.email ?? null,
    };
  }
  if (!admin) return null;
  const { data: row, error } = await admin
    .from("outings")
    .select("*")
    .eq("id", outingId)
    .maybeSingle();
  if (!row || error) return null;
  const outing = mapOutingRow(row);
  const [courses, lodging, host, members] = await Promise.all([
    admin
      .from("golf_course_options")
      .select("*")
      .eq("outing_id", outingId)
      .eq("featured", true)
      .eq("hidden", false),
    admin
      .from("lodging_options")
      .select("*")
      .eq("outing_id", outingId)
      .eq("featured", true)
      .eq("hidden", false)
      .limit(1),
    admin
      .from("profiles")
      .select("full_name")
      .eq("id", outing.organizerId)
      .maybeSingle(),
    admin
      .from("outing_members")
      .select("id", { count: "exact", head: true })
      .eq("outing_id", outingId),
  ]);
  return {
    outing,
    courses: (courses.data ?? []).map(mapGolfRow),
    lodging: lodging.data?.[0] ? mapLodgingRow(lodging.data[0]) : null,
    organizerName: host.data?.full_name ?? "Your organizer",
    joined: members.count ?? 0,
    inviteEmail: invite?.email ?? null,
  };
}

export async function invitationAuthContext(next: string) {
  const match = /^\/(join|invite)\/([^/?#]+)$/.exec(next);
  if (!match) return null;
  const invitation = await getInvitation(
    match[2],
    match[1] as "join" | "invite",
  );
  return invitation
    ? { name: invitation.outing.name, email: invitation.inviteEmail }
    : null;
}
