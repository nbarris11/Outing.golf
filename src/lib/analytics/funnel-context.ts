import { adminEmails, isDemoMode } from "@/lib/env";
import { isInternalProfile, type FunnelContext } from "@/lib/analytics/funnel";

type AnalyticsProfile = { id: string; email: string; appRole?: string };

// Server-only callers pass just this result to the browser, never the email list.
export function getFunnelContext(outingId: string, organizer: AnalyticsProfile | undefined, actor: AnalyticsProfile | null): FunnelContext {
  const internalEmails = [...adminEmails, ...(process.env.ANALYTICS_INTERNAL_EMAILS ?? "")
    .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean)];
  return {
    outingId,
    actorId: actor?.id,
    actorRole: actor?.id === organizer?.id ? "organizer" : actor ? "participant" : "visitor",
    excluded: isDemoMode || !organizer || isInternalProfile(organizer, internalEmails) || isInternalProfile(actor, internalEmails)
  };
}
