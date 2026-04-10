# Provider Integrations

Outing.golf keeps all external inventory sources behind provider adapters so the product UI, demo seed flow, and recommendation engine only work with normalized inventory records.

## Current architecture

- [`src/modules/providers/interfaces.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/interfaces.ts): source-of-truth contracts for destination, golf course, lodging, tee-time, and vacation rental providers
- [`src/modules/providers/registry.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/registry.ts): environment-driven adapter selection plus planned official provider definitions
- [`src/modules/providers/inventory-service.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/inventory-service.ts): the only place the app orchestrates inventory fetching for an outing
- [`src/modules/providers/mock-providers.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/mock-providers.ts): realistic mock adapters used in local development, QA demos, and tests
- [`src/lib/demo/store.ts`](/Users/barris/Desktop/Golf Trip App/src/lib/demo/store.ts): consumes the inventory service instead of importing any concrete provider directly

## Why this shape matters

- The UI never calls provider-specific SDKs.
- The recommendation engine scores normalized destinations, courses, and stays instead of vendor payloads.
- Mock data and live providers can be swapped through config rather than page-level rewrites.
- Future tee-time and vacation rental inventory can join the same orchestration flow without changing the rest of the app contract.

## Environment variables

Provider selection:

- `OUTING_DESTINATION_PROVIDER`: `mock` or `google_places`
- `OUTING_GOLF_COURSE_PROVIDER`: `mock` or `google_places`
- `OUTING_LODGING_PROVIDER`: `mock` or `expedia_rapid`
- `OUTING_TEE_TIME_PROVIDER`: `mock` or `golfnow`
- `OUTING_VACATION_RENTAL_PROVIDER`: `mock` or `vrbo_compatible`
- `OUTING_PROVIDER_REQUEST_TIMEOUT_MS`: shared timeout budget for all provider requests

Official integration credentials:

- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_PLACES_SEARCH_RADIUS_METERS`
- `EXPEDIA_RAPID_API_KEY`
- `EXPEDIA_RAPID_API_HOST`
- `VRBO_API_KEY`
- `VRBO_API_BASE_URL`
- `GOLFNOW_API_KEY`
- `GOLFNOW_API_BASE_URL`

## Live and planned integrations

### Google Places / Maps

Status: implemented for destination search and golf course search

Use for:

- destination discovery
- golf course discovery
- place metadata and geo context

Current implementation:

- Destination search uses Google Places Text Search and maps results into `DestinationOption[]`
- Golf search uses Nearby Search when destination coordinates exist, then falls back to Text Search
- Adapter registration lives in [`src/modules/providers/registry.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/registry.ts)
- Payload mapping stays inside [`src/modules/providers/google-places.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/google-places.ts) so React and scoring logic still consume normalized records

Notes:

- Keep any Google-specific place IDs inside adapter-local mapping or future provider metadata columns
- Do not leak raw Google payloads into React components or scoring logic
- Rates and travel time are still estimated because Google Places does not provide full golf-trip pricing inventory

### Expedia Rapid

Use for:

- official hotel and resort inventory
- nightly rates and availability
- cancellation policy and property metadata later

Plug-in points:

- Implement `LodgingProvider`
- Normalize hotel results into `LodgingOption[]`
- Register the adapter in [`src/modules/providers/registry.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/registry.ts)

Notes:

- If Expedia returns room-level detail later, keep that detail inside the adapter or a future booking service
- The current product should still rank lodging at the normalized stay level

### Vrbo-compatible vacation rentals

Use for:

- whole-home inventory
- group-size fit
- house and villa style stays

Plug-in points:

- Implement `VacationRentalProvider`
- Normalize rentals into `VacationRentalOption[]`
- Merge or compare these records alongside lodging options inside [`src/modules/providers/inventory-service.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/inventory-service.ts) when the product is ready to surface rentals directly

Notes:

- Keep booking URLs and provider-specific listing IDs inside the adapter boundary until the booking UX is defined

### GolfNow or similar tee-time provider

Use for:

- live tee sheet inventory
- price-per-player
- remaining spots
- booking links

Plug-in points:

- Implement `TeeTimeProvider`
- Normalize tee times into `TeeTimeOption[]`
- Orchestrate tee-time fetches in [`src/modules/providers/inventory-service.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/inventory-service.ts) without changing the outing pages or recommendation engine contract

Notes:

- Tee times are future inventory. The current MVP stores course options, not live tee sheets.
- Keep tee-time logic behind the adapter until booking and hold flows are introduced.

## Implementation workflow for a live adapter

1. Add credentials to `.env.local`, QA, and production.
2. Create a concrete adapter that implements the correct provider interface.
3. Map the vendor response into the normalized Outing.golf shape inside that adapter.
4. Register it in [`src/modules/providers/registry.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/registry.ts).
5. Switch the matching `OUTING_*_PROVIDER` env var from `mock` to the live provider key in the target environment.
6. Verify the UI and scoring still behave the same, because they should only see normalized records.
