import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  NEXT_PUBLIC_APP_ENV_LABEL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  RESEND_REPLY_TO_EMAIL: z.string().optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_BRANCH_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  OUTING_DESTINATION_PROVIDER: z.enum(["mock", "google_places"]).default("mock"),
  OUTING_GOLF_COURSE_PROVIDER: z.enum(["mock", "google_places"]).default("mock"),
  OUTING_LODGING_PROVIDER: z.enum(["mock", "expedia_rapid", "liteapi"]).default("mock"),
  OUTING_TEE_TIME_PROVIDER: z.enum(["mock", "golfnow"]).default("mock"),
  OUTING_VACATION_RENTAL_PROVIDER: z.enum(["mock", "vrbo_compatible"]).default("mock"),
  OUTING_PROVIDER_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  GOOGLE_PLACES_SEARCH_RADIUS_METERS: z.coerce.number().int().positive().optional(),
  LITEAPI_BASE_URL: z.string().url().default("https://api.liteapi.travel/v3.0"),
  LITEAPI_BOOK_BASE_URL: z.string().url().default("https://book.liteapi.travel/v3.0"),
  LITEAPI_API_KEY: z.string().optional(),
  EXPEDIA_RAPID_API_KEY: z.string().optional(),
  EXPEDIA_RAPID_API_HOST: z.string().optional(),
  VRBO_API_KEY: z.string().optional(),
  VRBO_API_BASE_URL: z.string().url().optional(),
  GOLFNOW_API_KEY: z.string().optional(),
  GOLFNOW_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_ENABLE_DEMO: z
    .string()
    .optional()
    .transform((value) => value !== "false"),
  SITE_ACCESS_ENABLED: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  SITE_ACCESS_PASSWORD: z.string().optional(),
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)
        : []
    )
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

export const env = parsed.data;

export const supabasePublicKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(supabasePublicKey);

export const isDemoMode = env.NEXT_PUBLIC_ENABLE_DEMO || !isSupabaseConfigured;
export const isSiteAccessEnabled = env.SITE_ACCESS_ENABLED;
export const siteAccessPassword = env.SITE_ACCESS_PASSWORD;
export const adminEmails = env.ADMIN_EMAILS;

function normalizeDeploymentUrl(value?: string) {
  if (!value) {
    return null;
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

const inferredEnvironment =
  env.VERCEL_ENV ?? (env.NODE_ENV === "production" ? "production" : "development");

export const appEnvironment = inferredEnvironment;
export const isPreviewEnvironment = inferredEnvironment === "preview";
export const isProductionEnvironment = inferredEnvironment === "production";
export const environmentLabel =
  env.NEXT_PUBLIC_APP_ENV_LABEL ??
  (isPreviewEnvironment ? "QA Preview" : isProductionEnvironment ? "Production" : "Local");

export const deploymentUrl =
  normalizeDeploymentUrl(env.VERCEL_BRANCH_URL) ??
  normalizeDeploymentUrl(env.VERCEL_URL) ??
  env.NEXT_PUBLIC_APP_URL;

export const productionAppUrl =
  normalizeDeploymentUrl(env.VERCEL_PROJECT_PRODUCTION_URL) ?? env.NEXT_PUBLIC_APP_URL;

export const publicAppUrl = isProductionEnvironment ? productionAppUrl : deploymentUrl;
