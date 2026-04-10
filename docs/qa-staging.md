# QA and Staging Setup

This project supports three clear modes:

- Local demo mode: zero external dependencies, seeded file-backed mock data
- QA / staging: real Supabase project, preview deployments on Vercel
- Production: separate Supabase project, production deployment on Vercel

## Environment model

Use separate Supabase projects for QA and production.

Recommended mapping:

- Local: `.env.local` with `NEXT_PUBLIC_ENABLE_DEMO=true`
- Vercel Preview / QA: QA Supabase keys and `NEXT_PUBLIC_ENABLE_DEMO=false`
- Vercel Production: production Supabase keys and `NEXT_PUBLIC_ENABLE_DEMO=false`

## Required environment variables

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_ENV_LABEL` optional friendly label for the current environment
- `NEXT_PUBLIC_ENABLE_DEMO`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Vercel-provided environment touchpoints

The app uses these Vercel-provided values when available to power the preview banner and `/qa` screen:

- `VERCEL_ENV`
- `VERCEL_URL`
- `VERCEL_BRANCH_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`

These are informational only. You do not need to set them manually when deploying on Vercel.

## Local QA checklist

1. Run `npm install`
2. Copy `.env.example` to `.env.local`
3. Use demo mode for quick UI checks
4. Run `npm run build`
5. Run `npm test`
6. Run `npm run test:e2e`

## Preview / staging checklist

1. Create or confirm a QA Supabase project
2. Apply [`supabase/migrations/20260409193000_init.sql`](/Users/barris/Desktop/Golf Trip App/supabase/migrations/20260409193000_init.sql)
3. Run [`supabase/seed.sql`](/Users/barris/Desktop/Golf Trip App/supabase/seed.sql)
4. Add QA env vars in Vercel Preview environment
5. Deploy the preview branch
6. Open `/qa`
7. Verify:
   - landing page
   - sign up / sign in
   - create outing
   - compare flow
   - admin dashboard
   - `/api/health`

## Suggested QA scenarios

- Organizer creates a new outing with default settings
- Invitee submits preferences on mobile width
- Organizer reviews compare page and shortlist
- Admin updates homepage copy and toggles a feature flag
- Unauthorized user cannot access another outing

## Production cutover notes

- Do not reuse QA Supabase credentials in production
- Re-run migrations against production
- Seed only the content and flags you want to ship
- Replace placeholder legal copy and final brand assets before launch
