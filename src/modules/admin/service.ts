import { getDemoState } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/env";
import { getLodgingIntegrationStatus } from "@/lib/lodging/service";
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

export async function getAdminDashboardData() {
  if (!isDemoMode) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const [
        profilesResult,
        outingsResult,
        contentBlocksResult,
        featureFlagsResult,
        adminSettingsResult,
        destinationOptionsResult,
        golfCourseOptionsResult,
        lodgingOptionsResult,
        totalProfilesResult,
        totalOutingsResult,
        invitesResult,
        messagesResult
      ] = await Promise.all([
        supabase.from("profiles").select("id,email,full_name,app_role,created_at").order("created_at", { ascending: false }).limit(12),
        supabase.from("outings").select("id,name,status,created_at").order("created_at", { ascending: false }).limit(12),
        supabase.from("content_blocks").select("key,title,body,cta_label,cta_href,updated_at").order("key"),
        supabase.from("feature_flags").select("key,label,enabled,updated_at").order("key"),
        supabase.from("admin_settings").select("key,value").order("key"),
        supabase.from("destination_options").select("id,name,summary,featured,hidden,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("golf_course_options").select("id,name,summary,featured,hidden,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("lodging_options").select("id,name,summary,featured,hidden,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("outings").select("id", { count: "exact", head: true }),
        supabase.from("invites").select("id,status", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("chat_messages").select("id", { count: "exact", head: true })
      ]);

      const contentBlocks = (contentBlocksResult.data ?? []).map((block) => ({
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

      const adminSettingsMap = new Map((adminSettingsResult.data ?? []).map((setting) => [setting.key, setting.value]));

      return {
        users: (profilesResult.data ?? []).map((user) => ({
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          appRole: user.app_role,
          createdAt: user.created_at
        })),
        outings: outingsResult.data ?? [],
        contentBlocks,
        ownerSettings: normalizeSiteProfileSettings(adminSettingsMap.get("site_profile")),
        landingPageSettings: normalizeLandingPageSettings(adminSettingsMap.get("landing_page")),
        featureFlags: featureFlagsResult.data ?? [],
        destinationOptions: destinationOptionsResult.data ?? [],
        golfCourseOptions: golfCourseOptionsResult.data ?? [],
        lodgingOptions: lodgingOptionsResult.data ?? [],
        analytics: {
          totalUsers: totalProfilesResult.count ?? 0,
          totalOutings: totalOutingsResult.count ?? 0,
          activeInvites: invitesResult.count ?? 0,
          totalMessages: messagesResult.count ?? 0
        },
        lodgingIntegration: await getLodgingIntegrationStatus()
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
