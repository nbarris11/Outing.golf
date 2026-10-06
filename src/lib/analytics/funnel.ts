export type FunnelEvent = "outing_created" | "outing_share_action" | "outing_invite_opened" | "outing_joined" | "outing_preferences_submitted";

export interface FunnelContext {
  outingId: string;
  actorId?: string;
  actorRole: "organizer" | "participant" | "visitor";
  excluded: boolean;
}

export interface FunnelProperties {
  method?: "copy_link" | "copy_message" | "native_share" | "sms_opened" | "email_opened";
  placement?: "organizer_banner" | "group_card" | "share_link" | "email_invite" | "outing_page";
}

// Classification only, never an authorization rule. Do not exclude people merely
// because their name contains "test". Extra internal addresses stay server-side.
export function isInternalProfile(
  profile: { email: string; appRole?: string } | null | undefined,
  internalEmails: string[] = []
) {
  if (!profile) return false;
  const email = profile.email.trim().toLowerCase();
  const domain = email.split("@")[1] ?? "";
  return profile.appRole === "admin" || internalEmails.includes(email) ||
    ["example.com", "example.org", "example.net"].includes(domain) ||
    domain.endsWith(".test") || domain.endsWith(".invalid");
}

// Success query parameters are only hints: a corresponding persisted record and
// recent timestamp are required. Old bookmarks must not look like new activity.
export function getSuccessMilestones(input: {
  isPrimaryOrganizer: boolean;
  createdAt: string;
  joinedAt?: string;
  preferenceUpdatedAt?: string;
  notices: { created?: string; newMember?: string; confirmed?: string; success?: string; error?: string };
}, now = Date.now()): FunnelEvent[] {
  if (input.notices.error) return [];
  const recent = (value?: string) => {
    const age = now - Date.parse(value ?? "");
    return age >= 0 && age < 15 * 60 * 1000;
  };
  const events: FunnelEvent[] = [];
  if (input.isPrimaryOrganizer && input.notices.created === "1" && recent(input.createdAt)) {
    events.push("outing_created");
  }
  if (!input.isPrimaryOrganizer && recent(input.joinedAt) &&
      (input.notices.newMember === "1" || input.notices.success === "You joined the outing")) {
    events.push("outing_joined");
  }
  if (!input.isPrimaryOrganizer && input.joinedAt && recent(input.preferenceUpdatedAt) &&
      (input.notices.confirmed === "1" || input.notices.success === "Preferences saved")) {
    events.push("outing_preferences_submitted");
  }
  return events;
}
