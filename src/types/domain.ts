export type AppRole = "member" | "admin";
export type OutingRole = "organizer" | "participant";
export type OutingStatus = "planning" | "narrowed_down" | "booked" | "completed";
export type InviteStatus = "pending" | "accepted" | "declined";
export type DestinationType = "open" | "city" | "state" | "region";
export type TripStyle = "value" | "classic" | "premium" | "bucket_list";
export type GolfIntensity = "light" | "balanced" | "golf_first";
export type LodgingType = "hotel" | "resort" | "house" | "mixed";
export type VoteEntityType = "destination" | "golf_course" | "lodging";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  homeAirport?: string | null;
  handicap?: string | null;
  appRole: AppRole;
  createdAt: string;
}

export interface DateWindow {
  start: string;
  end: string;
}

export interface Outing {
  id: string;
  name: string;
  organizerId: string;
  destinationType: DestinationType;
  destinationLabel: string;
  preferredDateWindows: DateWindow[];
  budgetTarget: number;
  tripStyle: TripStyle;
  numberOfPlayers: number;
  golfIntensity: GolfIntensity;
  lodgingPreference: LodgingType;
  notes?: string;
  status: OutingStatus;
  organizerWeighting: number;
  createdAt: string;
}

export interface OutingMember {
  id: string;
  outingId: string;
  profileId: string;
  role: OutingRole;
  joinedAt: string;
}

export interface Invite {
  id: string;
  outingId: string;
  email: string;
  invitedBy: string;
  status: InviteStatus;
  token: string;
  createdAt: string;
}

export interface PreferenceSubmission {
  id: string;
  outingId: string;
  profileId: string;
  budgetMin: number;
  budgetMax: number;
  availableDates: string[];
  destinationVotes: string[];
  lodgingPreferences: LodgingType[];
  courseQualityPreference: number;
  walkingPreference: "walking" | "riding" | "either";
  comments?: string;
  updatedAt: string;
}

export interface DestinationOption {
  id: string;
  outingId: string;
  providerKey: string;
  name: string;
  region: string;
  driveHours?: number | null;
  flightHours?: number | null;
  averageNightlyRate: number;
  averageRoundCost: number;
  tags: string[];
  summary: string;
  featured: boolean;
  hidden: boolean;
}

export interface GolfCourseOption {
  id: string;
  outingId: string;
  destinationOptionId: string;
  providerKey: string;
  name: string;
  locationLabel: string;
  averageGreensFee: number;
  qualityScore: number;
  rideFriendly: boolean;
  walkingFriendly: boolean;
  summary: string;
  tags: string[];
  featured: boolean;
  hidden: boolean;
}

export interface LodgingOption {
  id: string;
  outingId: string;
  destinationOptionId: string;
  providerKey: string;
  name: string;
  nightlyRate: number;
  lodgingType: LodgingType;
  sleeps: number;
  summary: string;
  tags: string[];
  featured: boolean;
  hidden: boolean;
}

export interface Vote {
  id: string;
  outingId: string;
  profileId: string;
  entityType: VoteEntityType;
  entityId: string;
  weight: number;
}

export interface Favorite {
  id: string;
  outingId: string;
  profileId: string;
  entityType: VoteEntityType;
  entityId: string;
}

export interface ChatMessage {
  id: string;
  outingId: string;
  profileId: string;
  message: string;
  createdAt: string;
}

export interface FeatureFlag {
  key: string;
  label: string;
  enabled: boolean;
}

export interface ContentBlock {
  key: string;
  title: string;
  body: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  updatedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  actorProfileId: string;
  entityType: string;
  entityId: string;
  action: string;
  createdAt: string;
}

export interface RecommendationScore {
  id: string;
  score: number;
  reasons: string[];
}

export interface OutingRecommendations {
  bestDates: Array<{ date: string; availableCount: number }>;
  destinationScores: RecommendationScore[];
  golfScores: RecommendationScore[];
  lodgingScores: RecommendationScore[];
}

export interface DemoState {
  profiles: Profile[];
  outings: Outing[];
  outingMembers: OutingMember[];
  invites: Invite[];
  preferenceSubmissions: PreferenceSubmission[];
  destinationOptions: DestinationOption[];
  golfCourseOptions: GolfCourseOption[];
  lodgingOptions: LodgingOption[];
  votes: Vote[];
  favorites: Favorite[];
  chatMessages: ChatMessage[];
  featureFlags: FeatureFlag[];
  contentBlocks: ContentBlock[];
  activityLog: ActivityLogEntry[];
}
