import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { isAdmin } from "@/modules/outings/permissions";

export const dynamic = "force-dynamic";

// Session probe for client components on statically rendered marketing pages.
// The header, CTAs, and LogRocket all read auth state from here instead of
// forcing every page into dynamic rendering via cookies().
export async function GET() {
  const profile = await getCurrentProfile();

  return NextResponse.json(
    {
      profile: profile
        ? {
            id: profile.id,
            email: profile.email,
            fullName: profile.fullName,
            isAdmin: isAdmin(profile)
          }
        : null,
      demoMode: isDemoMode
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
