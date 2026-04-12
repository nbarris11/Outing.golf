import type { CookieOptions } from "@supabase/ssr";

import { env } from "@/lib/env";

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

export function getSupabaseAuthStorageKey() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  return `sb-${new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0]}-auth-token`;
}

export function getSupabaseAuthCookieNames(names: string[], scope: "all" | "verifier" = "all") {
  const storageKey = getSupabaseAuthStorageKey();

  if (!storageKey) {
    return [];
  }

  const authPrefixes =
    scope === "verifier"
      ? [`${storageKey}-code-verifier`]
      : [storageKey, `${storageKey}-code-verifier`];

  return names.filter((name) =>
    authPrefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}.`))
  );
}

export function getExpiredSupabaseCookieOptions(host?: string | null, includeDomain = false): CookieOptions {
  const baseOptions = withSupabaseCookieOverrides({ maxAge: 0 }, host);

  if (!includeDomain) {
    const { domain, ...hostOnlyOptions } = baseOptions;
    return hostOnlyOptions;
  }

  return baseOptions;
}
