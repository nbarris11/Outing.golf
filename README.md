# Outing.golf

Outing.golf is a production-minded Next.js App Router MVP for planning golf outings and golf trips without spreadsheets, budget confusion, or endless group texts.

This scaffold is intentionally built in two modes:

- Demo mode: works immediately with seeded in-memory data so the product can be tested right away.
- Supabase mode: uses Supabase Auth, Postgres, Realtime, and Storage-ready architecture once environment variables are connected.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / Postgres / Realtime / Storage-ready architecture
- Vercel deployment target
- Vitest for unit tests
- Playwright for E2E happy paths

## MVP routes

- `/` landing page
- `/how-it-works`
- `/sign-in`
- `/sign-up`
- `/dashboard`
- `/qa`
- `/outings/new`
- `/outings/[outingId]`
- `/outings/[outingId]/compare`
- `/admin`
- `/settings`
- `/legal/privacy`
- `/legal/terms`

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://127.0.0.1:3000`

### Demo accounts

- `host@outing.golf`
- `friend@outing.golf`
- `admin@outing.golf`

In demo mode, any password works for existing seeded users.

## Supabase setup

Use separate Supabase projects for:

- Local dev or a disposable test project
- QA / staging
- Production

Set these environment variables in each environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (optional newer Supabase public key format)
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `OUTING_DESTINATION_PROVIDER`
- `OUTING_GOLF_COURSE_PROVIDER`
- `OUTING_LODGING_PROVIDER`
- `OUTING_TEE_TIME_PROVIDER`
- `OUTING_VACATION_RENTAL_PROVIDER`
- `LITEAPI_BASE_URL`
- `LITEAPI_BOOK_BASE_URL`
- `LITEAPI_API_KEY`

If Supabase env vars are missing, the app falls back to demo mode automatically.

### Migration strategy

- Schema lives in [`supabase/migrations/20260409193000_init.sql`](/Users/barris/Desktop/Golf Trip App/supabase/migrations/20260409193000_init.sql)
- Seed content lives in [`supabase/seed.sql`](/Users/barris/Desktop/Golf Trip App/supabase/seed.sql)
- Demo seed summary script lives in [`scripts/seed.ts`](/Users/barris/Desktop/Golf Trip App/scripts/seed.ts)

Recommended workflow:

1. Create a new Supabase project per environment.
2. Apply migrations in order.
3. Run `supabase/seed.sql` for base feature flags and content blocks.
4. Add real auth users and corresponding `profiles` rows.
5. Enable Realtime on `chat_messages`.

### Google sign-in

The app now includes a Google sign-in button on the auth screens when demo mode is off and Supabase is configured.

To finish setup outside the codebase:

1. In Google Cloud, create a Web OAuth client.
2. Add your site origin under Authorized JavaScript origins.
3. Add your Supabase Google callback URL under Authorized redirect URIs.
4. In Supabase Auth, enable the Google provider and paste in the Google client ID and client secret.
5. Add your app callback URL to the Supabase redirect allow list:
   - `http://127.0.0.1:3000/auth/callback` for local
   - your production `/auth/callback` URL for live

The app callback route lives at [`app/auth/callback/route.ts`](/Users/barris/Desktop/Golf Trip App/app/auth/callback/route.ts).

### Invite emails

Invite sending uses Resend in live mode.

Required envs:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL` (optional)

Recommended setup:

1. Create a Resend account.
2. Verify a sending domain.
3. Set `RESEND_FROM_EMAIL` to a verified sender like `invites@yourdomain.com`.
4. Add the env vars in Vercel production.

## Security model

- Row-level security is enabled for private outing tables.
- Outing access is limited to organizer, invited members, or admins.
- Admin tables are protected with `public.is_admin()`.
- Secrets stay server-side.
- Forms are validated server-side before writes.

## Architecture notes

- `src/lib/auth.ts`: session/profile access abstraction
- `src/lib/supabase/*`: Supabase client helpers
- `src/lib/demo/*`: immediate local demo mode
- `src/modules/outings/scoring.ts`: rules-based recommendation engine v1
- `src/modules/providers/*`: provider-agnostic adapter contracts and mock providers
- `src/lib/actions/*`: server actions for auth, outings, and admin writes

## Provider strategy

The app is intentionally not built around scraping. Inventory is resolved through a provider registry and a single orchestration service so the UI, demo seed flow, and recommendation engine all consume normalized option shapes instead of provider-specific payloads.

Current contracts:

- Destination search provider
- Golf course provider
- Lodging provider
- Tee-time provider
- Vacation rental provider

Primary touchpoints:

- [`src/modules/providers/interfaces.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/interfaces.ts): adapter contracts and normalized future inventory types
- [`src/modules/providers/registry.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/registry.ts): env-driven provider selection and planned official adapters
- [`src/modules/providers/inventory-service.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/inventory-service.ts): single inventory orchestration layer
- [`src/modules/providers/mock-providers.ts`](/Users/barris/Desktop/Golf Trip App/src/modules/providers/mock-providers.ts): seeded mock adapters used today

Planned adapters:

- Google Places / Maps for destination and golf search
- liteAPI for lodging search, prebook, and booking
- Expedia Rapid
- Vrbo-compatible lodging integration
- GolfNow or similar tee-time providers
- Stripe later for monetization

Provider envs:

- `OUTING_DESTINATION_PROVIDER`: `mock` or `google_places`
- `OUTING_GOLF_COURSE_PROVIDER`: `mock` or `google_places`
- `OUTING_LODGING_PROVIDER`: `mock`, `liteapi`, or `expedia_rapid`
- `OUTING_TEE_TIME_PROVIDER`: `mock` or `golfnow`
- `OUTING_VACATION_RENTAL_PROVIDER`: `mock` or `vrbo_compatible`
- `OUTING_PROVIDER_REQUEST_TIMEOUT_MS`: shared timeout budget for provider requests
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_PLACES_SEARCH_RADIUS_METERS`
- `LITEAPI_BASE_URL`
- `LITEAPI_BOOK_BASE_URL`
- `LITEAPI_API_KEY`
- `EXPEDIA_RAPID_API_KEY`
- `EXPEDIA_RAPID_API_HOST`
- `VRBO_API_KEY`
- `VRBO_API_BASE_URL`
- `GOLFNOW_API_KEY`
- `GOLFNOW_API_BASE_URL`

Detailed integration notes live in [docs/provider-integrations.md](/Users/barris/Desktop/Golf Trip App/docs/provider-integrations.md).

## liteAPI lodging integration

All liteAPI calls are server-side only. The browser talks only to internal Next.js routes such as:

- `/api/lodging/search`
- `/api/lodging/prebook`
- `/api/lodging/book`

Required envs:

- `LITEAPI_BASE_URL`
- `LITEAPI_BOOK_BASE_URL`
- `LITEAPI_API_KEY`

Sandbox defaults:

- search and rates: `https://api.liteapi.travel/v3.0`
- prebook and booking: `https://book.liteapi.travel/v3.0`

How search works:

1. The compare page posts normalized input to `/api/lodging/search`.
2. The route validates input and checks outing access.
3. The server calls liteAPI `/hotels/rates`.
4. The response is normalized into a UI-safe lodging shape.
5. Organizers can save a result into `lodging_options` and mark a top pick.

How prebook works:

1. The server receives an `offerId`.
2. It calls liteAPI `/rates/prebook`.
3. It stores the prebook in `lodging_prebooks`.
4. The route returns only the fields the UI needs for a safe review step.

How booking works:

1. The server receives a `prebookId`, guest details, and payment payload.
2. It calls liteAPI `/rates/book`.
3. It stores the booking result in `lodging_bookings`.
4. This is currently built for sandbox-first testing and is not exposed in the public UI yet.

Development fallback:

- If liteAPI fails or returns no results, the app can fall back to mock lodging data only in development.
- That fallback is controlled by the `lodging_mock_fallback` feature flag.
- Production never falls back to mock lodging silently.

## QA and staging notes

- Recommended Vercel project layout: one Vercel project with preview deployments for QA and production deployment for live.
- Connect preview/QA env vars to the QA Supabase project.
- Connect production env vars to the production Supabase project.
- Keep `NEXT_PUBLIC_ENABLE_DEMO=false` in QA and production once Supabase is active.
- Use seeded content blocks and feature flags to sanity-check admin publishing before launch.
- Use `/qa` as the reviewer-facing preview screen for environment status, smoke-test links, and release checks.
- Detailed QA and staging instructions live in [docs/qa-staging.md](/Users/barris/Desktop/Golf Trip App/docs/qa-staging.md).

## Vercel deployment notes

1. Create a Vercel project from this repository.
2. Add the env vars from `.env.example`.
3. Point Preview to QA Supabase keys.
4. Point Production to production Supabase keys.
5. Run build command:

```bash
npm run build
```

6. Optional post-deploy checks:

- `/api/health`
- sign in
- create outing
- admin access
- compare flow

## Tests

Unit tests:

```bash
npm test
```

E2E tests:

```bash
npm run test:e2e
```

Covered happy paths:

- sign up
- create outing
- invite users
- submit preferences
- view recommendations / compare
- chat access protection
- admin dashboard access

## Notes on the current logo

The repository includes an in-code premium placeholder logo and favicon concept so the product is fully usable right now. If you drop in the final Outing.golf logo asset later, the easiest swap point is [`src/components/branding/logo.tsx`](/Users/barris/Desktop/Golf Trip App/src/components/branding/logo.tsx).
