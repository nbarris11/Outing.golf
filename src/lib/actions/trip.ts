"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_GROUP_PACKING_ITEMS, DEFAULT_PACKING_ITEMS } from "@/lib/trip/packing-defaults";

// ── Seeding ───────────────────────────────────────────────────────────────────

/**
 * Seeds default packing items as PERSONAL items for the given user.
 * Safe to call during server component render (no revalidatePath).
 * Only seeds if the user has no personal items yet for this outing.
 */
async function seedPersonalPackingItems(outingId: string, profileId: string) {
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("trip_packing_items")
    .select("id")
    .eq("outing_id", outingId)
    .eq("profile_id", profileId)
    .limit(1);

  if (existing && existing.length > 0) return;

  const items = DEFAULT_PACKING_ITEMS.map((label, index) => ({
    outing_id: outingId,
    profile_id: profileId,
    label,
    is_default: true,
    sort_order: index
  }));

  const { error } = await supabase.from("trip_packing_items").insert(items);
  if (error) console.error("[seedPersonalPackingItems]", error);
}

/**
 * Seeds default GROUP items once per outing (profile_id = null).
 * Only runs if no group items exist yet for this outing.
 */
async function seedGroupPackingItems(outingId: string) {
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("trip_packing_items")
    .select("id")
    .eq("outing_id", outingId)
    .is("profile_id", null)
    .limit(1);

  if (existing && existing.length > 0) return;

  const items = DEFAULT_GROUP_PACKING_ITEMS.map((label, index) => ({
    outing_id: outingId,
    profile_id: null,
    label,
    is_default: true,
    sort_order: index
  }));

  const { error } = await supabase.from("trip_packing_items").insert(items);
  if (error) console.error("[seedGroupPackingItems]", error);
}

export { seedPersonalPackingItems, seedGroupPackingItems };

// Server action wrapper (called from client components)
export async function seedPackingItemsAction(outingId: string) {
  if (isDemoMode) return;
  const profile = await requireProfile();
  await Promise.all([
    seedPersonalPackingItems(outingId, profile.id),
    seedGroupPackingItems(outingId)
  ]);
  revalidatePath(`/outings/${outingId}/trip`);
}

// ── Toggle check ──────────────────────────────────────────────────────────────

export async function togglePackingItemAction(itemId: string, outingId: string) {
  if (isDemoMode) return;

  const profile = await requireProfile();
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) return;

  const { data: item } = await supabase
    .from("trip_packing_items")
    .select("id, checked_by")
    .eq("id", itemId)
    .maybeSingle();

  if (!item) return;

  const { error } = item.checked_by
    ? await supabase
        .from("trip_packing_items")
        .update({ checked_by: null, checked_at: null })
        .eq("id", itemId)
    : await supabase
        .from("trip_packing_items")
        .update({ checked_by: profile.id, checked_at: new Date().toISOString() })
        .eq("id", itemId);

  if (error) console.error("[togglePackingItemAction]", error);

  revalidatePath(`/outings/${outingId}/trip`);
}

// ── Add item ──────────────────────────────────────────────────────────────────

export async function addPackingItemAction(formData: FormData) {
  if (isDemoMode) return;

  const profile = await requireProfile();
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) return;

  const label = formData.get("label");
  const outingId = formData.get("outingId");
  const section = formData.get("section"); // "personal" | "group"

  if (typeof label !== "string" || !label.trim() || typeof outingId !== "string") return;

  const { error } = await supabase.from("trip_packing_items").insert({
    outing_id: outingId,
    profile_id: section === "group" ? null : profile.id,
    label: label.trim(),
    is_default: false,
    sort_order: 999
  });

  if (error) console.error("[addPackingItemAction]", error);

  revalidatePath(`/outings/${outingId}/trip`);
}

// ── Remove item ───────────────────────────────────────────────────────────────

export async function removePackingItemAction(itemId: string, outingId: string) {
  if (isDemoMode) return;

  await requireProfile();
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) return;

  // RLS ensures users can only delete their own personal items or organizer deletes shared
  const { error } = await supabase
    .from("trip_packing_items")
    .delete()
    .eq("id", itemId);

  if (error) console.error("[removePackingItemAction]", error);

  revalidatePath(`/outings/${outingId}/trip`);
}
