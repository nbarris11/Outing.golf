import { redirect } from "next/navigation";

import { getDemoProfileById } from "@/lib/demo/store";
import { getDemoSessionProfileId } from "@/lib/demo/session";
import { adminEmails, isDemoMode } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

  const email = (user.email ?? "").toLowerCase();
  const configuredAdmin = adminEmails.includes(email);
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id,email,full_name,avatar_url,home_airport,home_city,handicap,app_role,created_at")
    .eq("id", user.id)
    .maybeSingle();

  const adminClient = createSupabaseAdminClient();
  let bootstrapAdmin = false;

  if (adminClient && !configuredAdmin && profileRow?.app_role !== "admin") {
    const { count } = await adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("app_role", "admin");

    bootstrapAdmin = (count ?? 0) === 0;
  }

  const desiredRole =
    configuredAdmin || profileRow?.app_role === "admin" || user.user_metadata.app_role === "admin" || bootstrapAdmin
      ? "admin"
      : "member";

  const fullName =
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email?.split("@")[0] ??
    "Outing User";

  if (adminClient && user.email) {
    const needsProfileSync =
      !profileRow ||
      profileRow.email !== user.email ||
      profileRow.full_name !== fullName ||
      (profileRow.avatar_url ?? null) !== (user.user_metadata.avatar_url ?? null) ||
      profileRow.app_role !== desiredRole;

    if (needsProfileSync) {
      await adminClient.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          avatar_url: user.user_metadata.avatar_url ?? null,
          app_role: desiredRole
        },
        { onConflict: "id" }
      );
    }
  }

  if (profileRow) {
    return {
      id: profileRow.id,
      email: profileRow.email,
      fullName: profileRow.full_name,
      avatarUrl: profileRow.avatar_url ?? null,
      homeAirport: profileRow.home_airport ?? null,
      homeCity: profileRow.home_city ?? null,
      handicap: profileRow.handicap ?? null,
      appRole: desiredRole,
      createdAt: profileRow.created_at
    };
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName,
    avatarUrl: user.user_metadata.avatar_url ?? null,
    appRole: desiredRole,
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
