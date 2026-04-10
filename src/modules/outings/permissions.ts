import type { Outing, OutingMember, Profile } from "@/types/domain";

export function canAccessOuting(profileId: string, members: OutingMember[], outingId: string) {
  return members.some((member) => member.outingId === outingId && member.profileId === profileId);
}

export function canManageOuting(outing: Outing, profile: Profile | null) {
  return Boolean(profile && outing.organizerId === profile.id);
}

export function isAdmin(profile: Profile | null) {
  return profile?.appRole === "admin";
}
