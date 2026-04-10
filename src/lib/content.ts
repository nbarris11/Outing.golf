import { getDemoState } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentBlock } from "@/types/domain";

function normalizeContentBlock(row: {
  key: string;
  title: string;
  body: string;
  cta_label?: string | null;
  cta_href?: string | null;
  updated_at?: string | null;
}): ContentBlock {
  return {
    key: row.key,
    title: row.title,
    body: row.body,
    ctaLabel: row.cta_label ?? null,
    ctaHref: row.cta_href ?? null,
    updatedAt: row.updated_at ?? new Date().toISOString()
  };
}

export async function getPublicContentBlocks(): Promise<ContentBlock[]> {
  if (isDemoMode) {
    const state = await getDemoState();
    return state.contentBlocks;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("content_blocks")
    .select("key,title,body,cta_label,cta_href,updated_at")
    .order("key");

  return (data ?? []).map(normalizeContentBlock);
}
