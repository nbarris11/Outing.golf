import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth";
import { logError } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Destinations are hardcoded so the GET redirect can never be pointed at an
// arbitrary URL by query string.
const PARTNER_URLS: Record<string, string> = {
  pin_seeker: "https://www.pinseekercompetitions.com/outing?ref=outinggolf"
};

const PLACEMENTS = new Set(["trip_hq", "planning", "confirmation_email"]);

async function record(input: {
  partner: string;
  placement: string | null;
  outingId: string | null;
  request: Request;
  /** Email clients prefetch links, so GET hits carry no auth session. */
  withProfile: boolean;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return false;

  const profile = input.withProfile ? await getCurrentProfile() : null;

  const { error } = await supabase.from("partner_referral_clicks").insert({
    partner: input.partner,
    placement: input.placement,
    outing_id: input.outingId,
    profile_id: profile?.id ?? null,
    referrer: input.request.headers.get("referer"),
    user_agent: input.request.headers.get("user-agent")
  });

  if (error) {
    logError("Failed to record partner referral click", error, { partner: input.partner });
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { partner?: string; placement?: string; outingId?: string }
      | null;

    const partner = body?.partner;
    if (!partner || !PARTNER_URLS[partner]) {
      return NextResponse.json({ error: "Unknown partner" }, { status: 400 });
    }

    const placement = body?.placement && PLACEMENTS.has(body.placement) ? body.placement : null;

    const recorded = await record({
      partner,
      placement,
      outingId: body?.outingId ?? null,
      request,
      withProfile: true
    });

    return NextResponse.json({ ok: true, recorded });
  } catch (error) {
    logError("partner-referral POST failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Used by the trip confirmation email, where JS can't run: log the click, then
// forward to the partner. Always redirects, even if logging fails.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const partner = url.searchParams.get("partner") ?? "";
  const destination = PARTNER_URLS[partner];

  if (!destination) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const placementParam = url.searchParams.get("placement");
    await record({
      partner,
      placement: placementParam && PLACEMENTS.has(placementParam) ? placementParam : null,
      outingId: url.searchParams.get("outingId"),
      request,
      withProfile: false
    });
  } catch (error) {
    logError("partner-referral GET failed", error, { partner });
  }

  return NextResponse.redirect(destination);
}
