import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OUTING_DESTINATION_PROVIDER: z.enum(["mock", "google_places"]).default("mock"),
  OUTING_GOLF_COURSE_PROVIDER: z.enum(["mock", "google_places"]).default("mock"),
  OUTING_LODGING_PROVIDER: z.enum(["mock", "expedia_rapid"]).default("mock"),
  OUTING_TEE_TIME_PROVIDER: z.enum(["mock", "golfnow"]).default("mock"),
  OUTING_VACATION_RENTAL_PROVIDER: z.enum(["mock", "vrbo_compatible"]).default("mock"),
  OUTING_PROVIDER_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  GOOGLE_PLACES_SEARCH_RADIUS_METERS: z.coerce.number().int().positive().optional(),
  EXPEDIA_RAPID_API_KEY: z.string().optional(),
  EXPEDIA_RAPID_API_HOST: z.string().optional(),
  VRBO_API_KEY: z.string().optional(),
  VRBO_API_BASE_URL: z.string().url().optional(),
  GOLFNOW_API_KEY: z.string().optional(),
  GOLFNOW_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_ENABLE_DEMO: z
    .string()
    .optional()
    .transform((value) => value !== "false")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

export const env = parsed.data;

export const isSupabaseConfigured =
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isDemoMode = env.NEXT_PUBLIC_ENABLE_DEMO || !isSupabaseConfigured;
