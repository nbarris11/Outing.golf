import { NextResponse } from "next/server";

import {
  appEnvironment,
  environmentLabel,
  isDemoMode,
  isSupabaseConfigured,
  productionAppUrl
} from "@/lib/env";

export async function GET() {
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
    timestamp: new Date().toISOString()
  });
}
