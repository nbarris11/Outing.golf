"use server";

import { redirect } from "next/navigation";

import { requireProfile } from "@/lib/auth";
import { runLiteApiSandboxTestSearch } from "@/lib/lodging/service";
import { updateContentBlock, toggleFeatureFlag, updateOptionFlags } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/modules/outings/permissions";

export async function updateContentBlockAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const key = String(formData.get("key") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim() || null;
  const ctaHref = String(formData.get("ctaHref") ?? "").trim() || null;

  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();

    await supabase?.from("content_blocks").upsert({
      key,
      title,
      body,
      cta_label: ctaLabel,
      cta_href: ctaHref
    });

    redirect("/admin?success=Content%20saved");
  }

  await updateContentBlock(key, { title, body, ctaLabel, ctaHref });
  redirect("/admin?success=Content%20saved");
}

export async function updateAdminSettingAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const key = String(formData.get("key") ?? "");
  let value: Record<string, unknown>;

  if (key === "site_profile") {
    value = {
      legalBusinessName: String(formData.get("legalBusinessName") ?? "").trim(),
      heroBadge: String(formData.get("heroBadge") ?? "").trim(),
      launchStatusLabel: String(formData.get("launchStatusLabel") ?? "").trim(),
      supportEmail: String(formData.get("supportEmail") ?? "").trim().toLowerCase(),
      footerTagline: String(formData.get("footerTagline") ?? "").trim()
    };
  } else if (key === "landing_page") {
    value = {
      painPointsTitle: String(formData.get("painPointsTitle") ?? "").trim(),
      painPointsBody: String(formData.get("painPointsBody") ?? "").trim(),
      painPoints: [1, 2, 3, 4].map((index) => String(formData.get(`painPoint${index}`) ?? "").trim()),
      stepsTitle: String(formData.get("stepsTitle") ?? "").trim(),
      steps: [1, 2, 3].map((index) => ({
        step: String(index),
        title: String(formData.get(`step${index}Title`) ?? "").trim(),
        body: String(formData.get(`step${index}Body`) ?? "").trim()
      })),
      outcomesTitle: String(formData.get("outcomesTitle") ?? "").trim(),
      outcomes: [1, 2, 3, 4].map((index) => ({
        title: String(formData.get(`outcome${index}Title`) ?? "").trim(),
        body: String(formData.get(`outcome${index}Body`) ?? "").trim()
      })),
      socialProofTitle: String(formData.get("socialProofTitle") ?? "").trim(),
      socialProofBody: String(formData.get("socialProofBody") ?? "").trim(),
      socialProofItems: [1, 2, 3, 4].map((index) =>
        String(formData.get(`socialProofItem${index}`) ?? "").trim()
      ),
      faqs: [1, 2, 3, 4].map((index) => ({
        question: String(formData.get(`faq${index}Question`) ?? "").trim(),
        answer: String(formData.get(`faq${index}Answer`) ?? "").trim()
      })),
      finalCtaEyebrow: String(formData.get("finalCtaEyebrow") ?? "").trim(),
      finalCtaTitle: String(formData.get("finalCtaTitle") ?? "").trim(),
      finalCtaBody: String(formData.get("finalCtaBody") ?? "").trim(),
      finalCtaLabel: String(formData.get("finalCtaLabel") ?? "").trim(),
      finalCtaHref: String(formData.get("finalCtaHref") ?? "").trim()
    };
  } else {
    redirect("/admin?success=Nothing%20changed");
  }

  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    await supabase?.from("admin_settings").upsert({ key, value });
    redirect("/admin?success=Settings%20saved");
  }

  redirect("/admin?success=Settings%20saved");
}

export async function toggleFeatureFlagAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const key = String(formData.get("key") ?? "");

  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase?.from("feature_flags").select("enabled").eq("key", key).maybeSingle() ?? {};
    await supabase
      ?.from("feature_flags")
      .update({ enabled: !(data?.enabled ?? false) })
      .eq("key", key);
    redirect("/admin?success=Feature%20updated");
  }

  await toggleFeatureFlag(key);
  redirect("/admin?success=Feature%20updated");
}

export async function toggleOptionFlagAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const collection = String(formData.get("collection") ?? "") as
    | "destinationOptions"
    | "golfCourseOptions"
    | "lodgingOptions";
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "") as "featured" | "hidden";

  if (!collection || !id || !field) {
    redirect("/admin?success=Nothing%20changed");
  }

  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    const tableName =
      collection === "destinationOptions"
        ? "destination_options"
        : collection === "golfCourseOptions"
          ? "golf_course_options"
          : "lodging_options";
    const result = await supabase?.from(tableName).select(field).eq("id", id).maybeSingle();
    const currentValue = Boolean((result?.data as Record<string, unknown> | null)?.[field]);
    await supabase?.from(tableName).update({ [field]: !currentValue }).eq("id", id);
    redirect("/admin?success=Option%20updated");
  }

  await updateOptionFlags({ collection, id, field });
  redirect("/admin?success=Option%20updated");
}

export async function setUserRoleAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const targetId = String(formData.get("targetId") ?? "").trim();
  const newRole = String(formData.get("newRole") ?? "").trim();

  if (!targetId || !["admin", "member"].includes(newRole)) {
    redirect("/admin/users?error=Invalid+request");
  }

  // Prevent self-demotion
  if (targetId === profile.id && newRole !== "admin") {
    redirect("/admin/users?error=You+cannot+remove+your+own+admin+role");
  }

  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    await supabase
      ?.from("profiles")
      .update({ app_role: newRole })
      .eq("id", targetId);
    redirect("/admin/users?success=Role+updated");
  }

  redirect("/admin/users?success=Role+updated");
}

export async function removeUserAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const targetId = String(formData.get("targetId") ?? "").trim();

  if (!targetId) {
    redirect("/admin/users?error=Invalid+request");
  }

  // Prevent self-deletion
  if (targetId === profile.id) {
    redirect("/admin/users?error=You+cannot+remove+your+own+account+from+here");
  }

  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    // Calls SECURITY DEFINER function — handles profile + auth.users deletion
    await supabase?.rpc("admin_delete_user", { target_user_id: targetId });
    redirect("/admin/users?success=User+removed");
  }

  redirect("/admin/users?success=User+removed");
}

export async function runLiteApiSandboxTestAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const destination = String(formData.get("destination") ?? "").trim();
  const checkIn = String(formData.get("checkIn") ?? "").trim();
  const checkOut = String(formData.get("checkOut") ?? "").trim();

  try {
    const resultCount = await runLiteApiSandboxTestSearch({
      destination,
      checkIn,
      checkOut
    });

    redirect(`/admin?success=${encodeURIComponent(`LiteAPI test returned ${resultCount} result${resultCount === 1 ? "" : "s"}`)}`);
  } catch (error) {
    redirect(`/admin?success=${encodeURIComponent(error instanceof Error ? error.message : "LiteAPI test failed")}`);
  }
}
