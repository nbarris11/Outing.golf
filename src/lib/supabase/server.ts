import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

import { env, isSupabaseConfigured, supabasePublicKey } from "@/lib/env";
import { withSupabaseCookieOverrides } from "@/lib/supabase/cookie-options";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const requestHost =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    new URL(env.NEXT_PUBLIC_APP_URL).host;

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookieEntries: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>
      ) {
        cookieEntries.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, withSupabaseCookieOverrides(options, requestHost));
          } catch {
            // Server Components can read cookies but cannot mutate them during render.
            // Ignore write attempts here so public pages can safely use the shared client.
          }
        });
      }
    }
  });
}
