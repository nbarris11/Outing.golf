import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

import { isProductionEnvironment, publicAppUrl } from "@/lib/env";
import { logError } from "@/lib/logger";
import { withSupabaseCookieOverrides } from "@/lib/supabase/cookie-options";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/dashboard";
  const destination = next.startsWith("/") ? next : "/dashboard";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      new URL("/sign-in?error=Supabase%20not%20configured", request.url)
    );
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestHost = forwardedHost ?? request.headers.get("host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = !isLocalEnv
    ? new URL(publicAppUrl).origin
    : requestHost
      ? `https://${requestHost}`
      : new URL(request.url).origin;

  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(destination)}`;

  // Collect cookies that Supabase wants to set (the PKCE code verifier).
  // We apply them directly to the redirect response so the browser receives them
  // in the same round-trip — no Server Action cookie propagation issues.
  const pendingCookies: Array<{ name: string; value: string; options: CookieOptions }> = [];

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({
            name,
            value,
            options: withSupabaseCookieOverrides(options, requestHost) as CookieOptions
          });
        });
      }
    }
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });

  if (error || !data?.url) {
    logError("Google sign-in initiation failed", error, { destination });
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent(error?.message ?? "Google sign-in could not start")}`,
        request.url
      )
    );
  }

  // Redirect to Google with the verifier cookie attached to the response.
  const response = NextResponse.redirect(data.url);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
