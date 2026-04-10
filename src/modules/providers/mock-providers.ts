import { generateId } from "@/lib/utils";
import type {
  DestinationOption,
  GolfCourseOption,
  LodgingOption,
  Outing
} from "@/types/domain";

import type {
  DestinationSearchProvider,
  GolfCourseProvider,
  LodgingProvider,
  TeeTimeProvider,
  VacationRentalProvider
} from "./interfaces";

const destinationCatalog = [
  {
    name: "Northern Michigan Loop",
    region: "Michigan",
    driveHours: 4.5,
    flightHours: null,
    averageNightlyRate: 265,
    averageRoundCost: 118,
    tags: ["driveable", "shoulder-season value", "group house friendly"],
    summary: "Easy logistics, strong public golf, and a low-friction trip for Midwest groups."
  },
  {
    name: "Pinehurst and the Sandhills",
    region: "North Carolina",
    driveHours: null,
    flightHours: 2.4,
    averageNightlyRate: 285,
    averageRoundCost: 165,
    tags: ["classic golf", "balanced", "easy weekend"],
    summary: "Classic golf destination energy with enough quality options for mixed groups."
  },
  {
    name: "Scottsdale Sun Split",
    region: "Arizona",
    driveHours: null,
    flightHours: 3.8,
    averageNightlyRate: 395,
    averageRoundCost: 225,
    tags: ["sun", "premium", "resort heavy"],
    summary: "Premium weather, polished stay options, and a bigger-budget destination feel."
  },
  {
    name: "Wisconsin Lake and Links",
    region: "Wisconsin",
    driveHours: 5.5,
    flightHours: 1.2,
    averageNightlyRate: 255,
    averageRoundCost: 145,
    tags: ["summer peak", "drive or short flight", "golf first"],
    summary: "A strong sweet spot for groups that want serious golf without a resort-only price tag."
  }
] as const;

const courseCatalog: Record<string, Array<Omit<GolfCourseOption, "id" | "outingId" | "destinationOptionId" | "providerKey">>> = {
  "Northern Michigan Loop": [
    {
      name: "Harbor Dunes",
      locationLabel: "Petoskey, Michigan",
      averageGreensFee: 125,
      qualityScore: 88,
      rideFriendly: true,
      walkingFriendly: true,
      summary: "Scenic and approachable, with enough teeth for the low-handicap players.",
      tags: ["public", "group favorite", "late-day replay"],
      featured: true,
      hidden: false
    },
    {
      name: "Torch Ridge Club",
      locationLabel: "Traverse City, Michigan",
      averageGreensFee: 149,
      qualityScore: 92,
      rideFriendly: true,
      walkingFriendly: false,
      summary: "Higher-end conditioning and the kind of round the whole group remembers.",
      tags: ["signature", "premium conditioning"],
      featured: false,
      hidden: false
    },
    {
      name: "Forest Nine and Dunes",
      locationLabel: "Gaylord, Michigan",
      averageGreensFee: 102,
      qualityScore: 83,
      rideFriendly: true,
      walkingFriendly: true,
      summary: "Easy to fit into the itinerary when budget flexibility matters.",
      tags: ["value", "easy logistics"],
      featured: false,
      hidden: false
    }
  ],
  "Pinehurst and the Sandhills": [
    {
      name: "Sandhills Commons",
      locationLabel: "Pinehurst, North Carolina",
      averageGreensFee: 168,
      qualityScore: 90,
      rideFriendly: true,
      walkingFriendly: true,
      summary: "Classic sand-belt feel with enough polish for a destination trip.",
      tags: ["classic", "walkable"],
      featured: true,
      hidden: false
    },
    {
      name: "Needle Pines No. 2",
      locationLabel: "Southern Pines, North Carolina",
      averageGreensFee: 192,
      qualityScore: 94,
      rideFriendly: false,
      walkingFriendly: true,
      summary: "Best if the group wants one marquee round with a stronger architectural identity.",
      tags: ["marquee", "golf-first"],
      featured: false,
      hidden: false
    },
    {
      name: "Longleaf Clubhouse Track",
      locationLabel: "Aberdeen, North Carolina",
      averageGreensFee: 118,
      qualityScore: 84,
      rideFriendly: true,
      walkingFriendly: true,
      summary: "A lower-pressure round that keeps the overall weekend budget in line.",
      tags: ["warm-up", "value"],
      featured: false,
      hidden: false
    }
  ],
  "Scottsdale Sun Split": [
    {
      name: "Saguaro Ridge",
      locationLabel: "Scottsdale, Arizona",
      averageGreensFee: 215,
      qualityScore: 89,
      rideFriendly: true,
      walkingFriendly: false,
      summary: "Reliable premium desert golf with minimal friction for larger groups.",
      tags: ["desert", "resort area"],
      featured: true,
      hidden: false
    },
    {
      name: "Canyon Greens Club",
      locationLabel: "Phoenix, Arizona",
      averageGreensFee: 238,
      qualityScore: 93,
      rideFriendly: true,
      walkingFriendly: false,
      summary: "The best all-around quality play if the group is okay stretching budget.",
      tags: ["signature", "sun guarantee"],
      featured: false,
      hidden: false
    },
    {
      name: "Sunset Arroyo",
      locationLabel: "Mesa, Arizona",
      averageGreensFee: 179,
      qualityScore: 82,
      rideFriendly: true,
      walkingFriendly: false,
      summary: "A cleaner fit for groups that want Scottsdale energy without the steepest rates.",
      tags: ["budget relief", "easy tee times"],
      featured: false,
      hidden: false
    }
  ],
  "Wisconsin Lake and Links": [
    {
      name: "Great Lakes Links",
      locationLabel: "Sheboygan, Wisconsin",
      averageGreensFee: 158,
      qualityScore: 91,
      rideFriendly: false,
      walkingFriendly: true,
      summary: "A memorable lake-influenced walk with real destination-trip energy.",
      tags: ["walkable", "destination"],
      featured: true,
      hidden: false
    },
    {
      name: "Prairie Mile Club",
      locationLabel: "Green Lake, Wisconsin",
      averageGreensFee: 136,
      qualityScore: 86,
      rideFriendly: true,
      walkingFriendly: true,
      summary: "A strong second-round option that keeps the overall budget balanced.",
      tags: ["balanced", "group-friendly"],
      featured: false,
      hidden: false
    },
    {
      name: "Badger Dunes",
      locationLabel: "Wisconsin Dells, Wisconsin",
      averageGreensFee: 121,
      qualityScore: 81,
      rideFriendly: true,
      walkingFriendly: true,
      summary: "Best for groups leaning toward a practical, low-drama weekend.",
      tags: ["value", "easy travel"],
      featured: false,
      hidden: false
    }
  ]
};

const lodgingCatalog: Record<string, Array<Omit<LodgingOption, "id" | "outingId" | "destinationOptionId" | "providerKey">>> = {
  "Northern Michigan Loop": [
    {
      name: "Bayview House",
      nightlyRate: 289,
      lodgingType: "house",
      sleeps: 10,
      summary: "Open kitchen, patio, and enough beds to keep the group together.",
      tags: ["shared-space", "group house", "easy parking"],
      featured: true,
      hidden: false
    },
    {
      name: "Harbor Lodge Suites",
      nightlyRate: 248,
      lodgingType: "hotel",
      sleeps: 8,
      summary: "Simple downtown base with easier room-by-room flexibility.",
      tags: ["walkable", "easy booking"],
      featured: false,
      hidden: false
    },
    {
      name: "Duneside Resort",
      nightlyRate: 342,
      lodgingType: "resort",
      sleeps: 8,
      summary: "Higher polish and onsite amenities if the group wants a more turnkey weekend.",
      tags: ["resort", "premium"],
      featured: false,
      hidden: false
    }
  ],
  "Pinehurst and the Sandhills": [
    {
      name: "Village Fairways House",
      nightlyRate: 315,
      lodgingType: "house",
      sleeps: 10,
      summary: "Best for keeping the trip social while staying close to multiple courses.",
      tags: ["house", "close to golf"],
      featured: true,
      hidden: false
    },
    {
      name: "Sandhills Inn",
      nightlyRate: 232,
      lodgingType: "hotel",
      sleeps: 8,
      summary: "A cleaner budget fit with easy arrivals and departures.",
      tags: ["hotel", "simple"],
      featured: false,
      hidden: false
    },
    {
      name: "Pine Terrace Resort",
      nightlyRate: 368,
      lodgingType: "resort",
      sleeps: 8,
      summary: "Most polished stay option for groups that want a premium tone end to end.",
      tags: ["resort", "elevated"],
      featured: false,
      hidden: false
    }
  ],
  "Scottsdale Sun Split": [
    {
      name: "Desert Eight Villa",
      nightlyRate: 445,
      lodgingType: "house",
      sleeps: 10,
      summary: "Pool, patio, and enough breathing room to make the higher budget feel worth it.",
      tags: ["villa", "pool", "group stay"],
      featured: true,
      hidden: false
    },
    {
      name: "Camelback Suites",
      nightlyRate: 334,
      lodgingType: "hotel",
      sleeps: 8,
      summary: "Good if the group wants Scottsdale access without committing to full resort pricing.",
      tags: ["hotel", "central"],
      featured: false,
      hidden: false
    },
    {
      name: "Sonoran Resort Club",
      nightlyRate: 498,
      lodgingType: "resort",
      sleeps: 8,
      summary: "The easiest premium option when service and amenities matter more than total cost.",
      tags: ["resort", "amenities", "premium"],
      featured: false,
      hidden: false
    }
  ],
  "Wisconsin Lake and Links": [
    {
      name: "Lake House Row",
      nightlyRate: 274,
      lodgingType: "house",
      sleeps: 10,
      summary: "An easy social base for a golf-first group that still wants downtime together.",
      tags: ["group house", "lake view"],
      featured: true,
      hidden: false
    },
    {
      name: "Fairway Motor Lodge",
      nightlyRate: 219,
      lodgingType: "hotel",
      sleeps: 8,
      summary: "Budget-friendlier rooms and simple logistics for one-night stopovers.",
      tags: ["hotel", "value"],
      featured: false,
      hidden: false
    },
    {
      name: "Links Harbor Resort",
      nightlyRate: 336,
      lodgingType: "resort",
      sleeps: 8,
      summary: "A stronger finish if the group wants to upgrade the overall trip feel.",
      tags: ["resort", "lakefront"],
      featured: false,
      hidden: false
    }
  ]
};

function genericCourseCatalog(destination: DestinationOption) {
  return [
    {
      name: `${destination.name} Golf Club`,
      locationLabel: `${destination.name}, ${destination.region}`,
      averageGreensFee: Math.max(95, destination.averageRoundCost - 10),
      qualityScore: 84,
      rideFriendly: true,
      walkingFriendly: true,
      summary: `Reliable public golf near ${destination.name} that keeps the planning flow moving even before a live course feed is fully mapped.`,
      tags: ["public", "group-friendly", "balanced"],
      featured: true,
      hidden: false
    },
    {
      name: `${destination.name} Resort Course`,
      locationLabel: `${destination.name}, ${destination.region}`,
      averageGreensFee: destination.averageRoundCost + 20,
      qualityScore: 89,
      rideFriendly: true,
      walkingFriendly: false,
      summary: `A higher-polish option near ${destination.name} if the group wants one more premium round on the itinerary.`,
      tags: ["premium", "destination", "cart-friendly"],
      featured: false,
      hidden: false
    },
    {
      name: `${destination.name} Municipal Links`,
      locationLabel: `${destination.name}, ${destination.region}`,
      averageGreensFee: Math.max(75, destination.averageRoundCost - 30),
      qualityScore: 80,
      rideFriendly: true,
      walkingFriendly: true,
      summary: `A budget-relief round that gives the group flexibility without forcing a full reset on the trip plan.`,
      tags: ["value", "walkable", "easy-logistics"],
      featured: false,
      hidden: false
    }
  ] satisfies Array<
    Omit<GolfCourseOption, "id" | "outingId" | "destinationOptionId" | "providerKey">
  >;
}

function genericLodgingCatalog(destination: DestinationOption, guests: number) {
  return [
    {
      name: `${destination.name} Group House`,
      nightlyRate: Math.max(220, destination.averageNightlyRate + 20),
      lodgingType: "house" as const,
      sleeps: Math.max(guests, 8),
      summary: `Shared common space and enough beds to keep the group together near ${destination.name}.`,
      tags: ["group house", "shared-space", "easy logistics"],
      featured: true,
      hidden: false
    },
    {
      name: `${destination.name} Stay & Suites`,
      nightlyRate: Math.max(180, destination.averageNightlyRate - 25),
      lodgingType: "hotel" as const,
      sleeps: Math.max(guests, 4),
      summary: `Straightforward hotel option if the group wants simpler arrivals, departures, and room-by-room flexibility.`,
      tags: ["hotel", "simple", "central"],
      featured: false,
      hidden: false
    },
    {
      name: `${destination.name} Resort`,
      nightlyRate: Math.max(260, destination.averageNightlyRate + 55),
      lodgingType: "resort" as const,
      sleeps: Math.max(guests, 4),
      summary: `A more polished stay if the group wants amenities and a stronger destination-trip feel.`,
      tags: ["resort", "amenities", "premium"],
      featured: false,
      hidden: false
    }
  ] satisfies Array<Omit<LodgingOption, "id" | "outingId" | "destinationOptionId" | "providerKey">>;
}

function baseDestinations(outing: Outing): DestinationOption[] {
  return destinationCatalog.map((destination, index) => ({
    id: generateId("destination"),
    outingId: outing.id,
    providerKey: "mock-destination",
    ...destination,
    tags: [...destination.tags],
    featured: index < 2,
    hidden: false
  }));
}

export const mockDestinationProvider: DestinationSearchProvider = {
  definition: {
    id: "mock",
    key: "mock-destination",
    label: "Mock destination catalog",
    availability: "implemented",
    env: [],
    notes: "Seeded destination inventory for local product development and QA.",
    integrationTouchpoints: [
      "src/modules/providers/mock-providers.ts",
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts"
    ]
  },
  async searchDestinations({ outing }) {
    return baseDestinations(outing);
  }
};

export const mockGolfProvider: GolfCourseProvider = {
  definition: {
    id: "mock",
    key: "mock-golf",
    label: "Mock golf course catalog",
    availability: "implemented",
    env: [],
    notes: "Seeded course inventory aligned to the mock destinations.",
    integrationTouchpoints: [
      "src/modules/providers/mock-providers.ts",
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts"
    ]
  },
  async searchCourses({ outing, destinations }) {
    return destinations.flatMap((destination) =>
      (courseCatalog[destination.name] ?? genericCourseCatalog(destination)).map((course) => ({
        id: generateId("course"),
        outingId: outing.id,
        destinationOptionId: destination.id,
        providerKey: "mock-golf",
        ...course,
        tags: [...course.tags]
      }))
    );
  }
};

export const mockLodgingProvider: LodgingProvider = {
  definition: {
    id: "mock",
    key: "mock-lodging",
    label: "Mock lodging catalog",
    availability: "implemented",
    env: [],
    notes: "Seeded hotel, resort, and house inventory for the current outing destinations.",
    integrationTouchpoints: [
      "src/modules/providers/mock-providers.ts",
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts"
    ]
  },
  async searchLodging({ outing, destinations, preferredType }) {
    return destinations.flatMap((destination) =>
      (lodgingCatalog[destination.name] ?? genericLodgingCatalog(destination, outing.numberOfPlayers)).map((stay) => ({
        id: generateId("lodging"),
        outingId: outing.id,
        destinationOptionId: destination.id,
        providerKey: "mock-lodging",
        ...stay,
        tags: [...stay.tags],
        sleeps: Math.max(stay.sleeps, outing.numberOfPlayers),
        featured: stay.lodgingType === preferredType || stay.featured
      }))
    );
  }
};

export const mockTeeTimeProvider: TeeTimeProvider = {
  definition: {
    id: "mock",
    key: "mock-tee-times",
    label: "Mock tee time feed",
    availability: "implemented",
    env: [],
    notes: "Seeded tee sheets to exercise future booking and pricing flows before a live provider is connected.",
    integrationTouchpoints: [
      "src/modules/providers/mock-providers.ts",
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts"
    ]
  },
  async searchTeeTimes({ golfCourses, preferredDates, players }) {
    const datePool = preferredDates?.length ? preferredDates : [new Date().toISOString().slice(0, 10)];

    return golfCourses.slice(0, 6).flatMap((course, index) =>
      datePool.slice(0, 2).map((teeDate, dateIndex) => ({
        id: generateId("tee"),
        providerKey: "mock-tee-times",
        golfCourseOptionId: course.id,
        teeDate,
        teeTimeLocal: `${8 + index + dateIndex}:3${dateIndex} AM`,
        walkingAllowed: course.walkingFriendly,
        ridingAllowed: course.rideFriendly,
        pricePerPlayer: course.averageGreensFee + 15,
        remainingSpots: Math.max(players, 4),
        bookingUrl: null
      }))
    );
  }
};

export const mockVacationRentalProvider: VacationRentalProvider = {
  definition: {
    id: "mock",
    key: "mock-vacation-rentals",
    label: "Mock vacation rental catalog",
    availability: "implemented",
    env: [],
    notes: "Seeded whole-home inventory that mirrors where a future Vrbo-compatible adapter will normalize rental stays.",
    integrationTouchpoints: [
      "src/modules/providers/mock-providers.ts",
      "src/modules/providers/registry.ts",
      "src/modules/providers/inventory-service.ts"
    ]
  },
  async searchVacationRentals({ destinations, guests }) {
    return destinations.flatMap((destination) =>
      (lodgingCatalog[destination.name] ?? genericLodgingCatalog(destination, guests))
        .filter((stay) => stay.lodgingType === "house" || stay.lodgingType === "mixed")
        .map((stay, index) => ({
          id: generateId("rental"),
          providerKey: "mock-vacation-rentals",
          destinationOptionId: destination.id,
          name: `${stay.name} Rental ${index + 1}`,
          nightlyRate: stay.nightlyRate,
          sleeps: Math.max(stay.sleeps, guests),
          bedrooms: Math.max(4, Math.ceil(guests / 2)),
          summary: stay.summary,
          tags: [...stay.tags],
          bookingUrl: null
        }))
    );
  }
};
