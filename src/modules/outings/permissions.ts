import type { Outing, OutingMember, Profile } from "@/types/domain";

export function canAccessOuting(profileId: string, members: OutingMember[], outingId: string) {
  return members.some((member) => member.outingId === outingId && member.profileId === profileId);
}

export function canManageOuting(
  outing: Outing,
  profile: Profile | null,
  members?: OutingMember[]
) {
  if (!profile) return false;
  if (outing.organizerId === profile.id) return true;
  // Co-organizers have the same management rights as the organizer
  if (members) {
    return members.some(
      (m) => m.profileId === profile.id && m.role === "co_organizer"
    );
  }
  return false;
}

export function isAdmin(profile: Profile | null) {
  return profile?.appRole === "admin";
}
