import { describe, expect, it } from "vitest";

import { buildRecommendations } from "@/modules/outings/scoring";
import type {
  DestinationOption,
  GolfCourseOption,
  LodgingOption,
  Outing,
  PreferenceSubmission,
  Vote
} from "@/types/domain";

const outing: Outing = {
  id: "outing_1",
  name: "Test",
  organizerId: "profile_1",
  destinationType: "region",
  destinationLabel: "Warm weather",
  preferredDateWindows: [{ start: "2026-05-10", end: "2026-05-13" }],
  budgetTarget: 1200,
  tripStyle: "classic",
  numberOfPlayers: 8,
  golfIntensity: "balanced",
  lodgingPreference: "house",
  notes: "",
  status: "planning",
  organizerWeighting: 7, votingOpen: false,
  createdAt: new Date().toISOString()
};

const preferences: PreferenceSubmission[] = [
  {
    id: "pref_1",
    outingId: outing.id,
    profileId: "profile_1",
    budgetMin: 900,
    budgetMax: 1300,
    availableDates: ["2026-05-10", "2026-05-11"],
    destinationVotes: ["Fit City"],
    lodgingPreferences: ["house"],
    courseQualityPreference: 8,
    walkingPreference: "either",
    comments: "",
    updatedAt: new Date().toISOString()
  }
];

const destinations: DestinationOption[] = [
  {
    id: "destination_fit",
    outingId: outing.id,
    providerKey: "mock",
    name: "Fit City",
    region: "Region A",
    averageNightlyRate: 240,
    averageRoundCost: 110,
    driveHours: 3,
    flightHours: null,
    tags: [],
    summary: "",
    featured: true,
    hidden: false
  },
  {
    id: "destination_expensive",
    outingId: outing.id,
    providerKey: "mock",
    name: "Expensive City",
    region: "Region B",
    averageNightlyRate: 620,
    averageRoundCost: 280,
    driveHours: null,
    flightHours: 4,
    tags: [],
    summary: "",
    featured: false,
    hidden: false
  }
];

const golfCourses: GolfCourseOption[] = [
  {
    id: "course_fit",
    outingId: outing.id,
    destinationOptionId: "destination_fit",
    providerKey: "mock",
    name: "Fit Course",
    locationLabel: "Region A",
    averageGreensFee: 120,
    qualityScore: 85,
    rideFriendly: true,
    walkingFriendly: true,
    summary: "",
    tags: [],
    featured: true,
    hidden: false
  }
];

const lodging: LodgingOption[] = [
  {
    id: "lodging_fit",
    outingId: outing.id,
    destinationOptionId: "destination_fit",
    providerKey: "mock",
    name: "Fit House",
    nightlyRate: 250,
    lodgingType: "house",
    sleeps: 10,
    summary: "",
    tags: [],
    featured: true,
    hidden: false
  }
];

const votes: Vote[] = [
  {
    id: "vote_1",
    outingId: outing.id,
    profileId: "profile_1",
    entityType: "destination",
    entityId: "destination_fit",
    weight: 3
  }
];

describe("buildRecommendations", () => {
  it("ranks better-fitting destinations above expensive ones", () => {
    const result = buildRecommendations({
      outing,
      preferences,
      destinations,
      golfCourses,
      lodging,
      votes
    });

    expect(result.destinationScores[0]?.id).toBe("destination_fit");
    expect(result.bestDates[0]).toEqual({
      date: "2026-05-10",
      availableCount: 1
    });
  });
});
