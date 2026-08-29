import { getDemoState } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/env";
import {
  defaultLandingPageSettings,
  defaultSiteProfileSettings,
  normalizeLandingPageSettings,
  normalizeSiteProfileSettings
} from "@/lib/site-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUsers() {
  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("profiles")
        .select("id,email,full_name,app_role,created_at")
        .order("created_at", { ascending: false });
      return (data ?? []).map((u) => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name as string,
        appRole: u.app_role as string,
        createdAt: u.created_at as string
      }));
    }
  }
  const state = await getDemoState();
  return state.profiles.map((p) => ({
    id: p.id,
    email: p.email,
    fullName: p.fullName,
    appRole: p.appRole,
    createdAt: p.createdAt
  }));
}

export async function getAdminOutings() {
  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("outings")
        .select("id,name,status,number_of_players,budget_target,destination_label,organizer_id,created_at")
        .order("created_at", { ascending: false });
      return (data ?? []).map((o) => ({
        id: o.id,
        name: o.name as string,
        status: o.status as string,
        numberOfPlayers: o.number_of_players as number,
        budgetTarget: o.budget_target as number | null,
        destinationLabel: o.destination_label as string | null,
        organizerId: o.organizer_id as string,
        createdAt: o.created_at as string
      }));
    }
  }
  const state = await getDemoState();
  return state.outings.map((o) => ({
    id: o.id,
    name: o.name,
    status: o.status,
    numberOfPlayers: o.numberOfPlayers,
    budgetTarget: o.budgetTarget ?? null,
    destinationLabel: o.destinationLabel,
    organizerId: o.organizerId,
    createdAt: o.createdAt
  }));
}

export async function getAdminInvites() {
  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("invites")
        .select("id,outing_id,email,invited_by,status,created_at")
        .order("created_at", { ascending: false });
      return (data ?? []).map((i) => ({
        id: i.id,
        outingId: i.outing_id as string,
        email: i.email as string,
        invitedBy: i.invited_by as string,
        status: i.status as string,
        createdAt: i.created_at as string
      }));
    }
  }
  const state = await getDemoState();
  return state.invites.map((i) => ({
    id: i.id,
    outingId: i.outingId,
    email: i.email,
    invitedBy: i.invitedBy,
    status: i.status,
    createdAt: i.createdAt
  }));
}

export async function getAdminMessages() {
  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("chat_messages")
        .select("id,outing_id,profile_id,message,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      return (data ?? []).map((m) => ({
        id: m.id,
        outingId: m.outing_id as string,
        profileId: m.profile_id as string,
        message: m.message as string,
        createdAt: m.created_at as string
      }));
    }
  }
  const state = await getDemoState();
  return [...state.chatMessages].reverse().map((m) => ({
    id: m.id,
    outingId: m.outingId,
    profileId: m.profileId,
    message: m.message,
    createdAt: m.createdAt
  }));
}

const fallbackGateBlock = {
  key: "site_access_gate",
  title: "Website coming soon",
  body: "We're still getting the public site ready. If you have private preview access, enter the password below.",
  ctaLabel: null,
  ctaHref: null,
  updatedAt: new Date().toISOString()
};

type AdminDashboardSnapshot = {
  profiles: Array<{
    id: string;
    email: string;
    full_name: string;
    app_role: string;
    created_at: string;
  }>;
  outings: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
  }>;
  content_blocks: Array<{
    key: string;
    title: string;
    body: string;
    cta_label: string | null;
    cta_href: string | null;
    updated_at: string;
  }>;
  feature_flags: Array<{
    key: string;
    label: string;
    enabled: boolean;
    updated_at: string;
  }>;
  admin_settings: Array<{ key: string; value: unknown }>;
  destination_options: Array<{
    id: string;
    name: string;
    summary: string;
    featured: boolean;
    hidden: boolean;
    created_at: string;
  }>;
  golf_course_options: Array<{
    id: string;
    name: string;
    summary: string;
    featured: boolean;
    hidden: boolean;
    created_at: string;
  }>;
  lodging_options: Array<{
    id: string;
    name: string;
    summary: string;
    featured: boolean;
    hidden: boolean;
    created_at: string;
  }>;
  lodging_api_errors: Array<{
    id: string;
    route: string;
    error_message: string;
    created_at: string;
  }>;
  lodging_mock_fallback_enabled: boolean;
  analytics: {
    total_users: number;
    total_outings: number;
    active_invites: number;
    total_messages: number;
  };
};

export async function getAdminDashboardData() {
  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .rpc("get_admin_dashboard_snapshot")
        .abortSignal(AbortSignal.timeout(6000));

      if (error || !data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error(`Admin dashboard data unavailable: ${error?.message ?? "empty response"}`);
      }

      const snapshot = data as unknown as AdminDashboardSnapshot;
      const profiles = snapshot.profiles ?? [];
      const outings = snapshot.outings ?? [];
      const rawContentBlocks = snapshot.content_blocks ?? [];
      const featureFlags = snapshot.feature_flags ?? [];
      const adminSettings = snapshot.admin_settings ?? [];
      const analytics = snapshot.analytics;
      const recentErrors = snapshot.lodging_api_errors ?? [];

      const contentBlocks = rawContentBlocks.map((block) => ({
        key: block.key,
        title: block.title,
        body: block.body,
        ctaLabel: block.cta_label ?? null,
        ctaHref: block.cta_href ?? null,
        updatedAt: block.updated_at
      }));

      if (!contentBlocks.some((block) => block.key === "site_access_gate")) {
        contentBlocks.push(fallbackGateBlock);
      }

      const adminSettingsMap = new Map(adminSettings.map((setting) => [setting.key, setting.value]));

      return {
        users: profiles.map((user) => ({
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          appRole: user.app_role,
          createdAt: user.created_at
        })),
        outings,
        contentBlocks,
        ownerSettings: normalizeSiteProfileSettings(adminSettingsMap.get("site_profile")),
        landingPageSettings: normalizeLandingPageSettings(adminSettingsMap.get("landing_page")),
        featureFlags,
        destinationOptions: snapshot.destination_options ?? [],
        golfCourseOptions: snapshot.golf_course_options ?? [],
        lodgingOptions: snapshot.lodging_options ?? [],
        analytics: {
          totalUsers: analytics.total_users ?? 0,
          totalOutings: analytics.total_outings ?? 0,
          activeInvites: analytics.active_invites ?? 0,
          totalMessages: analytics.total_messages ?? 0
        },
        lodgingIntegration: {
          configured: Boolean(process.env.LITEAPI_API_KEY),
          mode: "live",
          provider: process.env.OUTING_LODGING_PROVIDER ?? "mock",
          baseUrl: process.env.LITEAPI_BASE_URL ?? "",
          bookBaseUrl: process.env.LITEAPI_BOOK_BASE_URL ?? "",
          devMockFallbackEnabled: Boolean(snapshot.lodging_mock_fallback_enabled),
          recentErrors
        }
      };
    }
  }

  const state = await getDemoState();

  return {
    users: state.profiles,
    outings: state.outings,
    contentBlocks: state.contentBlocks.some((block) => block.key === "site_access_gate")
      ? state.contentBlocks
      : [...state.contentBlocks, fallbackGateBlock],
    ownerSettings: defaultSiteProfileSettings,
    landingPageSettings: defaultLandingPageSettings,
    featureFlags: state.featureFlags,
    destinationOptions: state.destinationOptions.slice(0, 8),
    golfCourseOptions: state.golfCourseOptions.slice(0, 8),
    lodgingOptions: state.lodgingOptions.slice(0, 8),
    analytics: {
      totalUsers: state.profiles.length,
      totalOutings: state.outings.length,
      activeInvites: state.invites.filter((invite) => invite.status === "pending").length,
      totalMessages: state.chatMessages.length
    },
    lodgingIntegration: {
      configured: false,
      mode: "demo",
      provider: "mock",
      baseUrl: "",
      bookBaseUrl: "",
      devMockFallbackEnabled: false,
      recentErrors: []
    }
  };
}
