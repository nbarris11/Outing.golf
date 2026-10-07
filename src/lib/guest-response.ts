import { z } from "zod";
import type { PreferenceSubmission } from "@/types/domain";

export const guestResponseSchema = z
  .object({
    responseStatus: z.enum(["in", "maybe", "declined"]),
    budgetMin: z.coerce.number().min(0).max(100000),
    budgetMax: z.coerce.number().min(0).max(100000),
    availableDates: z.array(z.string()),
    comments: z.string().max(2000),
    walkingPreference: z.enum(["walking", "riding", "either"]),
    preferredRounds: z.number().int().min(1).max(7).nullable(),
    lodgingPreferences: z.array(z.enum(["hotel", "resort", "house", "mixed"])),
  })
  .refine((v) => v.budgetMax >= v.budgetMin, {
    message: "Your maximum budget must be at least your minimum budget.",
  });

export function responseLabel(
  preference?: Pick<PreferenceSubmission, "responseStatus"> | null,
) {
  return preference?.responseStatus === "in"
    ? "I'm in"
    : preference?.responseStatus === "maybe"
      ? "Maybe"
      : preference?.responseStatus === "declined"
        ? "Can't make it"
        : "RSVP needed";
}
