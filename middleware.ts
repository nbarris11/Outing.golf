import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

import { withSupabaseCookieOverrides } from "@/lib/supabase/cookie-options";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip if Supabase isn't configured (demo mode)
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, withSupabaseCookieOverrides(options, requestHost))
        );
      }
    }
  });

  // Refresh the session — must be called before any other logic.
  // This keeps the auth token valid and writes updated cookies to the response.
  //
  // Bounded on purpose: middleware runs on every request, so if this call ever
  // stalls (refresh-token contention, an auth hiccup) it takes the entire site
  // down with MIDDLEWARE_INVOCATION_TIMEOUT rather than one page. A missed
  // refresh is recoverable — the existing cookie still authenticates the request
  // and the next navigation retries — so we prefer serving the page.
  const REFRESH_TIMEOUT_MS = 3000;
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((resolve) => setTimeout(resolve, REFRESH_TIMEOUT_MS))
    ]);
  } catch {
    // Never let session refresh fail the request.
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and verification files
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)"
  ]
};
