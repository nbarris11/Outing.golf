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
