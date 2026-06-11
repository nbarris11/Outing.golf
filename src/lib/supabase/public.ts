import { createClient } from "@supabase/supabase-js";

import { env, isSupabaseConfigured, supabasePublicKey } from "@/lib/env";

/**
 * Cookie-less anon client for public reads (site settings, marketing content).
 * Unlike createSupabaseServerClient this never touches cookies()/headers(),
 * so pages that use it stay statically renderable.
 */
export function createSupabasePublicClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey!, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
