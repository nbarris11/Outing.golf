import { NextResponse } from "next/server";

import { requireProfile } from "@/lib/auth";
import { logError } from "@/lib/logger";
import {
  fetchAndCacheCoursePricing,
  getCachedCoursePricing
} from "@/modules/pricing/course-pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireProfile();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { name?: string; location?: string; forceRefresh?: boolean };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const location = payload.location?.trim() ?? "";
  if (!name || !location) {
    return NextResponse.json(
      { error: "name and location are required" },
      { status: 400 }
    );
  }

  try {
    if (!payload.forceRefresh) {
      const cached = await getCachedCoursePricing(name, location);
      if (cached) {
        return NextResponse.json({ pricing: cached, cached: true });
      }
    }

    const pricing = await fetchAndCacheCoursePricing(name, location);
    return NextResponse.json({ pricing, cached: false });
  } catch (error) {
    logError("Course pricing API failed", error, { name, location });
    return NextResponse.json({ error: "Pricing fetch failed" }, { status: 500 });
  }
}
