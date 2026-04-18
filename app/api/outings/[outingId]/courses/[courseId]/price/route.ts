import { NextResponse } from "next/server";

import { requireProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ outingId: string; courseId: string }> }
) {
  try {
    const profile = await requireProfile();
    const { outingId, courseId } = await context.params;
    const { price } = await request.json();

    if (!price || typeof price !== "number" || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
    if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: outing } = await supabase
      .from("outings")
      .select("organizer_id")
      .eq("id", outingId)
      .maybeSingle();

    if (!outing || outing.organizer_id !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("golf_course_options")
      .update({ average_greens_fee: Math.round(price) })
      .eq("id", courseId)
      .eq("outing_id", outingId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update price" },
      { status: 500 }
    );
  }
}
