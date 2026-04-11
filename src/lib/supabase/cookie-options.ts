import type { CookieOptions } from "@supabase/ssr";

const SHARED_PRODUCTION_AUTH_DOMAIN = ".outing.golf";

function normalizeHost(host?: string | null) {
  return host?.split(":")[0].trim().toLowerCase() ?? null;
}

export function getSupabaseCookieOverrides(host?: string | null): CookieOptions {
  const normalizedHost = normalizeHost(host);
  const useSharedProductionDomain =
    normalizedHost === "outing.golf" || normalizedHost === "www.outing.golf";

  return {
    path: "/",
    ...(useSharedProductionDomain
      ? {
          domain: SHARED_PRODUCTION_AUTH_DOMAIN,
          secure: true
        }
      : {})
  };
}

export function withSupabaseCookieOverrides(
  options?: CookieOptions | Record<string, unknown>,
  host?: string | null
) {
  return {
    ...(options ?? {}),
    ...getSupabaseCookieOverrides(host)
  };
}
