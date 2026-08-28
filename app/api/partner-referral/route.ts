import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth";
import { logError } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const KNOWN_PARTNERS = new Set(["pin_seeker"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { partner?: string; outingId?: string }
      | null;

    const partner = body?.partner;
    if (!partner || !KNOWN_PARTNERS.has(partner)) {
      return NextResponse.json({ error: "Unknown partner" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      // Supabase not configured (local/dev) — don't fail the click.
      return NextResponse.json({ ok: true, recorded: false });
    }

    const profile = await getCurrentProfile();

    const { error } = await supabase.from("partner_referral_clicks").insert({
      partner,
      outing_id: body?.outingId ?? null,
      profile_id: profile?.id ?? null,
      referrer: request.headers.get("referer"),
      user_agent: request.headers.get("user-agent")
    });

    if (error) {
      logError("Failed to record partner referral click", error, { partner });
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true, recorded: true });
  } catch (error) {
    logError("partner-referral route failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
