import { describe, expect, it } from "vitest";

import { canAccessOuting, canManageOuting, isAdmin } from "@/modules/outings/permissions";

describe("permissions", () => {
  it("allows members to access their outing", () => {
    expect(
      canAccessOuting(
        "profile_1",
        [{ id: "member_1", outingId: "outing_1", profileId: "profile_1", role: "participant", joinedAt: "" }],
        "outing_1"
      )
    ).toBe(true);
  });

  it("only allows organizers to manage outings", () => {
    expect(
      canManageOuting(
        {
          id: "outing_1",
          organizerId: "profile_1",
          name: "Outing",
          destinationType: "open",
          destinationLabel: "Anywhere",
          preferredDateWindows: [],
          budgetTarget: 1000,
          tripStyle: "classic",
          numberOfPlayers: 4,
          golfIntensity: "balanced",
          lodgingPreference: "house",
          status: "planning",
          organizerWeighting: 5, votingOpen: false,
          createdAt: ""
        },
        {
          id: "profile_1",
          email: "host@example.com",
          fullName: "Host",
          appRole: "member",
          createdAt: ""
        }
      )
    ).toBe(true);
  });

  it("detects admins", () => {
    expect(
      isAdmin({
        id: "profile_admin",
        email: "admin@example.com",
        fullName: "Admin",
        appRole: "admin",
        createdAt: ""
      })
    ).toBe(true);
  });
});
