"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { getOutingDetail } from "@/modules/outings/service";
import { isDemoMode } from "@/lib/env";
import { upsertDemoPreference } from "@/lib/demo/store";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guestResponseSchema } from "@/lib/guest-response";
import { datesAreConfirmed } from "@/lib/trip-plan";

export async function saveGuestResponse(outingId: string, input: unknown) {
  const profile = await requireProfile();
  const detail = await getOutingDetail(outingId, profile.id);
  if (!detail) return { error: "You don't have access to this trip." };
  const parsed = guestResponseSchema.safeParse(input);
  if (!parsed.success)
    return {
      error:
        parsed.error.issues[0]?.message ?? "Check your response and try again.",
    };
  const data = parsed.data;
  const confirmed = datesAreConfirmed(detail.outing);
  const validDates = detail.outing.preferredDateWindows.map((w) => w.start);
  if (data.availableDates.some((d) => !validDates.includes(d)))
    return {
      error:
        "The proposed dates have changed. Refresh the page and choose again.",
    };
  if (
    !confirmed &&
    validDates.length &&
    data.responseStatus === "in" &&
    !data.availableDates.length
  ) {
    return {
      error:
        "Choose at least one available weekend, or select Maybe or Can't make it.",
    };
  }
  const old = detail.currentPreference;
  const submission = {
    ...data,
    availableDates:
      data.responseStatus === "declined"
        ? []
        : confirmed && data.responseStatus === "in"
          ? [validDates[0]]
          : data.availableDates,
    courseQualityPreference: old?.courseQualityPreference ?? 7,
    destinationVotes: old?.destinationVotes ?? [],
    homeCity: old?.homeCity ?? null,
  };
  if (isDemoMode) {
    await upsertDemoPreference(profile.id, outingId, submission);
  } else {
    const admin = createSupabaseAdminClient();
    if (!admin)
      return { error: "We couldn't save your response. Please try again." };
    const { error } = await admin.from("preference_submissions").upsert(
      {
        outing_id: outingId,
        profile_id: profile.id,
        response_status: submission.responseStatus,
        budget_min: submission.budgetMin,
        budget_max: submission.budgetMax,
        available_dates: submission.availableDates,
        comments: submission.comments,
        walking_preference: submission.walkingPreference,
        preferred_rounds: submission.preferredRounds,
        lodging_preferences: submission.lodgingPreferences,
        course_quality_preference: submission.courseQualityPreference,
        destination_votes: submission.destinationVotes,
        home_city: submission.homeCity,
      },
      { onConflict: "outing_id,profile_id" },
    );
    if (error)
      return { error: "Your response wasn't saved. Please try again." };
  }
  revalidatePath(`/outings/${outingId}`);
  revalidatePath(`/outings/${outingId}/trip`);
  revalidatePath("/dashboard");
  return { saved: true };
}
