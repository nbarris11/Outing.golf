// @vitest-environment-options {"url":"https://www.outing.golf"}
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { getSuccessMilestones, isInternalProfile, type FunnelContext } from "@/lib/analytics/funnel";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("logrocket", () => ({ default: { track } }));

const context: FunnelContext = { outingId: "outing-1", actorId: "person-1", actorRole: "participant", excluded: false };
const now = Date.parse("2026-09-18T12:00:00Z");
const recent = "2026-09-18T11:59:00Z";
const old = "2026-09-01T12:00:00Z";

// Explicit browser storage double also avoids Node 25's unrelated global Web Storage.
function browserStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); }
  };
}

describe("persisted success milestones", () => {
  it("counts only a recent creation by its organizer", () => {
    const input = { isPrimaryOrganizer: true, createdAt: recent, notices: { created: "1" } };
    expect(getSuccessMilestones(input, now)).toEqual(["outing_created"]);
    expect(getSuccessMilestones({ ...input, createdAt: old }, now)).toEqual([]);
    expect(getSuccessMilestones({ ...input, isPrimaryOrganizer: false }, now)).toEqual([]);
  });
  it("requires a membership record for both join paths", () => {
    const input = { isPrimaryOrganizer: false, createdAt: old, joinedAt: recent, notices: { newMember: "1" } };
    expect(getSuccessMilestones(input, now)).toEqual(["outing_joined"]);
    expect(getSuccessMilestones({ ...input, notices: { success: "You joined the outing" } }, now)).toEqual(["outing_joined"]);
    expect(getSuccessMilestones({ ...input, joinedAt: undefined }, now)).toEqual([]);
    expect(getSuccessMilestones({ ...input, joinedAt: old }, now)).toEqual([]);
  });
  it("requires a saved preference, not just a confirmation query string", () => {
    const input = { isPrimaryOrganizer: false, createdAt: old, joinedAt: old, notices: { confirmed: "1" } };
    expect(getSuccessMilestones(input, now)).toEqual([]);
    expect(getSuccessMilestones({ ...input, preferenceUpdatedAt: recent }, now)).toEqual(["outing_preferences_submitted"]);
    expect(getSuccessMilestones({ ...input, preferenceUpdatedAt: recent, notices: { success: "Preferences saved" } }, now)).toEqual(["outing_preferences_submitted"]);
    expect(getSuccessMilestones({ ...input, preferenceUpdatedAt: recent, isPrimaryOrganizer: true }, now)).toEqual([]);
    expect(getSuccessMilestones({ ...input, preferenceUpdatedAt: recent, notices: { confirmed: "1", error: "Failed" } }, now)).toEqual([]);
  });
  it("does not backfill events on ordinary page views", () => {
    expect(getSuccessMilestones({ isPrimaryOrganizer: false, createdAt: recent, joinedAt: recent, preferenceUpdatedAt: recent, notices: {} }, now)).toEqual([]);
  });
});

describe("internal activity classification", () => {
  it("excludes admins, reserved test domains, and explicitly listed accounts", () => {
    expect(isInternalProfile({ email: "founder@outing.golf", appRole: "admin" })).toBe(true);
    expect(isInternalProfile({ email: "QA@example.com" })).toBe(true);
    expect(isInternalProfile({ email: "person@company.test" })).toBe(true);
    expect(isInternalProfile({ email: "Internal@gmail.com" }, ["internal@gmail.com"])).toBe(true);
  });
  it("does not guess from personal names or normal email addresses", () => {
    expect(isInternalProfile({ email: "testa@gmail.com", appRole: "member" })).toBe(false);
    expect(isInternalProfile(null)).toBe(false);
  });
});

describe("browser event delivery", () => {
  beforeEach(() => {
    vi.resetModules();
    track.mockReset();
    vi.stubGlobal("localStorage", browserStorage());
    vi.stubGlobal("sessionStorage", browserStorage());
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_LOGROCKET_ENABLED", "true");
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("waits for SDK initialization and deduplicates repeated effects", async () => {
    const client = await import("@/lib/analytics/funnel-client");
    client.trackFunnel("outing_joined", context);
    client.trackFunnel("outing_joined", context);
    expect(track).not.toHaveBeenCalled();
    client.markFunnelReady();
    expect(track).toHaveBeenCalledTimes(1);
  });
  it("deduplicates milestones across reloads but separates participants", async () => {
    let client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    client.trackFunnel("outing_preferences_submitted", context);
    vi.resetModules();
    client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    client.trackFunnel("outing_preferences_submitted", context);
    client.trackFunnel("outing_preferences_submitted", { ...context, actorId: "person-2" });
    expect(track).toHaveBeenCalledTimes(2);
  });
  it("does not double-count invitation opens after sign-in", async () => {
    const client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    client.trackFunnel("outing_invite_opened", { ...context, actorId: undefined, actorRole: "visitor" });
    client.trackFunnel("outing_invite_opened", context);
    expect(track).toHaveBeenCalledTimes(1);
  });
  it("excludes internal activity and obeys analytics/development switches", async () => {
    const client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    client.trackFunnel("outing_joined", { ...context, excluded: true });
    vi.stubEnv("NEXT_PUBLIC_LOGROCKET_ENABLED", "false");
    client.trackFunnel("outing_joined", context);
    vi.stubEnv("NEXT_PUBLIC_LOGROCKET_ENABLED", "true");
    vi.stubEnv("NODE_ENV", "development");
    client.trackFunnel("outing_joined", context);
    expect(track).not.toHaveBeenCalled();
  });
  it("survives blocked storage and SDK failure without marking a failed event", async () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => { throw Error("blocked"); });
    const client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    track.mockImplementationOnce(() => { throw Error("offline"); });
    expect(() => client.trackFunnel("outing_joined", context)).not.toThrow();
    client.trackFunnel("outing_joined", context);
    client.trackFunnel("outing_joined", context);
    expect(track).toHaveBeenCalledTimes(2);
  });
  it("allows repeated share attempts and emits only allowlisted properties", async () => {
    const client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    const props = { method: "sms_opened" as const, placement: "organizer_banner" as const, token: "SECRET", email: "private@example.com" };
    client.trackFunnel("outing_share_action", context, props);
    client.trackFunnel("outing_share_action", context, props);
    expect(track).toHaveBeenCalledTimes(2);
    expect(track.mock.calls[0][1]).toEqual({ funnel_version: "activation_v1", outing_id: "outing-1", actor_id: "person-1", actor_role: "participant", method: "sms_opened", placement: "organizer_banner" });
  });
  it("never emits from preview hosts", async () => {
    const client = await import("@/lib/analytics/funnel-client");
    client.markFunnelReady();
    vi.stubGlobal("window", { location: { hostname: "outing-golf-preview.vercel.app" } });
    client.trackFunnel("outing_joined", context);
    expect(track).not.toHaveBeenCalled();
  });
});
