"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import { requireProfile } from "@/lib/auth";
import {
  addDemoChatMessage,
  createDemoInvite,
  createDemoOuting,
  upsertDemoPreference
} from "@/lib/demo/store";
import { logError } from "@/lib/logger";

const createOutingSchema = z
  .object({
  name: z.string().min(3),
  destinationType: z.enum(["open", "city", "state", "region"]).default("open"),
  destinationLabel: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || "Flexible location"),
  budgetTarget: z.coerce.number().min(300).max(4000),
  tripVibe: z.enum(["casual", "serious_golf", "mixed"]).default("mixed"),
  tripStyle: z.enum(["value", "classic", "premium", "bucket_list"]).optional(),
  numberOfPlayers: z.coerce.number().min(2).max(24),
  golfIntensity: z.enum(["light", "balanced", "golf_first"]).optional(),
  lodgingPreference: z.enum(["hotel", "resort", "house", "mixed"]).default("mixed"),
  notes: z.string().optional(),
  dateStart: z.string().min(1),
  dateEnd: z.string().min(1),
  organizerWeighting: z.coerce.number().min(1).max(10).default(7),
  initialInviteEmail: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Invite email must be valid"
    })
    .transform((value) => value || undefined)
})
  .refine((data) => data.dateEnd >= data.dateStart, {
    message: "End date must be after start date",
    path: ["dateEnd"]
  });

const inviteSchema = z.object({
  outingId: z.string().min(1),
  email: z.string().email()
});

const chatMessageSchema = z.object({
  outingId: z.string().min(1),
  message: z.string().trim().min(1).max(800)
});

const preferenceSchema = z.object({
  outingId: z.string().min(1),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(0),
  availableDates: z.array(z.string()).min(1),
  destinationVotes: z.array(z.string()).optional().default([]),
  lodgingPreferences: z
    .array(z.enum(["hotel", "resort", "house", "mixed"]))
    .optional()
    .default([]),
  courseQualityPreference: z.coerce.number().min(1).max(10),
  walkingPreference: z.enum(["walking", "riding", "either"]),
  comments: z.string().optional()
});

export async function createOutingAction(formData: FormData) {
  const profile = await requireProfile();
  let destination = "/outings/new";
  const parsed = createOutingSchema.safeParse({
    name: formData.get("name"),
    destinationType: formData.get("destinationType") ?? undefined,
    destinationLabel: formData.get("destinationLabel"),
    budgetTarget: formData.get("budgetTarget"),
    tripVibe: formData.get("tripVibe") ?? undefined,
    tripStyle: formData.get("tripStyle") ?? undefined,
    numberOfPlayers: formData.get("numberOfPlayers"),
    golfIntensity: formData.get("golfIntensity") ?? undefined,
    lodgingPreference: formData.get("lodgingPreference") ?? undefined,
    notes: formData.get("notes") ?? undefined,
    dateStart: formData.get("dateStart"),
    dateEnd: formData.get("dateEnd"),
    organizerWeighting: formData.get("organizerWeighting") ?? undefined,
    initialInviteEmail: formData.get("initialInviteEmail") ?? undefined
  });

  if (!parsed.success) {
    redirect("/outings/new?error=Please%20complete%20all%20required%20fields");
  }

  try {
    const vibeDefaults = {
      casual: {
        tripStyle: "value" as const,
        golfIntensity: "light" as const,
        lodgingPreference: "mixed" as const
      },
      serious_golf: {
        tripStyle: "premium" as const,
        golfIntensity: "golf_first" as const,
        lodgingPreference: "house" as const
      },
      mixed: {
        tripStyle: "classic" as const,
        golfIntensity: "balanced" as const,
        lodgingPreference: "mixed" as const
      }
    }[parsed.data.tripVibe];

    const outing = await createDemoOuting({
      name: parsed.data.name,
      organizerId: profile.id,
      destinationType: parsed.data.destinationType,
      destinationLabel: parsed.data.destinationLabel,
      preferredDateWindows: [
        {
          start: parsed.data.dateStart,
          end: parsed.data.dateEnd
        }
      ],
      budgetTarget: parsed.data.budgetTarget,
      tripStyle: parsed.data.tripStyle ?? vibeDefaults.tripStyle,
      numberOfPlayers: parsed.data.numberOfPlayers,
      golfIntensity: parsed.data.golfIntensity ?? vibeDefaults.golfIntensity,
      lodgingPreference: parsed.data.lodgingPreference ?? vibeDefaults.lodgingPreference,
      notes: parsed.data.notes,
      organizerWeighting: parsed.data.organizerWeighting
    });

    if (parsed.data.initialInviteEmail) {
      await createDemoInvite(outing.id, parsed.data.initialInviteEmail, profile.id);
    }

    destination = `/outings/${outing.id}`;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Failed to create outing", error, { organizerId: profile.id });
    redirect("/outings/new?error=Unable%20to%20create%20outing");
  }

  redirect(destination);
}

export async function inviteMemberAction(formData: FormData) {
  const profile = await requireProfile();
  const parsed = inviteSchema.safeParse({
    outingId: formData.get("outingId"),
    email: String(formData.get("email") ?? "").trim().toLowerCase()
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Enter%20a%20valid%20invite%20email`);
  }

  await createDemoInvite(parsed.data.outingId, parsed.data.email, profile.id);
  redirect(`/outings/${parsed.data.outingId}?success=Invite%20sent`);
}

export async function submitPreferencesAction(formData: FormData) {
  const profile = await requireProfile();
  const parsed = preferenceSchema.safeParse({
    outingId: formData.get("outingId"),
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
    availableDates: String(formData.get("availableDates") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    destinationVotes: String(formData.get("destinationVotes") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    lodgingPreferences: String(formData.get("lodgingPreferences") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    courseQualityPreference: formData.get("courseQualityPreference"),
    walkingPreference: formData.get("walkingPreference"),
    comments: String(formData.get("comments") ?? "")
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Please%20complete%20the%20required%20preference%20fields`);
  }

  await upsertDemoPreference(profile.id, parsed.data.outingId, {
    budgetMin: parsed.data.budgetMin,
    budgetMax: parsed.data.budgetMax,
    availableDates: parsed.data.availableDates,
    destinationVotes: parsed.data.destinationVotes,
    lodgingPreferences: parsed.data.lodgingPreferences,
    courseQualityPreference: parsed.data.courseQualityPreference,
    walkingPreference: parsed.data.walkingPreference,
    comments: parsed.data.comments
  });

  redirect(`/outings/${parsed.data.outingId}?success=Preferences%20saved`);
}

export async function sendChatMessageAction(formData: FormData) {
  const profile = await requireProfile();
  const parsed = chatMessageSchema.safeParse({
    outingId: formData.get("outingId"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Enter%20a%20message%20under%20800%20characters`);
  }

  await addDemoChatMessage(parsed.data.outingId, profile.id, parsed.data.message);
  redirect(`/outings/${parsed.data.outingId}`);
}
