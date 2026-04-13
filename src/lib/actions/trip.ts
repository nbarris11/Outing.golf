"use server";

import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_PACKING_ITEMS } from "@/lib/trip/packing-defaults";

// Called from server actions only (not during page render)
export async function seedPackingItemsAction(outingId: string) {
  if (isDemoMode) return;
  await seedPackingItemsIfEmpty(outingId);
  revalidatePath(`/outings/${outingId}/trip`);
}

// Plain async function safe to call during server component render
async function seedPackingItemsIfEmpty(outingId: string) {
  const supabase = createSupabaseAdminClient(); // bypasses RLS
  if (!supabase) return;

  const { data: existing } = await supabase
    .from("trip_packing_items")
    .select("id")
    .eq("outing_id", outingId)
    .limit(1);

  if (existing && existing.length > 0) return;

  const items = DEFAULT_PACKING_ITEMS.map((label, index) => ({
    outing_id: outingId,
    label,
    is_default: true,
    sort_order: index
  }));

  await supabase.from("trip_packing_items").insert(items);
}

// Exported for direct use from server components (no revalidatePath)
export { seedPackingItemsIfEmpty };

export async function togglePackingItemAction(itemId: string, outingId: string) {
  if (isDemoMode) return;

  const profile = await requireProfile();
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

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

  await requireProfile(); // verify authenticated
  const supabase = createSupabaseAdminClient();
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

  await requireProfile(); // verify authenticated
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  await supabase
    .from("trip_packing_items")
    .delete()
    .eq("id", itemId)
    .eq("is_default", false);

  revalidatePath(`/outings/${outingId}/trip`);
}
