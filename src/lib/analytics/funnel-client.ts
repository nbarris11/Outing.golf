"use client";

import LogRocket from "logrocket";
import type { FunnelContext, FunnelEvent, FunnelProperties } from "@/lib/analytics/funnel";

const VERSION = "activation_v1";
const STORAGE_KEY = "outing:funnel:v1";
const memory = new Set<string>();
let ready = false;
const pending: (() => void)[] = [];

export function markFunnelReady() {
  ready = true;
  pending.splice(0).forEach((send) => send());
}

export function trackFunnel(event: FunnelEvent, context: FunnelContext, properties: FunnelProperties = {}) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_LOGROCKET_ENABLED === "false" || context.excluded ||
      !["outing.golf", "www.outing.golf"].includes(window.location.hostname)) return;

  const send = () => {
    const once = event !== "outing_share_action";
    // Invite opens dedupe across the anonymous -> signed-in return in one tab.
    const key = `${event}:${context.outingId}:${event === "outing_invite_opened" ? "visitor" : context.actorId ?? "anonymous"}`;
    let storage: Storage | undefined;
    let stored: string[] = [];
    if (once) {
      if (memory.has(key)) return;
      try {
        storage = event === "outing_invite_opened" ? window.sessionStorage : window.localStorage;
        const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
        stored = Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
        if (stored.includes(key)) return;
      } catch { /* Privacy settings must never break the app. */ }
    }
    try {
      // Explicit allowlist: never send names, email, invite tokens/URLs, or form values.
      LogRocket.track(event, {
        funnel_version: VERSION,
        outing_id: context.outingId,
        actor_id: context.actorId ?? "anonymous",
        actor_role: context.actorRole,
        ...(properties.method ? { method: properties.method } : {}),
        ...(properties.placement ? { placement: properties.placement } : {}),
        ...(once ? { event_key: key } : {})
      });
      if (once) {
        memory.add(key);
        if (memory.size > 512) memory.delete(memory.values().next().value!);
        try { storage?.setItem(STORAGE_KEY, JSON.stringify([...stored, key].slice(-512))); } catch { /* best effort */ }
      }
    } catch { /* Analytics must never interrupt sharing or onboarding. */ }
  };
  if (ready) send();
  else if (pending.length < 100) pending.push(send);
}
