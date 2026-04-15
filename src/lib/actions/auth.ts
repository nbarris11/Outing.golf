"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { getDemoProfileByEmail, createDemoUser } from "@/lib/demo/store";
import { clearDemoSession, setDemoSession } from "@/lib/demo/session";
import { isDemoMode, isProductionEnvironment, publicAppUrl } from "@/lib/env";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { logError } from "@/lib/logger";
import {
  getExpiredSupabaseCookieOptions,
  getSupabaseAuthCookieNames
} from "@/lib/supabase/cookie-options";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  let destination = next.startsWith("/") ? next : "/dashboard";

  if (!email) {
    redirect("/sign-in?error=Missing%20email");
  }

  const recaptchaOk = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaOk) {
    redirect("/sign-in?error=Security+check+failed.+Please+try+again.");
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
  const recaptchaToken = formData.get("recaptchaToken") as string | null;
  let destination = next.startsWith("/") ? next : "/dashboard";

  if (!email || !fullName) {
    redirect("/sign-up?error=Missing%20required%20fields");
  }

  const recaptchaOk = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaOk) {
    redirect("/sign-up?error=Security+check+failed.+Please+try+again.");
  }

  // Password strength validation (skip in demo mode)
  if (!isDemoMode) {
    const pwErrors: string[] = [];
    if (password.length < 8) pwErrors.push("at least 8 characters");
    if (!/\d/.test(password)) pwErrors.push("a number");
    if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/.test(password)) pwErrors.push("a special character");
    if (pwErrors.length > 0) {
      redirect(`/sign-up?error=${encodeURIComponent("Password must include " + pwErrors.join(", "))}`);
    }
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

export async function startGoogleSignInAction(formData: FormData) {
  const next = String(formData.get("next") ?? "").trim();
  const destination = next.startsWith("/") ? next : "/dashboard";

  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      redirect("/sign-in?error=Supabase%20not%20configured");
    }

    const headerStore = await headers();
    const cookieStore = await cookies();
    const forwardedHost = headerStore.get("x-forwarded-host");
    const requestHost = forwardedHost ?? headerStore.get("host");
    const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https";
    const requestOrigin =
      (requestHost ? `${forwardedProto}://${requestHost}` : null) ??
      headerStore.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://127.0.0.1:3000";
    const origin = isProductionEnvironment ? new URL(publicAppUrl).origin : requestOrigin;
    const cookieNames = getSupabaseAuthCookieNames(
      cookieStore.getAll().map((cookie) => cookie.name),
      "verifier"
    );

    for (const name of cookieNames) {
      cookieStore.set(name, "", getExpiredSupabaseCookieOptions(requestHost, false));
      cookieStore.set(name, "", getExpiredSupabaseCookieOptions(requestHost, true));
    }

    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(destination)}`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo
      }
    });

    if (error || !data?.url) {
      redirect(
        `/sign-in?error=${encodeURIComponent(error?.message ?? "Google sign-in could not start")}`
      );
    }

    redirect(data.url);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    logError("Google sign in failed", error, { destination });
    redirect("/sign-in?error=Unable%20to%20start%20Google%20sign-in");
  }
}
