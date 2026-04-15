"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { requireProfile } from "@/lib/auth";
import { logError } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const profile = await requireProfile();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const homeCity = String(formData.get("homeCity") ?? "").trim();
  const homeAirport = String(formData.get("homeAirport") ?? "").trim().toUpperCase();
  const handicap = String(formData.get("handicap") ?? "").trim();

  if (!fullName) {
    redirect("/settings?error=Name+is+required");
  }

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      redirect("/settings?error=Not+configured");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        home_city: homeCity || null,
        home_airport: homeAirport || null,
        handicap: handicap || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);

    if (error) {
      redirect(`/settings?error=${encodeURIComponent(error.message)}`);
    }

    // Also sync the name into Supabase auth metadata
    await supabase.auth.updateUser({ data: { full_name: fullName } });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logError("Profile update failed", error, { profileId: profile.id });
    redirect("/settings?error=Unable+to+save+profile");
  }

  revalidatePath("/settings");
  redirect("/settings?success=Profile+saved");
}

export async function updatePasswordAction(formData: FormData) {
  await requireProfile();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password !== confirm) {
    redirect("/settings?error=Passwords+do+not+match");
  }

  const errors: string[] = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/\d/.test(password)) errors.push("a number");
  if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/.test(password)) errors.push("a special character");

  if (errors.length > 0) {
    redirect(`/settings?error=${encodeURIComponent("Password must include " + errors.join(", "))}`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      redirect("/settings?error=Not+configured");
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      redirect(`/settings?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logError("Password update failed", error);
    redirect("/settings?error=Unable+to+update+password");
  }

  redirect("/settings?success=Password+updated");
}
