import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

import { publicAppUrl } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";
import {
  getExpiredSupabaseCookieOptions,
  getSupabaseAuthCookieNames,
  withSupabaseCookieOverrides
} from "@/lib/supabase/cookie-options";

function clearSupabaseVerifierCookies(response: NextResponse, request: NextRequest, requestHost?: string | null) {
  const cookieNames = getSupabaseAuthCookieNames(
    request.cookies.getAll().map((cookie) => cookie.name),
    "verifier"
  );

  for (const name of cookieNames) {
    response.cookies.set(name, "", getExpiredSupabaseCookieOptions(requestHost, false));
    response.cookies.set(name, "", getExpiredSupabaseCookieOptions(requestHost, true));
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const providerError = searchParams.get("error_description") ?? searchParams.get("error");
  let next = searchParams.get("next") ?? "/dashboard";

  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (providerError && !code) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent("Google sign-in failed: " + providerError)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent("Missing Google auth code")}`
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent("Supabase is not configured")}`
    );
  }

  // Determine the destination URL before creating the response so we can
  // attach the session cookies directly onto the redirect response.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestHost = forwardedHost ?? request.headers.get("host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectBase = !isLocalEnv ? new URL(publicAppUrl).origin : requestHost ? `https://${requestHost}` : origin;
  const successUrl = `${redirectBase}${next}`;

  logInfo("Google callback received", {
    host: requestHost,
    hasCode: Boolean(code),
    providerError: providerError ?? null,
    next
  });

  // Create the redirect response first — cookies must be attached to THIS response
  // so the browser receives them along with the redirect. Using cookies() from
  // next/headers and returning a separate NextResponse drops the session.
  const response = NextResponse.redirect(successUrl);

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, withSupabaseCookieOverrides(options, requestHost));
        });
      }
    }
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const isPkceError =
      error.message.toLowerCase().includes("code verifier") ||
      error.message.toLowerCase().includes("code_challenge") ||
      error.message.toLowerCase().includes("code challenge");

    logError("Google callback exchange failed", error, {
      host: requestHost,
      next,
      isPkceError
    });

    // PKCE verifier mismatch — the code verifier cookie was lost during the
    // Google redirect (common on mobile Safari / ITP). Clear the stale cookie
    // and silently re-initiate Google sign-in so the user never sees an error.
    // We append _r=1 so that if it fails a second time we don't loop forever.
    if (isPkceError) {
      const alreadyRetried = searchParams.get("_r") === "1";
      const retryTarget = alreadyRetried
        ? NextResponse.redirect(
            `${redirectBase}/sign-in?notice=${encodeURIComponent("Your sign-in session expired — please try again.")}&next=${encodeURIComponent(next)}`
          )
        : NextResponse.redirect(
            `${redirectBase}/api/auth/google?next=${encodeURIComponent(next)}&_r=1`
          );
      clearSupabaseVerifierCookies(retryTarget, request, requestHost);
      return retryTarget;
    }

    const errorResponse = NextResponse.redirect(
      `${redirectBase}/sign-in?error=${encodeURIComponent("Sign-in failed: " + error.message)}`
    );
    clearSupabaseVerifierCookies(errorResponse, request, requestHost);
    return errorResponse;
  }

  // Verify a session was actually returned — if not, surface it clearly
  if (!data?.session) {
    const errorResponse = NextResponse.redirect(
      `${redirectBase}/sign-in?error=${encodeURIComponent("Sign-in completed but no session was created. Please try again.")}`
    );
    clearSupabaseVerifierCookies(errorResponse, request, requestHost);

    logError("Google callback completed without a session", "No session returned", {
      host: requestHost,
      next
    });
    return errorResponse;
  }

  logInfo("Google callback session created", {
    host: requestHost,
    next,
    userId: data.session.user.id
  });

  return response;
}
