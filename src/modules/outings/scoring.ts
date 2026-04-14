import type {
  DestinationOption,
  GolfCourseOption,
  LodgingOption,
  Outing,
  OutingRecommendations,
  PreferenceSubmission,
  Vote
} from "@/types/domain";

// ─── Helpers ────────────────────────────────────────────────────────────────

function voteBoost(entityId: string, votes: Vote[]) {
  return votes.filter((vote) => vote.entityId === entityId).reduce((total, vote) => total + vote.weight, 0);
}

/**
 * How far is cost from target?  Returns 0–100 (100 = perfect fit).
 * Penalises anything > target more aggressively than cheaper options.
 */
function normalizeBudgetFit(target: number, cost: number): number {
  if (target <= 0) return 50;
  if (cost <= target) {
    // Under budget — score well, slight bonus for being under
    return Math.max(60, 100 - ((target - cost) / target) * 40);
  }
  // Over budget — penalise proportionally; score hits 0 at 2× target
  const overBy = cost - target;
  return Math.max(0, 100 - (overBy / target) * 100);
}

/**
 * Returns the midpoint (average of min and max) of a member's stated budget.
 */
function memberBudgetMidpoint(p: PreferenceSubmission): number {
  return (p.budgetMin + p.budgetMax) / 2;
}

/**
 * Group budget = average of every member's stated budget midpoint.
 * Falls back to the organizer's outing-level budget target when no
 * preference submissions exist yet.
 */
function groupBudget(preferences: PreferenceSubmission[], fallback: number): number {
  if (!preferences.length) return fallback;
  const total = preferences.reduce((sum, p) => sum + memberBudgetMidpoint(p), 0);
  return Math.round(total / preferences.length);
}

/**
 * Group affordability: returns 0–100 based on the fraction of members
 * whose stated maximum budget is at least `costPerPerson`.
 * This answers "what % of the group can actually afford this?".
 */
function groupAffordability(costPerPerson: number, preferences: PreferenceSubmission[]): number {
  if (!preferences.length) return 50; // neutral when no preferences yet
  const canAfford = preferences.filter((p) => costPerPerson <= p.budgetMax).length;
  return Math.round((canAfford / preferences.length) * 100);
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
    // Normalize quality preference (1–10) to 0–100
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

// ─── Main ───────────────────────────────────────────────────────────────────

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

  // ── Group budget consensus ──────────────────────────────────────────────
  // Use the average of every member's stated budget midpoint.
  // This replaces the organizer's single budgetTarget for ranking purposes —
  // if members lean cheaper or pricier, the rankings reflect that.
  const groupBudgetAvg = groupBudget(preferences, outing.budgetTarget);

  // Assume lodging is ~35% of group budget (rest goes to golf + misc)
  const groupLodgingBudgetPerNight = groupBudgetAvg * 0.35;

  // Assume golf is ~45% of group budget
  const groupGolfBudget = groupBudgetAvg * 0.45;

  // ── Consensus rounds ────────────────────────────────────────────────────
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

  // ── Destination scores ──────────────────────────────────────────────────
  // Budget fit now uses GROUP budget average, not just the organizer's target.
  // Affordability checks what % of members can cover the estimated trip cost.
  const destinationScores = destinations
    .map((destination) => {
      const totalTripCost =
        destination.averageNightlyRate * 2 +
        destination.averageRoundCost * (outing.golfIntensity === "golf_first" ? 3 : 2);

      const budgetFitScore = normalizeBudgetFit(groupBudgetAvg, totalTripCost);
      const affordabilityScore = groupAffordability(totalTripCost, preferences);
      const prefBoost = destinationPreferenceBoost(destination, preferences);
      const votes_ = voteBoost(destination.id, votes);

      const score =
        budgetFitScore * 0.3 +               // fits group budget midpoint
        affordabilityScore * 0.25 +           // % of members who can afford it
        prefBoost * 1.2 +                     // destination votes from members
        votes_ * 6 +                          // group voting weight
        outing.organizerWeighting * (destination.featured ? 3 : 1);

      return {
        id: destination.id,
        score: Math.round(score),
        reasons: [
          `Budget fit: ${Math.round(budgetFitScore)}/100 vs group average of $${groupBudgetAvg.toLocaleString()}`,
          `${Math.round(affordabilityScore)}% of members can cover this destination`,
          `${prefBoost} points from destination preferences`
        ]
      };
    })
    .sort((a, b) => b.score - a.score);

  // ── Golf course scores ──────────────────────────────────────────────────
  // Budget fit uses the group's golf portion of their budget.
  // Affordability checks if the golf cost fits within each member's golf budget share.
  const golfScores = golfCourses
    .map((course) => {
      const totalGolfCost = course.averageGreensFee * estimatedRounds;
      // Each member's golf budget = 45% of their stated budget max
      const golfAffordabilityPerMember = preferences.map((p) => ({
        budgetMax: p.budgetMax * 0.45
      }));
      const affordabilityScore = golfAffordabilityPerMember.length
        ? Math.round(
            (golfAffordabilityPerMember.filter((p) => totalGolfCost <= p.budgetMax).length /
              golfAffordabilityPerMember.length) *
              100
          )
        : 50;

      const budgetFitScore = normalizeBudgetFit(groupGolfBudget, totalGolfCost);
      const prefBoost = coursePreferenceBoost(course, preferences);
      const votes_ = voteBoost(course.id, votes);

      const score =
        budgetFitScore * 0.3 +               // fits group golf budget
        affordabilityScore * 0.25 +           // % who can afford the golf portion
        prefBoost * 0.9 +                     // quality + walking/riding preference
        votes_ * 6 +                          // group voting weight
        course.qualityScore;                  // base quality from provider

      return {
        id: course.id,
        score: Math.round(score),
        reasons: [
          `Budget fit: ${Math.round(budgetFitScore)}/100 vs group golf budget of $${Math.round(groupGolfBudget).toLocaleString()}`,
          `${affordabilityScore}% of members can cover the greens fees`,
          `${Math.round(prefBoost)} points from quality and walking/riding preferences`
        ]
      };
    })
    .sort((a, b) => b.score - a.score);

  // ── Lodging scores ──────────────────────────────────────────────────────
  // Budget fit now uses group lodging budget (35% of group average).
  // Affordability checks the per-person nightly cost against each member's lodging budget.
  const lodgingScores = lodging
    .map((option) => {
      // Per-person nightly cost (whole-property rate split by players)
      const nightlyPerPerson = option.nightlyRate / Math.max(1, outing.numberOfPlayers);
      // Each member's lodging budget = 35% of their stated budget max, per night
      const lodgingAffordability = preferences.length
        ? Math.round(
            (preferences.filter((p) => nightlyPerPerson <= p.budgetMax * 0.35).length /
              preferences.length) *
              100
          )
        : 50;

      const budgetFitScore = normalizeBudgetFit(groupLodgingBudgetPerNight, option.nightlyRate);
      const prefBoost = lodgingPreferenceBoost(option, preferences);
      const votes_ = voteBoost(option.id, votes);

      const score =
        budgetFitScore * 0.3 +               // fits group lodging budget
        lodgingAffordability * 0.25 +         // % who can afford the per-person rate
        prefBoost * 0.9 +                     // lodging type preference
        votes_ * 6 +                          // group voting weight
        (option.sleeps >= outing.numberOfPlayers ? 15 : 0); // can house the full group

      return {
        id: option.id,
        score: Math.round(score),
        reasons: [
          `Budget fit: ${Math.round(budgetFitScore)}/100 vs group lodging budget of $${Math.round(groupLodgingBudgetPerNight).toLocaleString()}/night`,
          `${lodgingAffordability}% of members can cover the per-person nightly rate`,
          `${prefBoost} points from lodging type preferences`
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
