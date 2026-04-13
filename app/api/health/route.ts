import { NextResponse } from "next/server";

import {
  appEnvironment,
  env,
  environmentLabel,
  isDemoMode,
  isSupabaseConfigured,
  productionAppUrl
} from "@/lib/env";

async function testGooglePlaces(): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
  resultCount?: number;
}> {
  if (!env.GOOGLE_MAPS_API_KEY) {
    return { ok: false, error: "GOOGLE_MAPS_API_KEY not set" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName.text"
      },
      body: JSON.stringify({ textQuery: "Pebble Beach, CA", pageSize: 1 }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: (body as any)?.error?.message ?? `HTTP ${response.status}`
      };
    }

    const places = (body as any)?.places ?? [];
    return { ok: true, status: response.status, resultCount: places.length };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.name === "AbortError" ? "Request timed out after 5 s" : String(err?.message ?? err)
    };
  }
}

export async function GET() {
  const googlePlaces = await testGooglePlaces();

  return NextResponse.json({
    ok: true,
    app: "outing.golf",
    environment: appEnvironment,
    environmentLabel,
    demoMode: isDemoMode,
    supabaseConfigured: isSupabaseConfigured,
    productionAppUrl,
    providers: {
      destination: process.env.OUTING_DESTINATION_PROVIDER ?? "mock",
      golfCourse: process.env.OUTING_GOLF_COURSE_PROVIDER ?? "mock",
      lodging: process.env.OUTING_LODGING_PROVIDER ?? "mock",
      teeTime: process.env.OUTING_TEE_TIME_PROVIDER ?? "mock",
      vacationRental: process.env.OUTING_VACATION_RENTAL_PROVIDER ?? "mock"
    },
    connectivity: {
      googlePlaces
    },
    timestamp: new Date().toISOString()
  });
}
