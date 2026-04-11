import { randomUUID } from "node:crypto";

import { deploymentUrl, isDemoMode } from "@/lib/env";
import { logError } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const DEMO_PREFIX = "demo-share-";

function buildDemoToken(outingId: string) {
  return `${DEMO_PREFIX}${outingId}`;
}

export function buildShareLinkPath(token: string) {
  return `/join/${token}`;
}

export function buildAbsoluteShareLink(token: string) {
  return `${deploymentUrl}${buildShareLinkPath(token)}`;
}

export async function createOrGetOutingShareToken(outingId: string, createdBy: string) {
  if (isDemoMode) {
    return buildDemoToken(outingId);
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return null;
  }

  try {
    const { data: existing } = await adminClient
      .from("outing_share_links")
      .select("token")
      .eq("outing_id", outingId)
      .maybeSingle();

    if (existing?.token) {
      return existing.token as string;
    }

    const token = randomUUID();
    const { error } = await adminClient.from("outing_share_links").insert({
      outing_id: outingId,
      token,
      created_by: createdBy
    });

    if (error) {
      throw error;
    }

    return token;
  } catch (error) {
    logError("Failed to create or load outing share token", error, { outingId, createdBy });
    return null;
  }
}

export async function getOutingShareLink(outingId: string, createdBy: string) {
  const token = await createOrGetOutingShareToken(outingId, createdBy);
  return token ? buildAbsoluteShareLink(token) : null;
}

export function parseDemoShareToken(token: string) {
  return token.startsWith(DEMO_PREFIX) ? token.slice(DEMO_PREFIX.length) : null;
}

export async function resolveOutingIdFromShareToken(token: string) {
  const demoOutingId = parseDemoShareToken(token);

  if (demoOutingId) {
    return demoOutingId;
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return null;
  }

  try {
    const { data } = await adminClient
      .from("outing_share_links")
      .select("outing_id")
      .eq("token", token)
      .maybeSingle();

    return (data?.outing_id as string | undefined) ?? null;
  } catch (error) {
    logError("Failed to resolve outing share token", error, { token });
    return null;
  }
}
