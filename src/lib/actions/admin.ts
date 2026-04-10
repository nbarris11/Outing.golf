"use server";

import { redirect } from "next/navigation";

import { requireProfile } from "@/lib/auth";
import { updateContentBlock, toggleFeatureFlag, updateOptionFlags } from "@/lib/demo/store";
import { isAdmin } from "@/modules/outings/permissions";

export async function updateContentBlockAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const key = String(formData.get("key") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");

  await updateContentBlock(key, { title, body });
  redirect("/admin?success=Content%20saved");
}

export async function toggleFeatureFlagAction(formData: FormData) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const key = String(formData.get("key") ?? "");
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

  await updateOptionFlags({ collection, id, field });
  redirect("/admin?success=Option%20updated");
}
