import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env, isSupabaseConfigured, supabasePublicKey } from "@/lib/env";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const cookieStore = await cookies();

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
            cookieStore.set(name, value, { path: "/", ...(options ?? {}) });
          } catch {
            // Server Components can read cookies but cannot mutate them during render.
            // Ignore write attempts here so public pages can safely use the shared client.
          }
        });
      }
    }
  });
}
