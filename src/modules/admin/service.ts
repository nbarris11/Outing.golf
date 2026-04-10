import { getDemoState } from "@/lib/demo/store";

export async function getAdminDashboardData() {
  const state = await getDemoState();

  return {
    users: state.profiles,
    outings: state.outings,
    contentBlocks: state.contentBlocks,
    featureFlags: state.featureFlags,
    destinationOptions: state.destinationOptions.slice(0, 8),
    golfCourseOptions: state.golfCourseOptions.slice(0, 8),
    lodgingOptions: state.lodgingOptions.slice(0, 8),
    analytics: {
      totalUsers: state.profiles.length,
      totalOutings: state.outings.length,
      activeInvites: state.invites.filter((invite) => invite.status === "pending").length,
      totalMessages: state.chatMessages.length
    }
  };
}
