import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/env", () => ({
  isDemoMode: false,
  publicAppUrl: "https://www.outing.golf",
}));
vi.mock("@/lib/supabase/admin", () => ({ createSupabaseAdminClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));
import { resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
describe("production invite tokens", () => {
  it("rejects demo-format tokens outside demo mode", async () => {
    expect(
      await resolveOutingIdFromShareToken("demo-share-known-trip-id"),
    ).toBeNull();
  });
});
