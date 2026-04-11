import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";

  if (!next.startsWith("/")) {
    next = "/dashboard";
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
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectBase = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;
  const successUrl = `${redirectBase}${next}`;

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
          response.cookies.set(name, value, options ?? {});
        });
      }
    }
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent("Sign-in failed: " + error.message)}`
    );
  }

  // Verify a session was actually returned — if not, surface it clearly
  if (!data?.session) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent("Sign-in completed but no session was created. Please try again.")}`
    );
  }

  return response;
}
