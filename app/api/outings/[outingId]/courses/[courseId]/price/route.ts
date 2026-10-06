import { isDemoMode } from "@/lib/env";
import { editDemoTripPlan } from "@/lib/demo/store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ outingId: string; courseId: string }> },
) {
  try {
    const profile = await requireProfile();
    const { outingId, courseId } = await context.params;
    const { price } = await request.json();

    if (
      !price ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      price > 10000
    ) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (isDemoMode) {
      await editDemoTripPlan(outingId, profile.id, (_outing, courses) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) throw new Error("Course not found");
        course.averageGreensFee = Math.round(price);
      });
      revalidatePath(`/outings/${outingId}`);
      return NextResponse.json({ ok: true });
    }
    const supabase =
      createSupabaseAdminClient() ?? (await createSupabaseServerClient());
    if (!supabase)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: outing } = await supabase
      .from("outings")
      .select("organizer_id")
      .eq("id", outingId)
      .maybeSingle();

    const { data: member } = await supabase
      .from("outing_members")
      .select("role")
      .eq("outing_id", outingId)
      .eq("profile_id", profile.id)
      .maybeSingle();
    if (
      !outing ||
      (outing.organizer_id !== profile.id && member?.role !== "co_organizer")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("golf_course_options")
      .update({ average_greens_fee: Math.round(price) })
      .eq("id", courseId)
      .eq("outing_id", outingId);

    if (error) throw error;
    revalidatePath(`/outings/${outingId}`);
    revalidatePath(`/outings/${outingId}/compare`);
    revalidatePath(`/outings/${outingId}/trip`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update price",
      },
      { status: 500 },
    );
  }
}
