import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDemoState } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessOuting } from "@/modules/outings/permissions";
import { buildRecommendations } from "@/modules/outings/scoring";
import type {
  ChatMessage,
  DestinationOption,
  Favorite,
  GolfCourseOption,
  Invite,
  LodgingOption,
  Outing,
  OutingMember,
  PreferenceSubmission,
  Profile,
  Vote
} from "@/types/domain";

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

function membersCompletionRate(memberCount: number, preferenceCount: number) {
  if (!memberCount) {
    return 0;
  }

  return preferenceCount / memberCount;
}

function eligibleProgressMembers(
  members: OutingMember[],
  preferences: Array<{ profileId: string }>
) {
  return members.filter((member) => {
    if (member.role !== "organizer") {
      return true;
    }

    return preferences.some((preference) => preference.profileId === member.profileId);
  });
}

function mapOutingRow(row: Record<string, any>): Outing {
  return {
    id: row.id,
    name: row.name,
    organizerId: row.organizer_id,
    destinationType: row.destination_type,
    destinationLabel: row.destination_label,
    preferredDateWindows: row.preferred_date_windows ?? [],
    budgetTarget: row.budget_target,
    tripStyle: row.trip_style,
    numberOfPlayers: row.number_of_players,
    golfIntensity: row.golf_intensity,
    lodgingPreference: row.lodging_preference,
    notes: row.notes ?? undefined,
    status: row.status,
    organizerWeighting: row.organizer_weighting,
    votingOpen: row.voting_open ?? false,
    teeTimeBookings: Array.isArray(row.tee_time_bookings) ? row.tee_time_bookings : [],
    createdAt: row.created_at
  };
}

function mapOutingMemberRow(row: Record<string, any>): OutingMember {
  return {
    id: row.id,
    outingId: row.outing_id,
    profileId: row.profile_id,
    role: row.role,
    joinedAt: row.joined_at
  };
}

function mapInviteRow(row: Record<string, any>): Invite {
  return {
    id: row.id,
    outingId: row.outing_id,
    email: row.email,
    invitedBy: row.invited_by,
    status: row.status,
    token: row.token,
    createdAt: row.created_at
  };
}

function mapPreferenceRow(row: Record<string, any>): PreferenceSubmission {
  return {
    id: row.id,
    outingId: row.outing_id,
    profileId: row.profile_id,
    budgetMin: row.budget_min,
    budgetMax: row.budget_max,
    availableDates: row.available_dates ?? [],
    destinationVotes: row.destination_votes ?? [],
    lodgingPreferences: row.lodging_preferences ?? [],
    courseQualityPreference: row.course_quality_preference,
    walkingPreference: row.walking_preference,
    comments: row.comments ?? undefined,
    preferredRounds: row.preferred_rounds ?? null,
    homeCity: row.home_city ?? null,
    updatedAt: row.updated_at
  };
}

function mapDestinationRow(row: Record<string, any>): DestinationOption {
  return {
    id: row.id,
    outingId: row.outing_id,
    providerKey: row.provider_key,
    name: row.name,
    region: row.region,
    driveHours: row.drive_hours ?? null,
    flightHours: row.flight_hours ?? null,
    averageNightlyRate: row.average_nightly_rate,
    averageRoundCost: row.average_round_cost,
    tags: row.tags ?? [],
    summary: row.summary,
    featured: row.featured,
    hidden: row.hidden
  };
}

function mapGolfRow(row: Record<string, any>): GolfCourseOption {
  return {
    id: row.id,
    outingId: row.outing_id,
    destinationOptionId: row.destination_option_id,
    providerKey: row.provider_key,
    name: row.name,
    locationLabel: row.location_label,
    averageGreensFee: row.average_greens_fee,
    qualityScore: row.quality_score,
    rideFriendly: row.ride_friendly,
    walkingFriendly: row.walking_friendly,
    summary: row.summary,
    tags: row.tags ?? [],
    featured: row.featured,
    hidden: row.hidden,
    scheduleDay: row.schedule_day ?? null,
    scheduleRounds: row.schedule_rounds ?? 1,
    dayLabel: row.day_label ?? null
  };
}

function mapLodgingRow(row: Record<string, any>): LodgingOption {
  return {
    id: row.id,
    outingId: row.outing_id,
    destinationOptionId: row.destination_option_id,
    providerKey: row.provider_key,
    name: row.name,
    nightlyRate: row.nightly_rate,
    priceTotal: row.price_total ?? null,
    currency: row.currency ?? null,
    lodgingType: row.lodging_type,
    sleeps: row.sleeps,
    roomName: row.room_name ?? null,
    boardType: row.board_type ?? null,
    cancellationSummary: row.cancellation_summary ?? null,
    refundable: row.refundable ?? null,
    hotelAddress: row.hotel_address ?? null,
    city: row.city ?? null,
    state: row.state ?? null,
    country: row.country ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    starRating: row.star_rating ?? null,
    reviewScore: row.review_score ?? null,
    thumbnailUrl: row.thumbnail_url ?? null,
    amenities: row.amenities ?? [],
    checkIn: row.check_in ?? null,
    checkOut: row.check_out ?? null,
    guestCount: row.guest_count ?? null,
    offerId: row.offer_id ?? null,
    hotelId: row.hotel_id ?? null,
    topPick: row.top_pick ?? false,
    summary: row.summary,
    tags: row.tags ?? [],
    featured: row.featured,
    hidden: row.hidden
  };
}

const lodgingSelectFields =
  "id,outing_id,destination_option_id,provider_key,name,nightly_rate,price_total,currency,lodging_type,sleeps,room_name,board_type,cancellation_summary,refundable,hotel_address,city,state,country,latitude,longitude,star_rating,review_score,thumbnail_url,amenities,check_in,check_out,guest_count,offer_id,hotel_id,summary,tags,featured,hidden,top_pick";

function mapVoteRow(row: Record<string, any>): Vote {
  return {
    id: row.id,
    outingId: row.outing_id,
    profileId: row.profile_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    weight: row.weight
  };
}

function mapFavoriteRow(row: Record<string, any>): Favorite {
  return {
    id: row.id,
    outingId: row.outing_id,
    profileId: row.profile_id,
    entityType: row.entity_type,
    entityId: row.entity_id
  };
}

function mapMessageRow(row: Record<string, any>): ChatMessage {
  return {
    id: row.id,
    outingId: row.outing_id,
    profileId: row.profile_id,
    message: row.message,
    createdAt: row.created_at
  };
}

function mapProfileRow(row: Record<string, any>): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url ?? null,
    homeAirport: row.home_airport ?? null,
    handicap: row.handicap ?? null,
    appRole: row.app_role,
    createdAt: row.created_at
  };
}

async function getLiveOutings(profileId: string) {
  const adminClient = createSupabaseAdminClient();
  const supabase = adminClient ?? (await createSupabaseServerClient());

  if (!supabase) {
    return [];
  }

  // Use admin client to bypass RLS — access is scoped to the user's own outings
  // and memberships in application code, same pattern as getOutingDetail.
  const [{ data: organizerOutings }, { data: memberships }] = await Promise.all([
    supabase
      .from("outings")
      .select("id,name,organizer_id,destination_type,destination_label,preferred_date_windows,budget_target,trip_style,number_of_players,golf_intensity,lodging_preference,notes,status,organizer_weighting,voting_open,tee_time_bookings,created_at")
      .eq("organizer_id", profileId)
      .order("created_at", { ascending: false }),
    supabase.from("outing_members").select("outing_id").eq("profile_id", profileId)
  ]);

  const outingIds = Array.from(
    new Set([...(organizerOutings ?? []).map((outing) => outing.id), ...(memberships ?? []).map((item) => item.outing_id)])
  );

  if (!outingIds.length) {
    return [];
  }

  const { data: outingRows } = await supabase
    .from("outings")
    .select("id,name,organizer_id,destination_type,destination_label,preferred_date_windows,budget_target,trip_style,number_of_players,golf_intensity,lodging_preference,notes,status,organizer_weighting,voting_open,tee_time_bookings,created_at")
    .in("id", outingIds)
    .order("created_at", { ascending: false });

  const outings = (outingRows ?? []).map(mapOutingRow);

  return Promise.all(
    outings.map(async (outing) => {
      const [
        membersResult,
        invitesResult,
        preferencesResult,
        destinationsResult,
        golfCoursesResult,
        lodgingResult,
        votesResult
      ] = await Promise.all([
        supabase.from("outing_members").select("id,outing_id,profile_id,role,joined_at").eq("outing_id", outing.id),
        supabase.from("invites").select("id,outing_id,email,invited_by,status,token,created_at").eq("outing_id", outing.id),
        supabase.from("preference_submissions").select("id,outing_id,profile_id,budget_min,budget_max,available_dates,destination_votes,lodging_preferences,course_quality_preference,walking_preference,comments,preferred_rounds,home_city,updated_at").eq("outing_id", outing.id),
        supabase.from("destination_options").select("id,outing_id,provider_key,name,region,drive_hours,flight_hours,average_nightly_rate,average_round_cost,tags,summary,featured,hidden").eq("outing_id", outing.id),
        supabase.from("golf_course_options").select("id,outing_id,destination_option_id,provider_key,name,location_label,average_greens_fee,quality_score,ride_friendly,walking_friendly,summary,tags,featured,hidden,schedule_day,schedule_rounds,day_label").eq("outing_id", outing.id),
        supabase.from("lodging_options").select(lodgingSelectFields).eq("outing_id", outing.id),
        supabase.from("votes").select("id,outing_id,profile_id,entity_type,entity_id,weight").eq("outing_id", outing.id)
      ]);

      const members = (membersResult.data ?? []).map(mapOutingMemberRow);
      const invites = (invitesResult.data ?? []).map(mapInviteRow);
      const preferences = (preferencesResult.data ?? []).map(mapPreferenceRow);
      const destinations = (destinationsResult.data ?? []).map(mapDestinationRow);
      const golfCourses = (golfCoursesResult.data ?? []).map(mapGolfRow);
      const lodging = (lodgingResult.data ?? []).map(mapLodgingRow);
      const votes = (votesResult.data ?? []).map(mapVoteRow);
      const recommendation = buildRecommendations({
        outing,
        preferences,
        destinations,
        golfCourses,
        lodging,
        votes
      });
      const progressMembers = eligibleProgressMembers(members, preferences);
      const responseRate = membersCompletionRate(progressMembers.length, preferences.length);
      const topDestination = destinations.find((item) => item.id === recommendation.destinationScores[0]?.id);
      const topCourse = golfCourses.find((item) => item.id === recommendation.golfScores[0]?.id);
      const topLodging = lodging.find((item) => item.id === recommendation.lodgingScores[0]?.id);
      const topDestinations = recommendation.destinationScores
        .slice(0, 3)
        .map((score) => destinations.find((item) => item.id === score.id))
        .filter((item): item is DestinationOption => Boolean(item));
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
        members,
        invites,
        preferences,
        recommendation,
        insights: {
          responseRate,
          respondedCount: preferences.length,
          pendingCount: progressMembers.filter(
            (member) => !preferences.some((item) => item.profileId === member.profileId)
          ).length,
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
    })
  );
}

export async function getDashboardData(profileId: string) {
  if (!isDemoMode) {
    return getLiveOutings(profileId);
  }

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
    const outingMembers = state.outingMembers.filter((item) => item.outingId === outing.id);
    const progressMembers = eligibleProgressMembers(outingMembers, preferences);
    const responseRate = membersCompletionRate(progressMembers.length, preferences.length);
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
      members: outingMembers,
      invites: state.invites.filter((item) => item.outingId === outing.id),
      preferences,
      recommendation,
      insights: {
        responseRate,
        respondedCount: preferences.length,
        pendingCount: progressMembers.filter(
          (member) => !preferences.some((item) => item.profileId === member.profileId)
        ).length,
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

export interface TripPackingItem {
  id: string;
  outingId: string;
  profileId: string | null;  // null = shared/group item
  label: string;
  isDefault: boolean;
  checkedBy: string | null;
  checkedAt: string | null;
  sortOrder: number;
}

export async function getTripPackingItems(outingId: string): Promise<TripPackingItem[]> {
  if (isDemoMode) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("trip_packing_items")
    .select("id,outing_id,profile_id,label,is_default,checked_by,checked_at,sort_order")
    .eq("outing_id", outingId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    outingId: row.outing_id,
    profileId: row.profile_id ?? null,
    label: row.label,
    isDefault: row.is_default,
    checkedBy: row.checked_by ?? null,
    checkedAt: row.checked_at ?? null,
    sortOrder: row.sort_order
  }));
}

export async function getOutingDetail(outingId: string, profileId: string) {
  if (!isDemoMode) {
    // Use admin client to bypass RLS for the initial lookup, then enforce
    // access control in application code. This avoids RLS auth.uid() issues
    // that can occur in server component rendering contexts.
    const adminClient = createSupabaseAdminClient();
    const supabase = await createSupabaseServerClient();
    const queryClient = adminClient ?? supabase;

    if (!queryClient) {
      return null;
    }

    const { data: outingRow } = await queryClient
      .from("outings")
      .select("id,name,organizer_id,destination_type,destination_label,preferred_date_windows,budget_target,trip_style,number_of_players,golf_intensity,lodging_preference,notes,status,organizer_weighting,voting_open,tee_time_bookings,created_at")
      .eq("id", outingId)
      .maybeSingle();

    if (!outingRow) {
      return null;
    }

    const outing = mapOutingRow(outingRow);

    const { data: memberRows } = await queryClient
      .from("outing_members")
      .select("id,outing_id,profile_id,role,joined_at")
      .eq("outing_id", outingId);

    const members = (memberRows ?? []).map(mapOutingMemberRow);

    // Enforce access in application code instead of relying on RLS
    if (outing.organizerId !== profileId && !canAccessOuting(profileId, members, outingId)) {
      return null;
    }

    const [
      invitesResult,
      preferencesResult,
      destinationsResult,
      golfCoursesResult,
      lodgingResult,
      votesResult,
      favoritesResult,
      messagesResult
    ] = await Promise.all([
      queryClient.from("invites").select("id,outing_id,email,invited_by,status,token,created_at").eq("outing_id", outingId),
      queryClient.from("preference_submissions").select("id,outing_id,profile_id,budget_min,budget_max,available_dates,destination_votes,lodging_preferences,course_quality_preference,walking_preference,comments,preferred_rounds,home_city,updated_at").eq("outing_id", outingId),
      queryClient.from("destination_options").select("id,outing_id,provider_key,name,region,drive_hours,flight_hours,average_nightly_rate,average_round_cost,tags,summary,featured,hidden").eq("outing_id", outingId),
      queryClient.from("golf_course_options").select("id,outing_id,destination_option_id,provider_key,name,location_label,average_greens_fee,quality_score,ride_friendly,walking_friendly,summary,tags,featured,hidden,schedule_day,schedule_rounds,day_label").eq("outing_id", outingId),
      queryClient.from("lodging_options").select(lodgingSelectFields).eq("outing_id", outingId),
      queryClient.from("votes").select("id,outing_id,profile_id,entity_type,entity_id,weight").eq("outing_id", outingId),
      queryClient.from("favorites").select("id,outing_id,profile_id,entity_type,entity_id").eq("outing_id", outingId),
      queryClient.from("chat_messages").select("id,outing_id,profile_id,message,created_at").eq("outing_id", outingId).order("created_at", { ascending: true })
    ]);

    const preferences = (preferencesResult.data ?? []).map(mapPreferenceRow);
    const destinations = (destinationsResult.data ?? []).map(mapDestinationRow);
    const golfCourses = (golfCoursesResult.data ?? []).map(mapGolfRow);
    const lodging = (lodgingResult.data ?? []).map(mapLodgingRow);
    const votes = (votesResult.data ?? []).map(mapVoteRow);
    const invites = (invitesResult.data ?? []).map(mapInviteRow);
    const favorites = (favoritesResult.data ?? []).map(mapFavoriteRow);
    const messages = (messagesResult.data ?? []).map(mapMessageRow);

    const recommendation = buildRecommendations({
      outing,
      preferences,
      destinations,
      golfCourses,
      lodging,
      votes
    });
    const progressMembers = eligibleProgressMembers(members, preferences);
    const responseRate = membersCompletionRate(progressMembers.length, preferences.length);
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

    const profileIds = Array.from(new Set([...members.map((item) => item.profileId), ...messages.map((item) => item.profileId)]));
    const profiles =
      adminClient && profileIds.length
        ? (
            await adminClient
              .from("profiles")
              .select("id,email,full_name,avatar_url,home_airport,handicap,app_role,created_at")
              .in("id", profileIds)
          ).data?.map(mapProfileRow) ?? []
        : [];

    // Sort by recommendation score so the highest-fit options appear first
    const sortedGolfCourses = [...golfCourses].sort((a, b) => {
      const aScore = recommendation.golfScores.find((s) => s.id === a.id)?.score ?? 0;
      const bScore = recommendation.golfScores.find((s) => s.id === b.id)?.score ?? 0;
      return bScore - aScore;
    });
    const sortedLodging = [...lodging].sort((a, b) => {
      const aScore = recommendation.lodgingScores.find((s) => s.id === a.id)?.score ?? 0;
      const bScore = recommendation.lodgingScores.find((s) => s.id === b.id)?.score ?? 0;
      return bScore - aScore;
    });

    return {
      outing,
      members,
      memberSnapshots,
      invites,
      preferences,
      destinations,
      golfCourses: sortedGolfCourses,
      lodging: sortedLodging,
      votes,
      favorites,
      messages,
      profiles,
      currentPreference: preferences.find((item) => item.profileId === profileId) ?? null,
      recommendation,
      insights: {
        responseRate,
        respondedCount: memberSnapshots.filter((item) => item.responded).length,
        pendingCount: progressMembers.filter(
          (member) => !preferences.some((item) => item.profileId === member.profileId)
        ).length,
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
  const progressMembers = eligibleProgressMembers(members, preferences);
  const responseRate = membersCompletionRate(progressMembers.length, preferences.length);
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
    profiles: state.profiles,
    currentPreference: preferences.find((item) => item.profileId === profileId) ?? null,
    recommendation,
    insights: {
      responseRate,
      respondedCount: memberSnapshots.filter((item) => item.responded).length,
      pendingCount: progressMembers.filter(
        (member) => !preferences.some((item) => item.profileId === member.profileId)
      ).length,
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
