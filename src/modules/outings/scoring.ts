import type {
  DestinationOption,
  GolfCourseOption,
  LodgingOption,
  Outing,
  OutingRecommendations,
  PreferenceSubmission,
  Vote
} from "@/types/domain";

function voteBoost(entityId: string, votes: Vote[]) {
  return votes.filter((vote) => vote.entityId === entityId).reduce((total, vote) => total + vote.weight, 0);
}

function normalizeBudgetFit(target: number, cost: number) {
  const variance = Math.abs(target - cost);
  return Math.max(0, 100 - variance / 8);
}

function dateFit(preferences: PreferenceSubmission[]) {
  const counts = new Map<string, number>();
  preferences.forEach((submission) => {
    submission.availableDates.forEach((date) => {
      counts.set(date, (counts.get(date) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([date, availableCount]) => ({ date, availableCount }))
    .sort((a, b) => b.availableCount - a.availableCount)
    .slice(0, 5);
}

function destinationPreferenceBoost(
  destination: DestinationOption,
  preferences: PreferenceSubmission[]
) {
  return preferences.reduce((total, submission) => {
    return total + (submission.destinationVotes.includes(destination.name) ? 10 : 0);
  }, 0);
}

function lodgingPreferenceBoost(lodging: LodgingOption, preferences: PreferenceSubmission[]) {
  return preferences.reduce((total, submission) => {
    return total + (submission.lodgingPreferences.includes(lodging.lodgingType) ? 8 : 0);
  }, 0);
}

function coursePreferenceBoost(course: GolfCourseOption, preferences: PreferenceSubmission[]) {
  return preferences.reduce((total, submission) => {
    let next = total + submission.courseQualityPreference;

    if (submission.walkingPreference === "walking" && course.walkingFriendly) {
      next += 8;
    }

    if (submission.walkingPreference === "riding" && course.rideFriendly) {
      next += 8;
    }

    return next;
  }, 0);
}

export function buildRecommendations(input: {
  outing: Outing;
  preferences: PreferenceSubmission[];
  destinations: DestinationOption[];
  golfCourses: GolfCourseOption[];
  lodging: LodgingOption[];
  votes: Vote[];
}): OutingRecommendations {
  const { outing, preferences, destinations, golfCourses, lodging, votes } = input;
  const bestDates = dateFit(preferences);

  const destinationScores = destinations
    .map((destination) => {
      const totalTripCost =
        destination.averageNightlyRate * 2 + destination.averageRoundCost * (outing.golfIntensity === "golf_first" ? 3 : 2);
      const score =
        normalizeBudgetFit(outing.budgetTarget, totalTripCost) * 0.5 +
        destinationPreferenceBoost(destination, preferences) * 1.2 +
        voteBoost(destination.id, votes) * 6 +
        outing.organizerWeighting * (destination.featured ? 3 : 1);

      return {
        id: destination.id,
        score: Math.round(score),
        reasons: [
          `${destination.name} fits the group budget better than pricier alternatives`,
          `${voteBoost(destination.id, votes)} weighted votes from the group`,
          `${destinationPreferenceBoost(destination, preferences)} points from destination preferences`
        ]
      };
    })
    .sort((a, b) => b.score - a.score);

  const golfScores = golfCourses
    .map((course) => {
      const score =
        normalizeBudgetFit(outing.budgetTarget / 2, course.averageGreensFee) * 0.45 +
        coursePreferenceBoost(course, preferences) * 0.9 +
        voteBoost(course.id, votes) * 6 +
        course.qualityScore;

      return {
        id: course.id,
        score: Math.round(score),
        reasons: [
          `${course.name} balances quality and greens fees well`,
          `${coursePreferenceBoost(course, preferences)} points from quality and walking/riding preferences`,
          `${voteBoost(course.id, votes)} weighted votes from the group`
        ]
      };
    })
    .sort((a, b) => b.score - a.score);

  const lodgingScores = lodging
    .map((option) => {
      const score =
        normalizeBudgetFit(outing.budgetTarget / 3, option.nightlyRate) * 0.5 +
        lodgingPreferenceBoost(option, preferences) * 0.9 +
        voteBoost(option.id, votes) * 6 +
        (option.sleeps >= outing.numberOfPlayers ? 15 : 0);

      return {
        id: option.id,
        score: Math.round(score),
        reasons: [
          `${option.name} fits the lodging budget and group size`,
          `${lodgingPreferenceBoost(option, preferences)} points from lodging preferences`,
          `${voteBoost(option.id, votes)} weighted votes from the group`
        ]
      };
    })
    .sort((a, b) => b.score - a.score);

  // Mode of preferredRounds across all submitted preferences (fallback: null)
  const roundsVotes = preferences
    .map(p => p.preferredRounds)
    .filter((r): r is number => r != null && r > 0);
  const consensusRounds = roundsVotes.length
    ? (() => {
        const counts: Record<number, number> = {};
        for (const r of roundsVotes) counts[r] = (counts[r] ?? 0) + 1;
        return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
      })()
    : null;

  return {
    bestDates,
    destinationScores,
    golfScores,
    lodgingScores,
    consensusRounds
  };
}
