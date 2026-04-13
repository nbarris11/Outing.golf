"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import { requireProfile } from "@/lib/auth";
import {
  addDemoChatMessage,
  createDemoInvite,
  createDemoOuting,
  joinDemoOuting,
  resendDemoInvite,
  upsertDemoPreference
} from "@/lib/demo/store";
import { isDemoMode, publicAppUrl } from "@/lib/env";
import { isInviteEmailConfigured, sendInviteEmail } from "@/lib/email/invite-email";
import { logError } from "@/lib/logger";
import { getOutingShareLink, resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageOuting, isAdmin } from "@/modules/outings/permissions";
import { fetchOutingInventory } from "@/modules/providers/inventory-service";
import type { ChatMessage, Outing } from "@/types/domain";

const createOutingSchema = z
  .object({
  name: z.string().min(3),
  destinationType: z.enum(["open", "city", "state", "region", "international"]).default("open"),
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
  // Single window (legacy / fallback)
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  // Multi-window support: dateStart_0 / dateEnd_0, dateStart_1 / dateEnd_1, …
  dateWindowCount: z.coerce.number().min(1).max(4).optional(),
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
  ;

const inviteSchema = z.object({
  outingId: z.string().min(1),
  emails: z.string().trim().min(1)
});

const resendInviteSchema = z.object({
  outingId: z.string().min(1),
  inviteId: z.string().min(1)
});

const acceptInviteSchema = z.object({
  token: z.string().min(1)
});

const chatMessageSchema = z.object({
  outingId: z.string().min(1),
  message: z.string().trim().min(1).max(800)
});

export type SendChatMessageInlineState =
  | {
      status: "idle";
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "success";
      message: ChatMessage;
    };

const preferenceSchema = z.object({
  outingId: z.string().min(1),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(0),
  availableDates: z.array(z.string()).min(0),
  destinationVotes: z.array(z.string()).optional().default([]),
  lodgingPreferences: z
    .array(z.enum(["hotel", "resort", "house", "mixed"]))
    .optional()
    .default([]),
  courseQualityPreference: z.coerce.number().min(1).max(10),
  walkingPreference: z.enum(["walking", "riding", "either"]),
  comments: z.string().optional(),
  preferredRounds: z.coerce.number().int().min(1).max(7).optional(),
  homeCity: z.string().optional()
}).refine((value) => value.budgetMax >= value.budgetMin, {
  message: "Budget max must be greater than or equal to budget min",
  path: ["budgetMax"]
});

function buildBudgetRange(target: number) {
  return {
    budgetMin: Math.max(300, target - 200),
    budgetMax: Math.min(4000, target + 200)
  };
}

function buildOrganizerPreferenceSeed(
  input: z.infer<typeof createOutingSchema>,
  dateWindows?: { start: string; end: string }[]
) {
  const budgetRange = buildBudgetRange(input.budgetTarget);

  // Collect all date strings from the multi-window picker, falling back to legacy single pair
  const availableDates: string[] = dateWindows
    ? dateWindows.flatMap((w) => [w.start, w.end]).filter(Boolean)
    : [input.dateStart, input.dateEnd].filter((d): d is string => Boolean(d));

  return {
    budgetMin: budgetRange.budgetMin,
    budgetMax: budgetRange.budgetMax,
    availableDates,
    destinationVotes: [],
    lodgingPreferences: input.lodgingPreference === "mixed" ? [] : [input.lodgingPreference],
    courseQualityPreference:
      input.tripVibe === "serious_golf" ? 9 : input.tripVibe === "casual" ? 6 : 7,
    walkingPreference: "either" as const,
    comments: input.notes || undefined
  };
}

function buildInviteLink(token: string) {
  return `${publicAppUrl}/invite/${token}`;
}

function parseInviteEmails(raw: string) {
  const emails = raw
    .split(/[\n,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const deduped = Array.from(new Set(emails));
  const invalid = deduped.filter((email) => !z.string().email().safeParse(email).success);

  return {
    emails: deduped.filter((email) => !invalid.includes(email)),
    invalid
  };
}

function buildOutingRedirect(
  outingId: string,
  options?: {
    success?: string;
    created?: boolean;
    inviteEmail?: string;
    inviteLink?: string;
    shareLink?: string;
  }
) {
  const params = new URLSearchParams();

  if (options?.success) {
    params.set("success", options.success);
  }

  if (options?.created) {
    params.set("created", "1");
  }

  if (options?.inviteEmail) {
    params.set("inviteEmail", options.inviteEmail);
  }

  if (options?.inviteLink) {
    params.set("inviteLink", options.inviteLink);
  }

  if (options?.shareLink) {
    params.set("shareLink", options.shareLink);
  }

  const query = params.toString();
  return query ? `/outings/${outingId}?${query}` : `/outings/${outingId}`;
}

function parseDateWindows(
  formData: FormData,
  parsed: z.infer<typeof createOutingSchema>
): { start: string; end: string }[] {
  const count = Math.min(parsed.dateWindowCount ?? 1, 4);
  const windows: { start: string; end: string }[] = [];

  const MAX_TRIP_NIGHTS = 14;

  for (let i = 0; i < count; i++) {
    const start = String(formData.get(`dateStart_${i}`) ?? "").trim();
    let end = String(formData.get(`dateEnd_${i}`) ?? "").trim();
    if (start && end) {
      // Cap trips at MAX_TRIP_NIGHTS so a typo can't produce e.g. 61-night windows
      const nights = Math.round(
        (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (nights > MAX_TRIP_NIGHTS) {
        end = new Date(new Date(start).getTime() + MAX_TRIP_NIGHTS * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
      }
      windows.push({ start, end });
    }
  }

  // Fall back to legacy single-window fields
  if (windows.length === 0 && parsed.dateStart && parsed.dateEnd) {
    windows.push({ start: parsed.dateStart, end: parsed.dateEnd });
  }

  // Absolute fallback so the outing always has at least one window
  if (windows.length === 0) {
    windows.push({ start: new Date().toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) });
  }

  return windows;
}

function buildOutingRecord(input: z.infer<typeof createOutingSchema>, organizerId: string, dateWindows?: { start: string; end: string }[]): Omit<Outing, "createdAt"> {
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
  }[input.tripVibe];

  return {
    id: randomUUID(),
    name: input.name,
    organizerId,
    destinationType: input.destinationType,
    destinationLabel: input.destinationLabel,
    preferredDateWindows: dateWindows ?? (input.dateStart && input.dateEnd
      ? [{ start: input.dateStart, end: input.dateEnd }]
      : [{ start: new Date().toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) }]),
    budgetTarget: input.budgetTarget,
    tripStyle: input.tripStyle ?? vibeDefaults.tripStyle,
    numberOfPlayers: input.numberOfPlayers,
    golfIntensity: input.golfIntensity ?? vibeDefaults.golfIntensity,
    lodgingPreference: input.lodgingPreference ?? vibeDefaults.lodgingPreference,
    notes: input.notes,
    status: "planning",
    organizerWeighting: input.organizerWeighting,
    votingOpen: false
  };
}

async function seedLiveInventory(outing: Outing) {
  // Use admin client — the inventory tables only have SELECT policies, so inserts
  // from a regular session client are blocked by RLS and silently return nothing.
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  if (!supabase) {
    return;
  }

  try {
    const inventory = await fetchOutingInventory(outing);
    const destinationIdMap = new Map<string, string>();
    const destinationRows = inventory.destinations.map((destination) => {
      const id = randomUUID();
      destinationIdMap.set(destination.id, id);

      return {
        id,
        outing_id: outing.id,
        provider_key: destination.providerKey,
        name: destination.name,
        region: destination.region,
        drive_hours: destination.driveHours ?? null,
        flight_hours: destination.flightHours ?? null,
        average_nightly_rate: destination.averageNightlyRate,
        average_round_cost: destination.averageRoundCost,
        tags: destination.tags,
        summary: destination.summary,
        featured: destination.featured,
        hidden: destination.hidden
      };
    });

    const golfRows = inventory.golfCourses
      .map((course) => {
        const destinationOptionId = destinationIdMap.get(course.destinationOptionId);

        if (!destinationOptionId) {
          return null;
        }

        return {
          id: randomUUID(),
          outing_id: outing.id,
          destination_option_id: destinationOptionId,
          provider_key: course.providerKey,
          name: course.name,
          location_label: course.locationLabel,
          average_greens_fee: course.averageGreensFee,
          quality_score: course.qualityScore,
          ride_friendly: course.rideFriendly,
          walking_friendly: course.walkingFriendly,
          summary: course.summary,
          tags: course.tags,
          featured: course.featured,
          hidden: course.hidden
        };
      })
      .filter(Boolean);

    const lodgingRows = inventory.lodging
      .map((stay) => {
        const destinationOptionId = destinationIdMap.get(stay.destinationOptionId);

        if (!destinationOptionId) {
          return null;
        }

        return {
          id: randomUUID(),
          outing_id: outing.id,
          destination_option_id: destinationOptionId,
          provider_key: stay.providerKey,
          name: stay.name,
          nightly_rate: stay.nightlyRate,
          lodging_type: stay.lodgingType,
          sleeps: stay.sleeps,
          summary: stay.summary,
          tags: stay.tags,
          featured: stay.featured,
          hidden: stay.hidden
        };
      })
      .filter(Boolean);

    if (destinationRows.length) {
      await supabase.from("destination_options").insert(destinationRows);
    }

    if (golfRows.length) {
      await supabase.from("golf_course_options").insert(golfRows);
    }

    if (lodgingRows.length) {
      await supabase.from("lodging_options").insert(lodgingRows);
    }
  } catch (error) {
    logError("Failed to seed live outing inventory", error, { outingId: outing.id });
  }
}

async function createLiveInvite(input: {
  outingId: string;
  email: string;
  invitedBy: string;
  outingName: string;
  organizerName: string;
}) {
  const adminClient = createSupabaseAdminClient();
  const supabase = adminClient ?? (await createSupabaseServerClient());

  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const token = randomUUID();
  const invitePayload = {
    outing_id: input.outingId,
    email: input.email,
    invited_by: input.invitedBy,
    status: "pending" as const,
    token
  };

  const { error: insertError } = await supabase.from("invites").insert(invitePayload);

  if (insertError) {
    throw insertError;
  }

  if (!isInviteEmailConfigured()) {
    return { token, emailStatus: "not_configured" as const };
  }

  try {
    await sendInviteEmail({
      inviteeEmail: input.email,
      outingName: input.outingName,
      organizerName: input.organizerName,
      inviteLink: `/invite/${token}`
    });

    return { token, emailStatus: "sent" as const };
  } catch (error) {
    logError("Invite email delivery failed", error, {
      outingId: input.outingId,
      inviteeEmail: input.email
    });

    return { token, emailStatus: "failed" as const };
  }
}

async function resendLiveInvite(input: {
  outingId: string;
  inviteId: string;
  invitedBy: string;
  organizerName: string;
}) {
  const adminClient = createSupabaseAdminClient();
  const supabase = adminClient ?? (await createSupabaseServerClient());

  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data: inviteRow } = await supabase
    .from("invites")
    .select("id,outing_id,email,status")
    .eq("id", input.inviteId)
    .eq("outing_id", input.outingId)
    .maybeSingle();

  if (!inviteRow) {
    throw new Error("Invite not found");
  }

  if (inviteRow.status === "accepted") {
    throw new Error("This invite has already been accepted");
  }

  const { data: outingRow } = await supabase
    .from("outings")
    .select("name")
    .eq("id", input.outingId)
    .maybeSingle();

  if (!outingRow) {
    throw new Error("Outing not found");
  }

  const token = randomUUID();
  const { error: updateError } = await supabase
    .from("invites")
    .update({
      token,
      invited_by: input.invitedBy,
      status: "pending"
    })
    .eq("id", input.inviteId);

  if (updateError) {
    throw updateError;
  }

  if (!isInviteEmailConfigured()) {
    return {
      email: inviteRow.email,
      token,
      emailStatus: "not_configured" as const
    };
  }

  try {
    await sendInviteEmail({
      inviteeEmail: inviteRow.email,
      outingName: outingRow.name,
      organizerName: input.organizerName,
      inviteLink: `/invite/${token}`
    });

    return {
      email: inviteRow.email,
      token,
      emailStatus: "sent" as const
    };
  } catch (error) {
    logError("Invite resend email delivery failed", error, {
      outingId: input.outingId,
      inviteeEmail: inviteRow.email
    });

    return {
      email: inviteRow.email,
      token,
      emailStatus: "failed" as const
    };
  }
}

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
    dateStart: formData.get("dateStart") ?? undefined,
    dateEnd: formData.get("dateEnd") ?? undefined,
    dateWindowCount: formData.get("dateWindowCount") ?? undefined,
    organizerWeighting: formData.get("organizerWeighting") ?? undefined,
    initialInviteEmail: formData.get("initialInviteEmail") ?? undefined
  });

  if (!parsed.success) {
    redirect("/outings/new?error=Please%20complete%20all%20required%20fields");
  }

  const dateWindows = parseDateWindows(formData, parsed.data);

  try {
    if (isDemoMode) {
      const outingDraft = buildOutingRecord(parsed.data, profile.id, dateWindows);
      const outing = await createDemoOuting({
        name: outingDraft.name,
        organizerId: outingDraft.organizerId,
        destinationType: outingDraft.destinationType,
        destinationLabel: outingDraft.destinationLabel,
        preferredDateWindows: outingDraft.preferredDateWindows,
        budgetTarget: outingDraft.budgetTarget,
        tripStyle: outingDraft.tripStyle,
        numberOfPlayers: outingDraft.numberOfPlayers,
        golfIntensity: outingDraft.golfIntensity,
        lodgingPreference: outingDraft.lodgingPreference,
        notes: outingDraft.notes,
        organizerWeighting: outingDraft.organizerWeighting,
        votingOpen: false
      });

      await upsertDemoPreference(profile.id, outing.id, buildOrganizerPreferenceSeed(parsed.data, dateWindows));
      const shareLink = await getOutingShareLink(outing.id, profile.id);

      if (parsed.data.initialInviteEmail) {
        const invite = await createDemoInvite(outing.id, parsed.data.initialInviteEmail, profile.id);
        destination = buildOutingRedirect(outing.id, {
          success: "Outing created and first invite is ready",
          created: true,
          inviteEmail: parsed.data.initialInviteEmail,
          inviteLink: buildInviteLink(invite.token),
          shareLink: shareLink ?? undefined
        });
      } else {
        destination = buildOutingRedirect(outing.id, {
          success: "Outing created",
          created: true,
          shareLink: shareLink ?? undefined
        });
      }
    } else {
      const adminClient = createSupabaseAdminClient();

      if (!adminClient) {
        redirect("/outings/new?error=Supabase%20not%20configured");
      }

      const outing = buildOutingRecord(parsed.data, profile.id, dateWindows);
      const { error: outingError } = await adminClient!.from("outings").insert({
        id: outing.id,
        organizer_id: outing.organizerId,
        name: outing.name,
        destination_type: outing.destinationType,
        destination_label: outing.destinationLabel,
        preferred_date_windows: outing.preferredDateWindows,
        budget_target: outing.budgetTarget,
        trip_style: outing.tripStyle,
        number_of_players: outing.numberOfPlayers,
        golf_intensity: outing.golfIntensity,
        lodging_preference: outing.lodgingPreference,
        notes: outing.notes ?? null,
        organizer_weighting: outing.organizerWeighting
      });

      if (outingError) {
        throw outingError;
      }

      const { error: memberError } = await adminClient!.from("outing_members").insert({
        id: randomUUID(),
        outing_id: outing.id,
        profile_id: profile.id,
        role: "organizer"
      });

      if (memberError) {
        await adminClient!.from("outings").delete().eq("id", outing.id);
        throw memberError;
      }

      const organizerPreference = buildOrganizerPreferenceSeed(parsed.data, dateWindows);
      const { error: organizerPreferenceError } = await adminClient!.from("preference_submissions").upsert(
        {
          id: randomUUID(),
          outing_id: outing.id,
          profile_id: profile.id,
          budget_min: organizerPreference.budgetMin,
          budget_max: organizerPreference.budgetMax,
          available_dates: organizerPreference.availableDates,
          destination_votes: organizerPreference.destinationVotes,
          lodging_preferences: organizerPreference.lodgingPreferences,
          course_quality_preference: organizerPreference.courseQualityPreference,
          walking_preference: organizerPreference.walkingPreference,
          comments: organizerPreference.comments ?? null
        },
        { onConflict: "outing_id,profile_id" }
      );

      if (organizerPreferenceError) {
        logError("Failed to seed organizer preferences", organizerPreferenceError, {
          organizerId: profile.id,
          outingId: outing.id
        });
      }

      await seedLiveInventory({
        ...outing,
        createdAt: new Date().toISOString()
      });
      const shareLink = await getOutingShareLink(outing.id, profile.id);

      let message = "Outing created";
      let inviteEmail: string | undefined;
      let inviteLink: string | undefined;

      if (parsed.data.initialInviteEmail) {
        const inviteResult = await createLiveInvite({
          outingId: outing.id,
          email: parsed.data.initialInviteEmail,
          invitedBy: profile.id,
          outingName: outing.name,
          organizerName: profile.fullName
        });

        inviteEmail = parsed.data.initialInviteEmail;
        inviteLink = buildInviteLink(inviteResult.token);
        message =
          inviteResult.emailStatus === "sent"
            ? "Outing created and first invite is ready"
            : inviteResult.emailStatus === "failed"
              ? "Outing created. Email delivery failed, so use the invite link below instead"
              : "Outing created. The invite link is ready even though email is not configured yet";
      }

      destination = buildOutingRedirect(outing.id, {
        success: message,
        created: true,
        inviteEmail,
        inviteLink,
        shareLink: shareLink ?? undefined
      });
    }
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
    emails: String(formData.get("emails") ?? "")
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Enter%20at%20least%20one%20valid%20email`);
  }

  const parsedEmails = parseInviteEmails(parsed.data.emails);

  if (!parsedEmails.emails.length || parsedEmails.invalid.length) {
    redirect(
      `/outings/${parsed.data.outingId}?error=${encodeURIComponent(
        parsedEmails.invalid.length
          ? `Fix these email addresses first: ${parsedEmails.invalid.join(", ")}`
          : "Enter at least one valid invite email"
      )}`
    );
  }

  try {
    if (isDemoMode) {
      const createdInvites = [];

      for (const email of parsedEmails.emails) {
        createdInvites.push(await createDemoInvite(parsed.data.outingId, email, profile.id));
      }

      redirect(
        buildOutingRedirect(parsed.data.outingId, {
          success:
            createdInvites.length === 1
              ? "Invite sent"
              : `${createdInvites.length} invites created`,
          inviteEmail: createdInvites.length === 1 ? createdInvites[0]?.email : undefined,
          inviteLink: createdInvites.length === 1 ? buildInviteLink(createdInvites[0].token) : undefined
        })
      );
    }

    const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());

    if (!supabase) {
      redirect(`/outings/${parsed.data.outingId}?error=Supabase%20not%20configured`);
    }

    const { data: outingRow } = await supabase!
      .from("outings")
      .select("id,name,organizer_id")
      .eq("id", parsed.data.outingId)
      .maybeSingle();

    if (!outingRow) {
      redirect(`/outings/${parsed.data.outingId}?error=Outing%20not%20found`);
    }

    if (!isAdmin(profile) && !canManageOuting({ organizerId: outingRow.organizer_id } as Outing, profile)) {
      redirect(`/outings/${parsed.data.outingId}?error=Only%20the%20organizer%20can%20invite%20members`);
    }

    const [{ data: inviteRows }, { data: memberRows }] = await Promise.all([
      supabase!.from("invites").select("email,status").eq("outing_id", parsed.data.outingId),
      supabase!.from("outing_members").select("profile_id").eq("outing_id", parsed.data.outingId)
    ]);

    const memberIds = Array.from(new Set((memberRows ?? []).map((row) => row.profile_id).filter(Boolean)));
    const { data: profileRows } = memberIds.length
      ? await supabase!
          .from("profiles")
          .select("email")
          .in("id", memberIds)
      : { data: [] as Array<{ email: string }> };

    const existingEmails = new Set(
      [...(inviteRows ?? []).map((row) => row.email.toLowerCase()), ...(profileRows ?? []).map((row) => row.email.toLowerCase())]
    );

    const emailsToInvite = parsedEmails.emails.filter((email) => !existingEmails.has(email));
    const skippedEmails = parsedEmails.emails.filter((email) => existingEmails.has(email));

    if (!emailsToInvite.length) {
      redirect(
        buildOutingRedirect(parsed.data.outingId, {
          success: "Everyone in that list already has access or already has an invite",
          shareLink: (await getOutingShareLink(parsed.data.outingId, profile.id)) ?? undefined
        })
      );
    }

    const inviteResults = [];

    for (const email of emailsToInvite) {
      inviteResults.push(
        await createLiveInvite({
          outingId: parsed.data.outingId,
          email,
          invitedBy: profile.id,
          outingName: outingRow.name,
          organizerName: profile.fullName
        })
      );
    }

    const sentCount = inviteResults.filter((item) => item.emailStatus === "sent").length;
    const failedCount = inviteResults.filter((item) => item.emailStatus === "failed").length;
    const createdCount = inviteResults.length;
    const singleInvite = createdCount === 1 ? inviteResults[0] : null;
    const statusMessage =
      createdCount === 1
        ? sentCount === 1
          ? "Invite email sent"
          : failedCount === 1
            ? "Invite saved. Email delivery failed, so use the link below instead"
            : "Invite saved. The link is ready even though email delivery is not configured yet"
        : `${createdCount} invites created${skippedEmails.length ? `. ${skippedEmails.length} skipped.` : ""}`;

    revalidatePath(`/outings/${parsed.data.outingId}`);
    revalidatePath(`/outings/${parsed.data.outingId}/compare`);
    redirect(
      buildOutingRedirect(parsed.data.outingId, {
        success: statusMessage,
        inviteEmail: singleInvite ? emailsToInvite[0] : undefined,
        inviteLink: singleInvite ? buildInviteLink(singleInvite.token) : undefined,
        shareLink: (await getOutingShareLink(parsed.data.outingId, profile.id)) ?? undefined
      })
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Failed to invite member", error, {
      outingId: parsed.data.outingId,
      emails: parsedEmails.emails
    });
    redirect(`/outings/${parsed.data.outingId}?error=Unable%20to%20send%20invite`);
  }
}

export async function resendInviteAction(formData: FormData) {
  const profile = await requireProfile();
  const parsed = resendInviteSchema.safeParse({
    outingId: formData.get("outingId"),
    inviteId: formData.get("inviteId")
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Unable%20to%20resend%20that%20invite`);
  }

  try {
    if (isDemoMode) {
      const invite = await resendDemoInvite(parsed.data.inviteId, profile.id);

      if (!invite) {
        redirect(`/outings/${parsed.data.outingId}?error=Invite%20not%20found`);
      }

      redirect(
        buildOutingRedirect(parsed.data.outingId, {
          success: "Fresh invite link ready",
          inviteEmail: invite.email,
          inviteLink: buildInviteLink(invite.token)
        })
      );
    }

    const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());

    if (!supabase) {
      redirect(`/outings/${parsed.data.outingId}?error=Supabase%20not%20configured`);
    }

    const { data: outingRow } = await supabase!
      .from("outings")
      .select("id,organizer_id")
      .eq("id", parsed.data.outingId)
      .maybeSingle();

    if (!outingRow) {
      redirect(`/outings/${parsed.data.outingId}?error=Outing%20not%20found`);
    }

    if (!isAdmin(profile) && !canManageOuting({ organizerId: outingRow.organizer_id } as Outing, profile)) {
      redirect(`/outings/${parsed.data.outingId}?error=Only%20the%20organizer%20can%20resend%20invites`);
    }

    const resentInvite = await resendLiveInvite({
      outingId: parsed.data.outingId,
      inviteId: parsed.data.inviteId,
      invitedBy: profile.id,
      organizerName: profile.fullName
    });

    const statusMessage =
      resentInvite.emailStatus === "sent"
        ? `Invite re-sent to ${resentInvite.email}`
        : resentInvite.emailStatus === "failed"
          ? `Fresh invite saved for ${resentInvite.email}. Email delivery failed, so use the link below instead`
          : `Fresh invite link ready for ${resentInvite.email}`;

    revalidatePath(`/outings/${parsed.data.outingId}`);
    revalidatePath(`/outings/${parsed.data.outingId}/compare`);
    redirect(
      buildOutingRedirect(parsed.data.outingId, {
        success: statusMessage,
        inviteEmail: resentInvite.email,
        inviteLink: buildInviteLink(resentInvite.token),
        shareLink: (await getOutingShareLink(parsed.data.outingId, profile.id)) ?? undefined
      })
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Failed to resend invite", error, {
      outingId: parsed.data.outingId,
      inviteId: parsed.data.inviteId
    });
    redirect(`/outings/${parsed.data.outingId}?error=${encodeURIComponent(error instanceof Error ? error.message : "Unable to resend invite")}`);
  }
}

export async function nudgeMemberAction(formData: FormData) {
  const profile = await requireProfile();
  const outingId = String(formData.get("outingId") ?? "").trim();
  const memberProfileId = String(formData.get("memberProfileId") ?? "").trim();
  const memberEmail = String(formData.get("memberEmail") ?? "").trim();

  if (!outingId || !memberProfileId) {
    redirect(`/outings/${outingId}?error=Missing%20required%20fields`);
  }

  const adminClient = createSupabaseAdminClient();
  const supabase = adminClient ?? (await createSupabaseServerClient());

  if (!supabase) {
    redirect(`/outings/${outingId}?error=Not%20configured`);
  }

  // Verify caller is organizer
  const { data: outingRow } = await supabase
    .from("outings")
    .select("organizer_id, name")
    .eq("id", outingId)
    .maybeSingle();

  if (!outingRow || outingRow.organizer_id !== profile.id) {
    redirect(`/outings/${outingId}?error=Only%20the%20organizer%20can%20send%20nudges`);
  }

  // Send the nudge email if Resend is configured
  try {
    const { sendInviteEmail: _unused, isInviteEmailConfigured } = await import("@/lib/email/invite-email");
    if (memberEmail && isInviteEmailConfigured()) {
      const { Resend } = await import("resend");
      const { env: appEnv } = await import("@/lib/env");
      if (appEnv.RESEND_API_KEY && appEnv.RESEND_FROM_EMAIL) {
        const resend = new Resend(appEnv.RESEND_API_KEY);
        await resend.emails.send({
          from: appEnv.RESEND_FROM_EMAIL,
          to: memberEmail,
          replyTo: appEnv.RESEND_REPLY_TO_EMAIL || undefined,
          subject: `Don't forget — fill out your preferences for ${outingRow.name}`,
          text: `Hey! ${profile.fullName ?? "The organizer"} is asking you to fill out your preferences for the golf trip "${outingRow.name}". Takes under a minute and helps the group lock in the best dates, courses, and lodging. Open the outing to get started.`,
          html: `<p>Hey!</p><p><strong>${profile.fullName ?? "The organizer"}</strong> is nudging you to fill out your preferences for the golf trip <strong>${outingRow.name}</strong>.</p><p>It takes under a minute and helps the group lock in the best dates, courses, and lodging.</p><p>Open the outing in your app to fill out your preferences.</p>`
        });
      }
    }
  } catch {
    // Email failure is non-fatal — still show success
  }

  redirect(`/outings/${outingId}?success=Nudge%20sent%20to%20${encodeURIComponent(memberEmail || "member")}`);
}

export async function joinOutingFromShareLinkAction(formData: FormData) {
  const profile = await requireProfile();
  const token = String(formData.get("token") ?? "").trim();

  if (!token) {
    redirect("/dashboard?error=Share%20link%20is%20missing");
  }

  const outingId = await resolveOutingIdFromShareToken(token);

  if (!outingId) {
    redirect("/?error=That%20share%20link%20is%20no%20longer%20valid");
  }

  if (isDemoMode) {
    await joinDemoOuting(outingId, profile.id);
    redirect(`/outings/${outingId}?newMember=1`);
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    redirect("/dashboard?error=Joining%20is%20not%20configured");
  }

  const { error } = await adminClient!.from("outing_members").upsert(
    {
      outing_id: outingId,
      profile_id: profile.id,
      role: "participant"
    },
    { onConflict: "outing_id,profile_id" }
  );

  if (error) {
    logError("Failed to join outing from share link", error, { outingId, profileId: profile.id });
    redirect(`/join/${token}?error=Unable%20to%20join%20this%20outing`);
  }

  redirect(`/outings/${outingId}?newMember=1`);
}

export async function submitPreferencesAction(formData: FormData) {
  const fromNewMember = formData.get("fromNewMember") === "1";
  const profile = await requireProfile();
  const parsed = preferenceSchema.safeParse({
    outingId: formData.get("outingId"),
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
    availableDates: (() => {
      // Support both checkbox-style (multiple values) and legacy comma-separated
      const all = formData.getAll("availableDates").map(String).filter(Boolean);
      if (all.length > 0) return all;
      return String(formData.get("availableDates") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    })(),
    destinationVotes: (() => {
      const all = formData.getAll("destinationVotes").map(String).filter(Boolean);
      if (all.length > 0) return all;
      return String(formData.get("destinationVotes") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    })(),
    lodgingPreferences: (() => {
      const all = formData.getAll("lodgingPreferences").map(String).filter(Boolean);
      if (all.length > 0) return all;
      return String(formData.get("lodgingPreferences") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    })(),
    courseQualityPreference: formData.get("courseQualityPreference"),
    walkingPreference: formData.get("walkingPreference"),
    comments: String(formData.get("comments") ?? ""),
    preferredRounds: formData.get("preferredRounds") || undefined,
    homeCity: String(formData.get("homeCity") ?? "").trim() || undefined
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Please%20complete%20the%20required%20preference%20fields`);
  }

  if (isDemoMode) {
    await upsertDemoPreference(profile.id, parsed.data.outingId, {
      budgetMin: parsed.data.budgetMin,
      budgetMax: parsed.data.budgetMax,
      availableDates: parsed.data.availableDates,
      destinationVotes: parsed.data.destinationVotes,
      lodgingPreferences: parsed.data.lodgingPreferences,
      courseQualityPreference: parsed.data.courseQualityPreference,
      walkingPreference: parsed.data.walkingPreference,
      comments: parsed.data.comments,
      preferredRounds: parsed.data.preferredRounds ?? null,
      homeCity: parsed.data.homeCity ?? null
    });

    revalidatePath(`/outings/${parsed.data.outingId}`);
    revalidatePath(`/outings/${parsed.data.outingId}/compare`);
    redirect(fromNewMember
      ? `/outings/${parsed.data.outingId}?confirmed=1#confirmed-top`
      : `/outings/${parsed.data.outingId}?success=Preferences%20saved`
    );
  }

  const adminClient = createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  if (!adminClient) {
    redirect(`/outings/${parsed.data.outingId}?error=Saving%20preferences%20is%20not%20configured`);
  }

  const [{ data: outingRow }, { data: memberRow }] = await Promise.all([
    adminClient!.from("outings").select("organizer_id").eq("id", parsed.data.outingId).maybeSingle(),
    adminClient!
      .from("outing_members")
      .select("id")
      .eq("outing_id", parsed.data.outingId)
      .eq("profile_id", profile.id)
      .maybeSingle()
  ]);

  if (!outingRow || (!memberRow && !isAdmin(profile) && outingRow.organizer_id !== profile.id)) {
    redirect(`/outings/${parsed.data.outingId}?error=You%20do%20not%20have%20access%20to%20save%20preferences`);
  }

  const { error } = await adminClient!.from("preference_submissions").upsert(
    {
      outing_id: parsed.data.outingId,
      profile_id: profile.id,
      budget_min: parsed.data.budgetMin,
      budget_max: parsed.data.budgetMax,
      available_dates: parsed.data.availableDates,
      destination_votes: parsed.data.destinationVotes,
      lodging_preferences: parsed.data.lodgingPreferences,
      course_quality_preference: parsed.data.courseQualityPreference,
      walking_preference: parsed.data.walkingPreference,
      comments: parsed.data.comments ?? null,
      preferred_rounds: parsed.data.preferredRounds ?? null,
      home_city: parsed.data.homeCity ?? null
    },
    { onConflict: "outing_id,profile_id" }
  );

  if (error) {
    logError("Failed to save preferences", error, {
      outingId: parsed.data.outingId,
      profileId: profile.id
    });
    redirect(`/outings/${parsed.data.outingId}?error=Unable%20to%20save%20preferences`);
  }

  revalidatePath(`/outings/${parsed.data.outingId}`);
  revalidatePath(`/outings/${parsed.data.outingId}/compare`);
  redirect(fromNewMember
    ? `/outings/${parsed.data.outingId}?confirmed=1#confirmed-top`
    : `/outings/${parsed.data.outingId}?success=Preferences%20saved`
  );
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

  if (isDemoMode) {
    await addDemoChatMessage(parsed.data.outingId, profile.id, parsed.data.message);
    redirect(`/outings/${parsed.data.outingId}`);
  }

  // Use admin client so RLS auth.uid() checks don't block server-action inserts
  const adminClient = createSupabaseAdminClient();
  const supabase = adminClient ?? (await createSupabaseServerClient());

  const { error: chatError } = await supabase!.from("chat_messages").insert({
    id: randomUUID(),
    outing_id: parsed.data.outingId,
    profile_id: profile.id,
    message: parsed.data.message
  });

  if (chatError) {
    logError("Failed to send chat message", chatError, {
      outingId: parsed.data.outingId,
      profileId: profile.id
    });
    redirect(`/outings/${parsed.data.outingId}?error=Message%20could%20not%20be%20sent`);
  }

  revalidatePath(`/outings/${parsed.data.outingId}`);
  redirect(`/outings/${parsed.data.outingId}`);
}

export async function sendChatMessageInlineAction(
  _previousState: SendChatMessageInlineState,
  formData: FormData
): Promise<SendChatMessageInlineState> {
  const profile = await requireProfile();
  const parsed = chatMessageSchema.safeParse({
    outingId: formData.get("outingId"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    return {
      status: "error",
      error: "Enter a message under 800 characters"
    };
  }

  const createdMessage: ChatMessage = {
    id: randomUUID(),
    outingId: parsed.data.outingId,
    profileId: profile.id,
    message: parsed.data.message,
    createdAt: new Date().toISOString()
  };

  try {
    if (isDemoMode) {
      await addDemoChatMessage(parsed.data.outingId, profile.id, parsed.data.message);

      return {
        status: "success",
        message: createdMessage
      };
    }

    const adminClient = createSupabaseAdminClient();
    const supabase = adminClient ?? (await createSupabaseServerClient());

    const { error: chatError } = await supabase!.from("chat_messages").insert({
      id: createdMessage.id,
      outing_id: createdMessage.outingId,
      profile_id: createdMessage.profileId,
      message: createdMessage.message,
      created_at: createdMessage.createdAt
    });

    if (chatError) {
      logError("Failed to send chat message inline", chatError, {
        outingId: parsed.data.outingId,
        profileId: profile.id
      });

      return {
        status: "error",
        error: "Message could not be sent"
      };
    }

    revalidatePath(`/outings/${parsed.data.outingId}`);

    return {
      status: "success",
      message: createdMessage
    };
  } catch (error) {
    logError("Unexpected inline chat failure", error, {
      outingId: parsed.data.outingId,
      profileId: profile.id
    });

    return {
      status: "error",
      error: "Message could not be sent"
    };
  }
}

export async function acceptInviteAction(formData: FormData) {
  const profile = await requireProfile();
  const parsed = acceptInviteSchema.safeParse({
    token: String(formData.get("token") ?? "").trim()
  });

  if (!parsed.success) {
    redirect("/dashboard?error=Invite%20token%20is%20missing");
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    redirect("/dashboard?error=Invite%20acceptance%20is%20not%20configured");
  }

  const { data: invite } = await adminClient!
    .from("invites")
    .select("id,outing_id,email,status")
    .eq("token", parsed.data.token)
    .maybeSingle();

  if (!invite) {
    redirect("/dashboard?error=Invite%20not%20found");
  }

  if (invite.email.toLowerCase() !== profile.email.toLowerCase()) {
    redirect(`/invite/${parsed.data.token}?error=Sign%20in%20with%20${encodeURIComponent(invite.email)}`);
  }

  await adminClient!.from("outing_members").upsert(
    {
      id: randomUUID(),
      outing_id: invite.outing_id,
      profile_id: profile.id,
      role: "participant"
    },
    { onConflict: "outing_id,profile_id" }
  );

  await adminClient!.from("invites").update({ status: "accepted" }).eq("id", invite.id);

  redirect(`/outings/${invite.outing_id}?success=You%20joined%20the%20outing`);
}

export async function deleteOutingAction(formData: FormData) {
  const profile = await requireProfile();
  const outingId = String(formData.get("outingId") ?? "").trim();

  if (!outingId) {
    redirect("/dashboard?error=Outing%20not%20found");
  }

  if (isDemoMode) {
    const { deleteDemoOuting } = await import("@/lib/demo/store");
    const deleted = await deleteDemoOuting(outingId, profile.id);

    if (!deleted) {
      redirect("/dashboard?error=Unable%20to%20delete%20outing");
    }

    redirect("/dashboard?success=Outing%20deleted");
  }

  const adminClient = createSupabaseAdminClient();
  const supabase = await createSupabaseServerClient();
  const readClient = adminClient ?? supabase;

  if (!readClient) {
    redirect("/dashboard?error=Supabase%20not%20configured");
  }

  const { data: outing } = await readClient!
    .from("outings")
    .select("id,organizer_id")
    .eq("id", outingId)
    .maybeSingle();

  if (!outing) {
    redirect("/dashboard?error=Outing%20not%20found");
  }

  if (!isAdmin(profile) && outing.organizer_id !== profile.id) {
    redirect("/dashboard?error=Only%20the%20organizer%20can%20delete%20this%20outing");
  }

  const deleteClient = adminClient ?? supabase;
  const { error } = await deleteClient!.from("outings").delete().eq("id", outingId);

  if (error) {
    logError("Failed to delete outing", error, {
      outingId,
      profileId: profile.id
    });
    redirect("/dashboard?error=Unable%20to%20delete%20outing");
  }

  redirect("/dashboard?success=Outing%20deleted");
}

// ── Group voting actions ──────────────────────────────────────────────────────

export async function openVotingAction(formData: FormData) {
  const profile = await requireProfile();
  const outingId = String(formData.get("outingId") ?? "").trim();
  if (!outingId) redirect(`/dashboard?error=Missing+outing`);

  if (isDemoMode) {
    revalidatePath(`/outings/${outingId}`);
    redirect(`/outings/${outingId}?success=Group+vote+opened`);
  }

  const client = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!client) redirect(`/outings/${outingId}?error=Not+configured`);

  const { data: outing } = await client
    .from("outings")
    .select("id,organizer_id")
    .eq("id", outingId)
    .maybeSingle();

  if (!outing || (outing.organizer_id !== profile.id && !isAdmin(profile))) {
    redirect(`/outings/${outingId}?error=Only+the+organizer+can+open+voting`);
  }

  await client.from("outings").update({ voting_open: true }).eq("id", outingId);
  revalidatePath(`/outings/${outingId}`);
  redirect(`/outings/${outingId}?success=Group+vote+is+now+open`);
}

export async function closeVotingAction(formData: FormData) {
  const profile = await requireProfile();
  const outingId = String(formData.get("outingId") ?? "").trim();
  if (!outingId) redirect(`/dashboard?error=Missing+outing`);

  if (isDemoMode) {
    revalidatePath(`/outings/${outingId}`);
    redirect(`/outings/${outingId}?success=Vote+closed`);
  }

  const client = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!client) redirect(`/outings/${outingId}?error=Not+configured`);

  const { data: outing } = await client
    .from("outings")
    .select("id,organizer_id")
    .eq("id", outingId)
    .maybeSingle();

  if (!outing || (outing.organizer_id !== profile.id && !isAdmin(profile))) {
    redirect(`/outings/${outingId}?error=Only+the+organizer+can+close+voting`);
  }

  await client.from("outings").update({ voting_open: false }).eq("id", outingId);
  revalidatePath(`/outings/${outingId}`);
  redirect(`/outings/${outingId}?success=Vote+closed`);
}

export async function markAsBookedAction(formData: FormData) {
  const profile = await requireProfile();
  const outingId = String(formData.get("outingId") ?? "").trim();
  if (!outingId) redirect(`/dashboard?error=Missing+outing`);

  if (isDemoMode) {
    revalidatePath(`/outings/${outingId}`);
    redirect(`/outings/${outingId}/trip`);
  }

  const client = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!client) redirect(`/outings/${outingId}?error=Not+configured`);

  const { data: outing } = await client
    .from("outings")
    .select("id,organizer_id")
    .eq("id", outingId)
    .maybeSingle();

  if (!outing || (outing.organizer_id !== profile.id && !isAdmin(profile))) {
    redirect(`/outings/${outingId}?error=Only+the+organizer+can+mark+this+as+booked`);
  }

  await client.from("outings").update({ status: "booked" }).eq("id", outingId);

  // Send booking confirmation to all members
  try {
    // Get all member profiles for this outing
    const { data: memberProfiles } = await client
      .from("outing_members")
      .select("profile_id, profiles!inner(email, full_name)")
      .eq("outing_id", outingId);

    const { data: outingData } = await client
      .from("outings")
      .select("name, destination_label")
      .eq("id", outingId)
      .maybeSingle();

    if (memberProfiles && outingData) {
      const tripHqUrl = `${publicAppUrl}/outings/${outingId}/trip`;
      const { sendBookingConfirmedEmail } = await import("@/lib/email/invite-email");

      await Promise.allSettled(
        memberProfiles.map((mp: any) => {
          const profile = (mp as any).profiles;
          return sendBookingConfirmedEmail({
            memberEmail: profile.email,
            memberName: profile.full_name ?? profile.email,
            outingName: outingData.name,
            destination: outingData.destination_label ?? "your destination",
            tripHqUrl
          });
        })
      );
    }
  } catch {
    // Email failures should not block the redirect
  }

  revalidatePath(`/outings/${outingId}`);
  redirect(`/outings/${outingId}/trip`);
}

export async function castGroupVoteAction(formData: FormData) {
  const profile = await requireProfile();
  const outingId = String(formData.get("outingId") ?? "").trim();
  const entityId = String(formData.get("entityId") ?? "").trim();
  const entityType = String(formData.get("entityType") ?? "").trim() as "golf_course" | "lodging";

  if (!outingId || !entityId || !entityType) {
    redirect(`/dashboard?error=Invalid+vote`);
  }

  if (isDemoMode) {
    revalidatePath(`/outings/${outingId}`);
    redirect(`/outings/${outingId}`);
  }

  const client = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!client) redirect(`/outings/${outingId}?error=Not+configured`);

  // Verify member belongs to this outing
  const { data: membership } = await client
    .from("outing_members")
    .select("id")
    .eq("outing_id", outingId)
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!membership) {
    redirect(`/outings/${outingId}?error=Not+a+member`);
  }

  // Find any existing vote this member has cast for this entity_type in this outing
  const { data: existingVotes } = await client
    .from("votes")
    .select("id,entity_id")
    .eq("outing_id", outingId)
    .eq("profile_id", profile.id)
    .eq("entity_type", entityType);

  const existingForSameEntity = (existingVotes ?? []).find((v) => v.entity_id === entityId);

  // Delete all existing votes for this type (enforces one pick per category)
  if (existingVotes && existingVotes.length > 0) {
    await client
      .from("votes")
      .delete()
      .eq("outing_id", outingId)
      .eq("profile_id", profile.id)
      .eq("entity_type", entityType);
  }

  // If they clicked their own existing vote → it's a toggle-off, so just remove (done above)
  // If they clicked a different option → insert the new vote
  if (!existingForSameEntity) {
    await client.from("votes").insert({
      outing_id: outingId,
      profile_id: profile.id,
      entity_type: entityType,
      entity_id: entityId,
      weight: 5
    });
  }

  revalidatePath(`/outings/${outingId}`);
  redirect(`/outings/${outingId}`);
}
