"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { getDemoProfileByEmail, createDemoUser } from "@/lib/demo/store";
import { clearDemoSession, setDemoSession } from "@/lib/demo/session";
import { isDemoMode } from "@/lib/env";
import { logError } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();
  let destination = next.startsWith("/") ? next : "/dashboard";

  if (!email) {
    redirect("/sign-in?error=Missing%20email");
  }

  try {
    if (isDemoMode) {
      const profile = await getDemoProfileByEmail(email);

      if (!profile) {
        redirect("/sign-in?error=Demo%20account%20not%20found");
      }

      await setDemoSession(profile.id);
      return redirect(destination);
    }

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      redirect("/sign-in?error=Supabase%20not%20configured");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Sign in failed", error, { email });
    redirect("/sign-in?error=Unable%20to%20sign%20in");
  }

  redirect(destination);
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const next = String(formData.get("next") ?? "").trim();
  let destination = next.startsWith("/") ? next : "/dashboard";

  if (!email || !fullName) {
    redirect("/sign-up?error=Missing%20required%20fields");
  }

  try {
    if (isDemoMode) {
      const profile = await createDemoUser(email, fullName);
      await setDemoSession(profile.id);
      return redirect(destination);
    }

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      redirect("/sign-up?error=Supabase%20not%20configured");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
    }

    if (!data.session) {
      redirect(
        `/sign-in?next=${encodeURIComponent(destination)}&notice=${encodeURIComponent(
          "Check your email to confirm your account, then sign in to join the outing."
        )}`
      );
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Sign up failed", error, { email });
    redirect("/sign-up?error=Unable%20to%20create%20account");
  }

  redirect(destination);
}

export async function signOutAction() {
  if (isDemoMode) {
    await clearDemoSession();
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/");
}
