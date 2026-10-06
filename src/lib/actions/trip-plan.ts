"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { courseRoundDays, tripDayCount } from "@/lib/trip-plan";
import { editDemoTripPlan } from "@/lib/demo/store";

function refresh(id: string) {
  revalidatePath(`/outings/${id}`);
  revalidatePath(`/outings/${id}/trip`);
  revalidatePath(`/outings/${id}/compare`);
}
export async function editTripRound(
  outingId: string,
  courseId: string,
  operation: "add" | "move" | "remove",
  index: number,
  day: number | null,
) {
  const profile = await requireProfile();
  if (
    !Number.isInteger(index) ||
    (day !== null && (!Number.isInteger(day) || day < 1))
  )
    throw new Error("Invalid round date");
  if (isDemoMode) {
    await editDemoTripPlan(outingId, profile.id, (outing, courses) => {
      const course = courses.find((c) => c.id === courseId);
      if (!course) throw new Error("Course not found");
      const window = outing.preferredDateWindows[0];
      if (day && day > tripDayCount(window?.start, window?.end))
        throw new Error("Choose a date within the trip");
      const days = [...courseRoundDays(course)];
      if (operation === "add") {
        if (!course.featured) days.splice(0, days.length, day);
        else days.push(day);
      } else if (index < 0 || index >= days.length)
        throw new Error("Refresh and try again");
      else if (operation === "move") days[index] = day;
      else days.splice(index, 1);
      course.roundDays = days;
      course.scheduleDay = days[0] ?? null;
      course.scheduleRounds = days.length || 1;
      course.featured = days.length > 0;
      if (day && operation !== "remove")
        outing.noGolfDays = outing.noGolfDays.filter((d) => d !== day);
    });
  } else {
    const client = createSupabaseAdminClient();
    if (!client) throw new Error("Unable to save. Please try again.");
    const { error } = await client.rpc("edit_trip_round", {
      p_outing: outingId,
      p_course: courseId,
      p_actor: profile.id,
      p_operation: operation,
      p_index: index,
      p_day: day,
    });
    if (error) throw new Error(error.message);
  }
  refresh(outingId);
}
export async function saveRoomOccupancy(outingId: string, occupancy: number) {
  const profile = await requireProfile();
  if (!Number.isInteger(occupancy) || occupancy < 1 || occupancy > 8)
    throw new Error("Choose 1 to 8 people per room");
  if (isDemoMode)
    await editDemoTripPlan(outingId, profile.id, (outing) => {
      outing.personsPerRoom = occupancy;
    });
  else {
    const client = createSupabaseAdminClient();
    if (!client) throw new Error("Unable to save room occupancy");
    const { data: outing } = await client
      .from("outings")
      .select("organizer_id")
      .eq("id", outingId)
      .single();
    const { data: member } = await client
      .from("outing_members")
      .select("role")
      .eq("outing_id", outingId)
      .eq("profile_id", profile.id)
      .maybeSingle();
    if (
      !outing ||
      (outing.organizer_id !== profile.id && member?.role !== "co_organizer")
    )
      throw new Error("Organizer access required");
    const { error } = await client
      .from("outings")
      .update({ persons_per_room: occupancy })
      .eq("id", outingId);
    if (error) throw new Error("Could not save room occupancy");
  }
  refresh(outingId);
}

export async function updatePlanningSetup(
  outingId: string,
  input:
    | { kind: "mode"; mode: "organizer" | "group" }
    | { kind: "dates"; index: number; confirm: boolean }
    | { kind: "lodging"; booked: boolean; reference?: string },
) {
  const profile = await requireProfile();
  const { getOutingDetail } = await import("@/modules/outings/service");
  const detail = await getOutingDetail(outingId, profile.id);
  if (
    !detail ||
    (detail.outing.organizerId !== profile.id &&
      !detail.members.some(
        (m) => m.profileId === profile.id && m.role === "co_organizer",
      ))
  )
    throw new Error("Organizer access required");
  const trip = detail.outing;
  const patch: Partial<typeof trip> = {};
  const db: Record<string, unknown> = {};
  if (input.kind === "mode") {
    if (!["organizer", "group"].includes(input.mode))
      throw new Error("Choose a planning approach");
    patch.planningMode = input.mode;
    db.planning_mode = input.mode;
  } else if (input.kind === "dates") {
    if (
      typeof input.confirm !== "boolean" ||
      !Number.isInteger(input.index) ||
      !trip.preferredDateWindows[input.index]
    )
      throw new Error("Choose an available date option");
    const chosen = trip.preferredDateWindows[input.index];
    patch.preferredDateWindows = [
      chosen,
      ...trip.preferredDateWindows.filter((_, i) => i !== input.index),
    ];
    patch.confirmedDateWindow = input.confirm ? chosen : null;
    db.preferred_date_windows = patch.preferredDateWindows;
    db.confirmed_date_window = patch.confirmedDateWindow;
  } else if (input.kind === "lodging") {
    if (
      typeof input.booked !== "boolean" ||
      (input.reference !== undefined && typeof input.reference !== "string")
    )
      throw new Error("Invalid booking details");
    const stay = detail.lodging.find((l) => l.featured && !l.hidden);
    const dates = trip.preferredDateWindows[0];
    if (input.booked && (!stay || !dates))
      throw new Error("Choose your stay and dates first");
    patch.lodgingBooking = input.booked
      ? {
          lodgingId: stay!.id,
          start: dates!.start,
          end: dates!.end,
          reference: input.reference?.trim().slice(0, 120),
        }
      : null;
    db.lodging_booking = patch.lodgingBooking;
  } else throw new Error("Invalid planning update");
  if (isDemoMode)
    await editDemoTripPlan(outingId, profile.id, (outing) => {
      Object.assign(outing, patch);
    });
  else {
    const client = createSupabaseAdminClient();
    if (!client) throw new Error("Unable to save changes");
    const { error } = await client
      .from("outings")
      .update(db)
      .eq("id", outingId);
    if (error) throw new Error("Could not save changes. Try again.");
  }
  refresh(outingId);
  revalidatePath("/dashboard");
}
