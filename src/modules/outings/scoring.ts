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
  const destNameLower = destination.name.toLowerCase();
  return preferences.reduce((total, submission) => {
    // Case-insensitive partial match — "scottsdale" matches "Scottsdale Sun Split"
    const voted = submission.destinationVotes.some(
      (v) =>
        destNameLower.includes(v.toLowerCase()) ||
        v.toLowerCase().includes(destNameLower)
    );
    return total + (voted ? 10 : 0);
  }, 0);
}

function lodgingPreferenceBoost(lodging: LodgingOption, preferences: PreferenceSubmission[]) {
  return preferences.reduce((total, submission) => {
    return total + (submission.lodgingPreferences.includes(lodging.lodgingType) ? 8 : 0);
  }, 0);
}

function coursePreferenceBoost(course: GolfCourseOption, preferences: PreferenceSubmission[]) {
  return preferences.reduce((total, submission) => {
    // Normalize quality preference (1–10) to 0–100 so it's on par with budget fit
    const qualityScore = ((submission.courseQualityPreference - 1) / 9) * 100;
    let next = total + qualityScore;

    // Walking/riding fit — meaningful bonus so preference actually shifts rankings
    if (submission.walkingPreference === "walking" && course.walkingFriendly) {
      next += 25;
    }
    if (submission.walkingPreference === "riding" && course.rideFriendly) {
      next += 25;
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

  // Compute consensus rounds first — used for the golf budget comparison below
  const roundsVotes = preferences
    .map((p) => p.preferredRounds)
    .filter((r): r is number => r != null && r > 0);
  const consensusRounds = roundsVotes.length
    ? (() => {
        const counts: Record<number, number> = {};
        for (const r of roundsVotes) counts[r] = (counts[r] ?? 0) + 1;
        return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
      })()
    : null;

  const estimatedRounds =
    consensusRounds ??
    (outing.golfIntensity === "light" ? 2 : outing.golfIntensity === "golf_first" ? 4 : 3);

  // Golf is ~40% of the trip budget; compare total expected spend vs that portion
  const golfBudgetPerPerson = outing.budgetTarget * 0.4;

  const destinationScores = destinations
    .map((destination) => {
      const totalTripCost =
        destination.averageNightlyRate * 2 +
        destination.averageRoundCost * (outing.golfIntensity === "golf_first" ? 3 : 2);
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
      const totalGolfCost = course.averageGreensFee * estimatedRounds;
      const score =
        normalizeBudgetFit(golfBudgetPerPerson, totalGolfCost) * 0.45 +
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

  return {
    bestDates,
    destinationScores,
    golfScores,
    lodgingScores,
    consensusRounds
  };
}
