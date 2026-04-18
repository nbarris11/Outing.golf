import { NextResponse } from "next/server";

import { requireProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ outingId: string; optionId: string }> }
) {
  try {
    const profile = await requireProfile();
    const { outingId, optionId } = await context.params;
    const { address } = await request.json();

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
      .from("lodging_options")
      .update({ hotel_address: address ?? null })
      .eq("id", optionId)
      .eq("outing_id", outingId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update address" },
      { status: 500 }
    );
  }
}
