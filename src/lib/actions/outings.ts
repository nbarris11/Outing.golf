"use server";

import { randomUUID } from "node:crypto";

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
import { deploymentUrl, isDemoMode } from "@/lib/env";
import { isInviteEmailConfigured, sendInviteEmail } from "@/lib/email/invite-email";
import { logError } from "@/lib/logger";
import { getOutingShareLink } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageOuting, isAdmin } from "@/modules/outings/permissions";
import { fetchOutingInventory } from "@/modules/providers/inventory-service";
import type { Outing } from "@/types/domain";

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

const acceptInviteSchema = z.object({
  token: z.string().min(1)
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

function buildBudgetRange(target: number) {
  return {
    budgetMin: Math.max(300, target - 200),
    budgetMax: Math.min(4000, target + 200)
  };
}

function buildOrganizerPreferenceSeed(input: z.infer<typeof createOutingSchema>) {
  const budgetRange = buildBudgetRange(input.budgetTarget);

  return {
    budgetMin: budgetRange.budgetMin,
    budgetMax: budgetRange.budgetMax,
    availableDates: [input.dateStart, input.dateEnd],
    destinationVotes: [],
    lodgingPreferences: input.lodgingPreference === "mixed" ? [] : [input.lodgingPreference],
    courseQualityPreference:
      input.tripVibe === "serious_golf" ? 9 : input.tripVibe === "casual" ? 6 : 7,
    walkingPreference: "either" as const,
    comments: input.notes || undefined
  };
}

function buildInviteLink(token: string) {
  return `${deploymentUrl}/invite/${token}`;
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

function buildOutingRecord(input: z.infer<typeof createOutingSchema>, organizerId: string): Omit<Outing, "createdAt"> {
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
    preferredDateWindows: [
      {
        start: input.dateStart,
        end: input.dateEnd
      }
    ],
    budgetTarget: input.budgetTarget,
    tripStyle: input.tripStyle ?? vibeDefaults.tripStyle,
    numberOfPlayers: input.numberOfPlayers,
    golfIntensity: input.golfIntensity ?? vibeDefaults.golfIntensity,
    lodgingPreference: input.lodgingPreference ?? vibeDefaults.lodgingPreference,
    notes: input.notes,
    status: "planning",
    organizerWeighting: input.organizerWeighting
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
    return { token, emailSent: false };
  }

  await sendInviteEmail({
    inviteeEmail: input.email,
    outingName: input.outingName,
    organizerName: input.organizerName,
    inviteLink: `/invite/${token}`
  });

  return { token, emailSent: true };
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
    dateStart: formData.get("dateStart"),
    dateEnd: formData.get("dateEnd"),
    organizerWeighting: formData.get("organizerWeighting") ?? undefined,
    initialInviteEmail: formData.get("initialInviteEmail") ?? undefined
  });

  if (!parsed.success) {
    redirect("/outings/new?error=Please%20complete%20all%20required%20fields");
  }

  try {
    if (isDemoMode) {
      const outingDraft = buildOutingRecord(parsed.data, profile.id);
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
        organizerWeighting: outingDraft.organizerWeighting
      });

      await upsertDemoPreference(profile.id, outing.id, buildOrganizerPreferenceSeed(parsed.data));
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

      const outing = buildOutingRecord(parsed.data, profile.id);
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

      const organizerPreference = buildOrganizerPreferenceSeed(parsed.data);
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
        message = inviteResult.emailSent
          ? "Outing created and first invite is ready"
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
    email: String(formData.get("email") ?? "").trim().toLowerCase()
  });

  if (!parsed.success) {
    const outingId = String(formData.get("outingId") ?? "");
    redirect(`/outings/${outingId}?error=Enter%20a%20valid%20invite%20email`);
  }

  try {
    if (isDemoMode) {
      const invite = await createDemoInvite(parsed.data.outingId, parsed.data.email, profile.id);
      redirect(
        buildOutingRedirect(parsed.data.outingId, {
          success: "Invite sent",
          inviteEmail: parsed.data.email,
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
      .select("id,name,organizer_id")
      .eq("id", parsed.data.outingId)
      .maybeSingle();

    if (!outingRow) {
      redirect(`/outings/${parsed.data.outingId}?error=Outing%20not%20found`);
    }

    if (!isAdmin(profile) && !canManageOuting({ organizerId: outingRow.organizer_id } as Outing, profile)) {
      redirect(`/outings/${parsed.data.outingId}?error=Only%20the%20organizer%20can%20invite%20members`);
    }

    const inviteResult = await createLiveInvite({
      outingId: parsed.data.outingId,
      email: parsed.data.email,
      invitedBy: profile.id,
      outingName: outingRow.name,
      organizerName: profile.fullName
    });

    redirect(
      buildOutingRedirect(parsed.data.outingId, {
        success: inviteResult.emailSent
          ? "Invite email sent"
          : "Invite saved. The link is ready even though email delivery is not configured yet",
        inviteEmail: parsed.data.email,
        inviteLink: buildInviteLink(inviteResult.token),
        shareLink: (await getOutingShareLink(parsed.data.outingId, profile.id)) ?? undefined
      })
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Failed to invite member", error, {
      outingId: parsed.data.outingId,
      email: parsed.data.email
    });
    redirect(`/outings/${parsed.data.outingId}?error=Unable%20to%20send%20invite`);
  }
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

  if (isDemoMode) {
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

  const supabase = await createSupabaseServerClient();
  await supabase?.from("preference_submissions").upsert(
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
      comments: parsed.data.comments ?? null
    },
    { onConflict: "outing_id,profile_id" }
  );

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

  if (isDemoMode) {
    await addDemoChatMessage(parsed.data.outingId, profile.id, parsed.data.message);
    redirect(`/outings/${parsed.data.outingId}`);
  }

  const supabase = await createSupabaseServerClient();
  await supabase?.from("chat_messages").insert({
    id: randomUUID(),
    outing_id: parsed.data.outingId,
    profile_id: profile.id,
    message: parsed.data.message
  });

  redirect(`/outings/${parsed.data.outingId}`);
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
    await deleteDemoOuting(outingId, profile.id);
    redirect("/dashboard?success=Outing%20deleted");
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    redirect("/dashboard?error=Supabase%20not%20configured");
  }

  const { data: outing } = await adminClient!
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

  await adminClient!.from("outings").delete().eq("id", outingId);
  redirect("/dashboard?success=Outing%20deleted");
}
