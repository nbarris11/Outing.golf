import type {
  DestinationOption,
  GolfCourseOption,
  LodgingOption,
  LodgingType,
  Outing
} from "@/types/domain";

export type DestinationProviderId = "mock" | "google_places";
export type GolfCourseProviderId = "mock" | "google_places";
export type LodgingProviderId = "mock" | "expedia_rapid";
export type TeeTimeProviderId = "mock" | "golfnow";
export type VacationRentalProviderId = "mock" | "vrbo_compatible";
export type ProviderAvailability = "implemented" | "planned";

export interface TeeTimeOption {
  id: string;
  providerKey: string;
  golfCourseOptionId: string;
  teeDate: string;
  teeTimeLocal: string;
  walkingAllowed: boolean;
  ridingAllowed: boolean;
  pricePerPlayer: number;
  remainingSpots: number;
  bookingUrl?: string | null;
}

export interface VacationRentalOption {
  id: string;
  providerKey: string;
  destinationOptionId: string;
  name: string;
  nightlyRate: number;
  sleeps: number;
  bedrooms: number;
  summary: string;
  tags: string[];
  bookingUrl?: string | null;
}

export interface DestinationSearchRequest {
  outing: Outing;
  query?: string;
  limit?: number;
}

export interface GolfCourseSearchRequest {
  outing: Outing;
  destinations: DestinationOption[];
  limitPerDestination?: number;
}

export interface LodgingSearchRequest {
  outing: Outing;
  destinations: DestinationOption[];
  preferredType: LodgingType;
  guests: number;
  limitPerDestination?: number;
}

export interface TeeTimeSearchRequest {
  outing: Outing;
  golfCourses: GolfCourseOption[];
  preferredDates?: string[];
  players: number;
}

export interface VacationRentalSearchRequest {
  outing: Outing;
  destinations: DestinationOption[];
  guests: number;
}

export interface ProviderDefinition<ProviderId extends string> {
  id: ProviderId;
  key: string;
  label: string;
  availability: ProviderAvailability;
  env: string[];
  notes: string;
  integrationTouchpoints: string[];
}

export interface DestinationSearchProvider {
  definition: ProviderDefinition<DestinationProviderId>;
  searchDestinations(input: DestinationSearchRequest): Promise<DestinationOption[]>;
}

export interface GolfCourseProvider {
  definition: ProviderDefinition<GolfCourseProviderId>;
  searchCourses(input: GolfCourseSearchRequest): Promise<GolfCourseOption[]>;
}

export interface LodgingProvider {
  definition: ProviderDefinition<LodgingProviderId>;
  searchLodging(input: LodgingSearchRequest): Promise<LodgingOption[]>;
}

export interface TeeTimeProvider {
  definition: ProviderDefinition<TeeTimeProviderId>;
  searchTeeTimes(input: TeeTimeSearchRequest): Promise<TeeTimeOption[]>;
}

export interface VacationRentalProvider {
  definition: ProviderDefinition<VacationRentalProviderId>;
  searchVacationRentals(input: VacationRentalSearchRequest): Promise<VacationRentalOption[]>;
}

export interface InventoryProviderBundle {
  destinationSearch: DestinationSearchProvider;
  golfCourse: GolfCourseProvider;
  lodging: LodgingProvider;
  teeTime: TeeTimeProvider;
  vacationRental: VacationRentalProvider;
}
