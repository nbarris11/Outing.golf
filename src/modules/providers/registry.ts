import { env } from "@/lib/env";
import { logInfo } from "@/lib/logger";

import type {
  DestinationProviderId,
  DestinationSearchProvider,
  GolfCourseProvider,
  GolfCourseProviderId,
  InventoryProviderBundle,
  LodgingProvider,
  LodgingProviderId,
  ProviderDefinition,
  TeeTimeProvider,
  TeeTimeProviderId,
  VacationRentalProvider,
  VacationRentalProviderId
} from "./interfaces";
import {
  mockDestinationProvider,
  mockGolfProvider,
  mockLodgingProvider,
  mockTeeTimeProvider,
  mockVacationRentalProvider
} from "./mock-providers";

const plannedDestinationDefinitions: Record<
  Exclude<DestinationProviderId, "mock">,
  ProviderDefinition<Exclude<DestinationProviderId, "mock">>
> = {
  google_places: {
    id: "google_places",
    key: "google-places-destination",
    label: "Google Places destination search",
    availability: "planned",
    env: ["GOOGLE_MAPS_API_KEY"],
    notes: "Use Google Places / Maps to expand destination discovery, drive and flight context, and geo-aware search prompts.",
    integrationTouchpoints: [
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts",
      "docs/provider-integrations.md"
    ]
  }
};

const plannedGolfDefinitions: Record<
  Exclude<GolfCourseProviderId, "mock">,
  ProviderDefinition<Exclude<GolfCourseProviderId, "mock">>
> = {
  google_places: {
    id: "google_places",
    key: "google-places-golf",
    label: "Google Places golf course search",
    availability: "planned",
    env: ["GOOGLE_MAPS_API_KEY"],
    notes: "Use Google Places to discover official golf course records, coordinates, and place metadata before ranking.",
    integrationTouchpoints: [
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts",
      "docs/provider-integrations.md"
    ]
  }
};

const plannedLodgingDefinitions: Record<
  Exclude<LodgingProviderId, "mock">,
  ProviderDefinition<Exclude<LodgingProviderId, "mock">>
> = {
  expedia_rapid: {
    id: "expedia_rapid",
    key: "expedia-rapid-lodging",
    label: "Expedia Rapid lodging inventory",
    availability: "planned",
    env: ["EXPEDIA_RAPID_API_KEY", "EXPEDIA_RAPID_API_HOST"],
    notes: "Use Expedia Rapid for official hotel and resort inventory, availability, pricing, and cancellation data.",
    integrationTouchpoints: [
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts",
      "docs/provider-integrations.md"
    ]
  }
};

const plannedTeeTimeDefinitions: Record<
  Exclude<TeeTimeProviderId, "mock">,
  ProviderDefinition<Exclude<TeeTimeProviderId, "mock">>
> = {
  golfnow: {
    id: "golfnow",
    key: "golfnow-tee-times",
    label: "GolfNow tee time feed",
    availability: "planned",
    env: ["GOLFNOW_API_KEY", "GOLFNOW_API_BASE_URL"],
    notes: "Use GolfNow or a similar official tee-time partner for live availability, pricing, and booking links.",
    integrationTouchpoints: [
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts",
      "docs/provider-integrations.md"
    ]
  }
};

const plannedVacationRentalDefinitions: Record<
  Exclude<VacationRentalProviderId, "mock">,
  ProviderDefinition<Exclude<VacationRentalProviderId, "mock">>
> = {
  vrbo_compatible: {
    id: "vrbo_compatible",
    key: "vrbo-compatible-rentals",
    label: "Vrbo-compatible vacation rental inventory",
    availability: "planned",
    env: ["VRBO_API_KEY", "VRBO_API_BASE_URL"],
    notes: "Use a Vrbo-compatible rental adapter to normalize whole-home inventory into the same ranking flow as hotels and resorts.",
    integrationTouchpoints: [
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts",
      "docs/provider-integrations.md"
    ]
  }
};

const destinationProviders: Partial<Record<DestinationProviderId, DestinationSearchProvider>> = {
  mock: mockDestinationProvider
};

const golfProviders: Partial<Record<GolfCourseProviderId, GolfCourseProvider>> = {
  mock: mockGolfProvider
};

const lodgingProviders: Partial<Record<LodgingProviderId, LodgingProvider>> = {
  mock: mockLodgingProvider
};

const teeTimeProviders: Partial<Record<TeeTimeProviderId, TeeTimeProvider>> = {
  mock: mockTeeTimeProvider
};

const vacationRentalProviders: Partial<Record<VacationRentalProviderId, VacationRentalProvider>> = {
  mock: mockVacationRentalProvider
};

function resolveImplementedProvider<Provider extends { definition: { label: string } }, ProviderId extends string>(
  configuredId: ProviderId,
  providers: Partial<Record<ProviderId, Provider>>,
  fallback: Provider,
  plannedDefinitions: Partial<Record<ProviderId, ProviderDefinition<ProviderId>>>
) {
  const configured = providers[configuredId];

  if (configured) {
    return configured;
  }

  const planned = plannedDefinitions[configuredId];

  if (planned) {
    logInfo("Planned provider requested, falling back to mock adapter", {
      requestedProvider: planned.label,
      fallbackProvider: fallback.definition.label,
      requiredEnv: planned.env
    });
  }

  return fallback;
}

export function getInventoryProviders(): InventoryProviderBundle {
  return {
    destinationSearch: resolveImplementedProvider(
      env.OUTING_DESTINATION_PROVIDER,
      destinationProviders,
      mockDestinationProvider,
      plannedDestinationDefinitions
    ),
    golfCourse: resolveImplementedProvider(
      env.OUTING_GOLF_COURSE_PROVIDER,
      golfProviders,
      mockGolfProvider,
      plannedGolfDefinitions
    ),
    lodging: resolveImplementedProvider(
      env.OUTING_LODGING_PROVIDER,
      lodgingProviders,
      mockLodgingProvider,
      plannedLodgingDefinitions
    ),
    teeTime: resolveImplementedProvider(
      env.OUTING_TEE_TIME_PROVIDER,
      teeTimeProviders,
      mockTeeTimeProvider,
      plannedTeeTimeDefinitions
    ),
    vacationRental: resolveImplementedProvider(
      env.OUTING_VACATION_RENTAL_PROVIDER,
      vacationRentalProviders,
      mockVacationRentalProvider,
      plannedVacationRentalDefinitions
    )
  };
}

export function getProviderDefinitions() {
  return {
    destinationSearch: [mockDestinationProvider.definition, ...Object.values(plannedDestinationDefinitions)],
    golfCourse: [mockGolfProvider.definition, ...Object.values(plannedGolfDefinitions)],
    lodging: [mockLodgingProvider.definition, ...Object.values(plannedLodgingDefinitions)],
    teeTime: [mockTeeTimeProvider.definition, ...Object.values(plannedTeeTimeDefinitions)],
    vacationRental: [
      mockVacationRentalProvider.definition,
      ...Object.values(plannedVacationRentalDefinitions)
    ]
  };
}
