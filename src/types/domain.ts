export type AppRole = "member" | "admin";
export type OutingRole = "organizer" | "participant";
export type OutingStatus = "planning" | "narrowed_down" | "booked" | "completed";
export type InviteStatus = "pending" | "accepted" | "declined";
export type DestinationType = "open" | "city" | "state" | "region" | "international";
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
  preferredRounds?: number | null;
  homeCity?: string | null;
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
  priceTotal?: number | null;
  currency?: string | null;
  lodgingType: LodgingType;
  sleeps: number;
  roomName?: string | null;
  boardType?: string | null;
  cancellationSummary?: string | null;
  refundable?: boolean | null;
  hotelAddress?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  starRating?: number | null;
  reviewScore?: number | null;
  thumbnailUrl?: string | null;
  amenities?: string[];
  checkIn?: string | null;
  checkOut?: string | null;
  guestCount?: number | null;
  offerId?: string | null;
  hotelId?: string | null;
  topPick?: boolean;
  summary: string;
  tags: string[];
  featured: boolean;
  hidden: boolean;
}

export interface LodgingSearchResult {
  provider: "liteapi";
  hotelId: string;
  hotelName: string;
  roomName: string;
  boardType: string | null;
  priceTotal: number;
  currency: string;
  nightlyRate: number;
  cancellationSummary: string | null;
  refundable: boolean;
  hotelAddress: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  starRating: number | null;
  reviewScore: number | null;
  thumbnailUrl: string | null;
  amenities: string[];
  checkIn: string;
  checkOut: string;
  guestCount: number;
  offerId: string;
  destinationOptionId?: string | null;
  lodgingType?: LodgingType;
  rawProviderData?: Record<string, unknown> | null;
}

export interface LodgingPrebook {
  id: string;
  outingId: string;
  provider: string;
  offerId: string;
  prebookId: string;
  status: string;
  priceTotal: number | null;
  currency: string | null;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
}

export interface LodgingBooking {
  id: string;
  outingId: string;
  provider: string;
  prebookId: string;
  providerBookingId: string | null;
  providerConfirmationCode: string | null;
  status: string;
  totalPrice: number | null;
  currency: string | null;
  guestEmail: string | null;
  clientReference: string | null;
  createdBy: string;
  createdAt: string;
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

export interface SiteProfileSettings {
  legalBusinessName: string;
  heroBadge: string;
  launchStatusLabel: string;
  supportEmail: string;
  footerTagline: string;
}

export interface LandingStepSetting {
  step: string;
  title: string;
  body: string;
}

export interface LandingCardSetting {
  title: string;
  body: string;
}

export interface LandingFaqSetting {
  question: string;
  answer: string;
}

export interface LandingPageSettings {
  painPointsTitle: string;
  painPointsBody: string;
  painPoints: string[];
  stepsTitle: string;
  steps: LandingStepSetting[];
  outcomesTitle: string;
  outcomes: LandingCardSetting[];
  socialProofTitle: string;
  socialProofBody: string;
  socialProofItems: string[];
  faqs: LandingFaqSetting[];
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaBody: string;
  finalCtaLabel: string;
  finalCtaHref: string;
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
  consensusRounds: number | null;
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
