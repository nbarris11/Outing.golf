"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_PACKING_ITEMS } from "@/lib/trip/packing-defaults";

export async function seedPackingItemsAction(outingId: string) {
  if (isDemoMode) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  // Check if items already exist
  const { data: existing } = await supabase
    .from("trip_packing_items")
    .select("id")
    .eq("outing_id", outingId)
    .limit(1);

  if (existing && existing.length > 0) {
    return;
  }

  const items = DEFAULT_PACKING_ITEMS.map((label, index) => ({
    outing_id: outingId,
    label,
    is_default: true,
    sort_order: index
  }));

  await supabase.from("trip_packing_items").insert(items);

  revalidatePath(`/outings/${outingId}/trip`);
}

export async function togglePackingItemAction(itemId: string, outingId: string) {
  if (isDemoMode) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const profile = await requireProfile();

  const { data: item } = await supabase
    .from("trip_packing_items")
    .select("id, checked_by")
    .eq("id", itemId)
    .maybeSingle();

  if (!item) return;

  if (item.checked_by) {
    // Uncheck
    await supabase
      .from("trip_packing_items")
      .update({ checked_by: null, checked_at: null })
      .eq("id", itemId);
  } else {
    // Check
    await supabase
      .from("trip_packing_items")
      .update({ checked_by: profile.id, checked_at: new Date().toISOString() })
      .eq("id", itemId);
  }

  revalidatePath(`/outings/${outingId}/trip`);
}

export async function addPackingItemAction(formData: FormData) {
  if (isDemoMode) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const label = formData.get("label");
  const outingId = formData.get("outingId");

  if (typeof label !== "string" || !label.trim() || typeof outingId !== "string") return;

  await supabase.from("trip_packing_items").insert({
    outing_id: outingId,
    label: label.trim(),
    is_default: false,
    sort_order: 999
  });

  revalidatePath(`/outings/${outingId}/trip`);
}

export async function removePackingItemAction(itemId: string, outingId: string) {
  if (isDemoMode) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  await supabase
    .from("trip_packing_items")
    .delete()
    .eq("id", itemId)
    .eq("is_default", false);

  revalidatePath(`/outings/${outingId}/trip`);
}
