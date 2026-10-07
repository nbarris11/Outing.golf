import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  detail: vi.fn(),
  save: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({
  requireProfile: async () => ({ id: "guest" }),
}));
vi.mock("@/lib/env", () => ({ isDemoMode: true }));
vi.mock("@/modules/outings/service", () => ({ getOutingDetail: mocks.detail }));
vi.mock("@/lib/demo/store", () => ({ upsertDemoPreference: mocks.save }));
vi.mock("@/lib/supabase/admin", () => ({ createSupabaseAdminClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { saveGuestResponse } from "@/lib/actions/guest-response";
import { responseLabel } from "@/lib/guest-response";
const input = {
  responseStatus: "in",
  budgetMin: 800,
  budgetMax: 1200,
  availableDates: ["2027-04-16"],
  comments: "",
  walkingPreference: "either",
  preferredRounds: null,
  lodgingPreferences: [],
};
const outing = {
  preferredDateWindows: [{ start: "2027-04-16", end: "2027-04-19" }],
  confirmedDateWindow: null,
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.detail.mockResolvedValue({
    outing,
    currentPreference: {
      courseQualityPreference: 8,
      destinationVotes: ["dest"],
      homeCity: "Detroit",
    },
  });
});
describe("guest response saving", () => {
  it("requires trip access before saving", async () => {
    mocks.detail.mockResolvedValue(null);
    await expect(saveGuestResponse("trip", input)).resolves.toEqual({
      error: expect.stringContaining("access"),
    });
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("does not accept I'm in without a proposed weekend", async () => {
    await expect(
      saveGuestResponse("trip", { ...input, availableDates: [] }),
    ).resolves.toEqual({
      error: expect.stringContaining("Choose at least one"),
    });
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("allows an explicit maybe without confirming dates", async () => {
    await saveGuestResponse("trip", {
      ...input,
      responseStatus: "maybe",
      availableDates: [],
    });
    expect(mocks.save).toHaveBeenCalledWith(
      "guest",
      "trip",
      expect.objectContaining({ responseStatus: "maybe", availableDates: [] }),
    );
  });
  it("clears availability when declining and preserves existing preferences", async () => {
    await saveGuestResponse("trip", { ...input, responseStatus: "declined" });
    expect(mocks.save).toHaveBeenCalledWith(
      "guest",
      "trip",
      expect.objectContaining({
        responseStatus: "declined",
        availableDates: [],
        courseQualityPreference: 8,
        destinationVotes: ["dest"],
        homeCity: "Detroit",
      }),
    );
  });
  it("uses confirmed dates without asking the golfer to reselect", async () => {
    mocks.detail.mockResolvedValue({
      outing: {
        ...outing,
        confirmedDateWindow: outing.preferredDateWindows[0],
      },
      currentPreference: null,
    });
    await saveGuestResponse("trip", { ...input, availableDates: [] });
    expect(mocks.save).toHaveBeenCalledWith(
      "guest",
      "trip",
      expect.objectContaining({ availableDates: ["2027-04-16"] }),
    );
  });
  it("rejects dates removed from the trip", async () => {
    await expect(
      saveGuestResponse("trip", { ...input, availableDates: ["2027-05-01"] }),
    ).resolves.toEqual({
      error: expect.stringContaining("dates have changed"),
    });
  });
  it("rejects reversed budgets", async () => {
    await expect(
      saveGuestResponse("trip", { ...input, budgetMin: 1400 }),
    ).resolves.toEqual({ error: expect.stringContaining("maximum budget") });
  });
  it("does not infer attendance from legacy preferences", () => {
    expect(responseLabel({ responseStatus: null })).toBe("RSVP needed");
  });
});
