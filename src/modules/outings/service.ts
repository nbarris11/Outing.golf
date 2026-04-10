import { buildRecommendations } from "@/modules/outings/scoring";
import { canAccessOuting } from "@/modules/outings/permissions";
import { getDemoState } from "@/lib/demo/store";

function confidenceScore(responseRate: number, votesCount: number) {
  return Math.min(92, Math.round(responseRate * 65 + Math.min(votesCount * 6, 27)));
}

function averageGroupBudget(preferences: Array<{ budgetMin: number; budgetMax: number }>, fallback: number) {
  if (!preferences.length) {
    return fallback;
  }

  const total = preferences.reduce((sum, item) => sum + (item.budgetMin + item.budgetMax) / 2, 0);
  return Math.round(total / preferences.length);
}

export async function getDashboardData(profileId: string) {
  const state = await getDemoState();
  const memberships = state.outingMembers.filter((member) => member.profileId === profileId);
  const outings = state.outings.filter((outing) =>
    memberships.some((membership) => membership.outingId === outing.id)
  );

  return outings.map((outing) => {
    const preferences = state.preferenceSubmissions.filter((item) => item.outingId === outing.id);
    const destinations = state.destinationOptions.filter((item) => item.outingId === outing.id);
    const golfCourses = state.golfCourseOptions.filter((item) => item.outingId === outing.id);
    const lodging = state.lodgingOptions.filter((item) => item.outingId === outing.id);
    const votes = state.votes.filter((item) => item.outingId === outing.id);
    const recommendation = buildRecommendations({
      outing,
      preferences,
      destinations,
      golfCourses,
      lodging,
      votes
    });
    const responseRate = membersCompletionRate(
      state.outingMembers.filter((item) => item.outingId === outing.id).length,
      preferences.length
    );
    const topDestination = destinations.find((item) => item.id === recommendation.destinationScores[0]?.id);
    const topCourse = golfCourses.find((item) => item.id === recommendation.golfScores[0]?.id);
    const topLodging = lodging.find((item) => item.id === recommendation.lodgingScores[0]?.id);
    const topDestinations = recommendation.destinationScores
      .slice(0, 3)
      .map((score) => destinations.find((item) => item.id === score.id))
      .filter((item): item is (typeof destinations)[number] => Boolean(item));
    const averageBudget = averageGroupBudget(preferences, outing.budgetTarget);
    const nextAction =
      responseRate < 0.7
        ? "Collect the remaining preferences"
        : recommendation.bestDates.length
          ? "Lock the date window and narrow the shortlist"
          : "Invite more members or gather date availability";
    const recommendationSummary = recommendation.bestDates.length
      ? `The group is clustering around ${topDestination?.name ?? "one destination"} for ${recommendation.bestDates[0]?.date}, with ${topLodging?.name ?? "the best stay option"} and ${topCourse?.name ?? "the leading course"} looking like the easiest path to a decision.`
      : `The destination lean is forming around ${topDestination?.name ?? "the current front-runner"}, but the group still needs a cleaner date overlap before the plan feels locked.`;

    return {
      outing,
      members: state.outingMembers.filter((item) => item.outingId === outing.id),
      invites: state.invites.filter((item) => item.outingId === outing.id),
      preferences,
      recommendation,
      insights: {
        responseRate,
        confidence: confidenceScore(responseRate, votes.length),
        averageBudget,
        topDestination,
        topDestinations,
        topCourse,
        topLodging,
        recommendationSummary,
        nextAction
      }
    };
  });
}

function membersCompletionRate(memberCount: number, preferenceCount: number) {
  if (!memberCount) {
    return 0;
  }

  return preferenceCount / memberCount;
}

export async function getOutingDetail(outingId: string, profileId: string) {
  const state = await getDemoState();
  const outing = state.outings.find((item) => item.id === outingId);

  if (!outing) {
    return null;
  }

  if (!canAccessOuting(profileId, state.outingMembers, outingId)) {
    return null;
  }

  const preferences = state.preferenceSubmissions.filter((item) => item.outingId === outingId);
  const destinations = state.destinationOptions.filter((item) => item.outingId === outingId);
  const golfCourses = state.golfCourseOptions.filter((item) => item.outingId === outingId);
  const lodging = state.lodgingOptions.filter((item) => item.outingId === outingId);
  const votes = state.votes.filter((item) => item.outingId === outingId);
  const members = state.outingMembers.filter((item) => item.outingId === outingId);
  const invites = state.invites.filter((item) => item.outingId === outingId);
  const favorites = state.favorites.filter((item) => item.outingId === outingId);
  const messages = state.chatMessages
    .filter((item) => item.outingId === outingId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  const recommendation = buildRecommendations({
    outing,
    preferences,
    destinations,
    golfCourses,
    lodging,
    votes
  });
  const responseRate = membersCompletionRate(members.length, preferences.length);
  const topDestination = destinations.find((item) => item.id === recommendation.destinationScores[0]?.id);
  const topCourse = golfCourses.find((item) => item.id === recommendation.golfScores[0]?.id);
  const topLodging = lodging.find((item) => item.id === recommendation.lodgingScores[0]?.id);
  const memberSnapshots = members.map((member) => {
    const preference = preferences.find((item) => item.profileId === member.profileId);

    return {
      member,
      preference,
      responded: Boolean(preference)
    };
  });
  const lastMessage = messages.at(-1);
  const nextAction =
    responseRate < 0.7
      ? "Nudge the remaining players so the date window gets easier to lock."
      : recommendation.bestDates.length
        ? "Confirm the front-running date and use compare to settle the final shortlist."
        : "Open another date window or add more availability from the group.";

  return {
    outing,
    members,
    memberSnapshots,
    invites,
    preferences,
    destinations,
    golfCourses,
    lodging,
    votes,
    favorites,
    messages,
    currentPreference: preferences.find((item) => item.profileId === profileId) ?? null,
    recommendation,
    insights: {
      responseRate,
      respondedCount: memberSnapshots.filter((item) => item.responded).length,
      pendingCount: memberSnapshots.filter((item) => !item.responded).length,
      confidence: confidenceScore(responseRate, votes.length),
      topDestination,
      topCourse,
      topLodging,
      voteCount: votes.length,
      favoriteCount: favorites.length,
      lastMessageAt: lastMessage?.createdAt ?? null,
      nextAction
    }
  };
}
