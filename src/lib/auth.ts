import { redirect } from "next/navigation";

import { getDemoProfileById } from "@/lib/demo/store";
import { getDemoSessionProfileId } from "@/lib/demo/session";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

export async function getCurrentProfile(): Promise<Profile | null> {
  if (isDemoMode) {
    const profileId = await getDemoSessionProfileId();

    if (!profileId) {
      return null;
    }

    return getDemoProfileById(profileId);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: user.user_metadata.full_name ?? user.email ?? "Outing User",
    avatarUrl: user.user_metadata.avatar_url ?? null,
    appRole: user.user_metadata.app_role === "admin" ? "admin" : "member",
    createdAt: user.created_at ?? new Date().toISOString()
  };
}

export async function requireProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return profile;
}
