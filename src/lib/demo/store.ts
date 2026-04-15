import { promises as fs } from "node:fs";
import path from "node:path";
import { addDays, formatISO } from "date-fns";

import { generateId } from "@/lib/utils";
import type {
  ActivityLogEntry,
  ChatMessage,
  ContentBlock,
  DestinationOption,
  DemoState,
  Favorite,
  FeatureFlag,
  GolfCourseOption,
  Invite,
  LodgingOption,
  Outing,
  OutingMember,
  PreferenceSubmission,
  Profile,
  TeeTimeBooking,
  Vote
} from "@/types/domain";

import { fetchOutingInventory } from "@/modules/providers/inventory-service";

const now = new Date();
const DEMO_STATE_PATH = path.join("/tmp", "outing-golf-demo-state.json");

const demoProfiles: Profile[] = [
  {
    id: "profile_organizer",
    email: "host@outing.golf",
    fullName: "Casey Morgan",
    appRole: "member",
    createdAt: now.toISOString()
  },
  {
    id: "profile_friend",
    email: "friend@outing.golf",
    fullName: "Jordan Lee",
    appRole: "member",
    createdAt: now.toISOString()
  },
  {
    id: "profile_admin",
    email: "admin@outing.golf",
    fullName: "Outing Admin",
    appRole: "admin",
    createdAt: now.toISOString()
  }
];

const seedOuting: Outing = {
  id: "outing_demo",
  name: "Pinehurst Spring Run",
  organizerId: "profile_organizer",
  destinationType: "region",
  destinationLabel: "Warm-weather golf within a direct flight",
  preferredDateWindows: [
    {
      start: formatISO(addDays(now, 28), { representation: "date" }),
      end: formatISO(addDays(now, 31), { representation: "date" })
    },
    {
      start: formatISO(addDays(now, 42), { representation: "date" }),
      end: formatISO(addDays(now, 45), { representation: "date" })
    }
  ],
  budgetTarget: 1250,
  tripStyle: "classic",
  numberOfPlayers: 8,
  golfIntensity: "balanced",
  lodgingPreference: "house",
  notes: "Looking for two strong rounds, one easy travel day, and a house that keeps everyone together.",
  status: "planning",
  organizerWeighting: 7,
  votingOpen: false,
  teeTimeBookings: [],
  createdAt: now.toISOString()
};

const demoMembers: OutingMember[] = [
  {
    id: "member_organizer",
    outingId: seedOuting.id,
    profileId: "profile_organizer",
    role: "organizer",
    joinedAt: now.toISOString()
  },
  {
    id: "member_friend",
    outingId: seedOuting.id,
    profileId: "profile_friend",
    role: "participant",
    joinedAt: now.toISOString()
  }
];

const demoInvites: Invite[] = [
  {
    id: "invite_demo",
    outingId: seedOuting.id,
    email: "alex@outing.golf",
    invitedBy: "profile_organizer",
    status: "pending",
    token: "invite_demo_token",
    createdAt: now.toISOString()
  }
];

const demoPreferences: PreferenceSubmission[] = [
  {
    id: "pref_organizer",
    outingId: seedOuting.id,
    profileId: "profile_organizer",
    budgetMin: 900,
    budgetMax: 1500,
    availableDates: [
      formatISO(addDays(now, 29), { representation: "date" }),
      formatISO(addDays(now, 30), { representation: "date" }),
      formatISO(addDays(now, 43), { representation: "date" })
    ],
    destinationVotes: ["Northern Michigan Loop", "Scottsdale Sun Split"],
    lodgingPreferences: ["house", "resort"],
    courseQualityPreference: 8,
    walkingPreference: "either",
    comments: "Would rather keep logistics easy than chase the absolute fanciest trip.",
    updatedAt: now.toISOString()
  },
  {
    id: "pref_friend",
    outingId: seedOuting.id,
    profileId: "profile_friend",
    budgetMin: 800,
    budgetMax: 1300,
    availableDates: [
      formatISO(addDays(now, 29), { representation: "date" }),
      formatISO(addDays(now, 43), { representation: "date" }),
      formatISO(addDays(now, 44), { representation: "date" })
    ],
    destinationVotes: ["Northern Michigan Loop"],
    lodgingPreferences: ["house"],
    courseQualityPreference: 7,
    walkingPreference: "riding",
    comments: "Happy to drive if it keeps the budget in check.",
    updatedAt: now.toISOString()
  }
];

const demoFeatureFlags: FeatureFlag[] = [
  { key: "demo_mode", label: "Demo mode", enabled: true },
  { key: "provider_mock_data", label: "Mock provider data", enabled: true },
  { key: "chat_moderation_hooks", label: "Chat moderation hooks", enabled: true }
];

const demoContentBlocks: ContentBlock[] = [
  {
    key: "hero",
    title: "Plan the golf trip without the group text chaos",
    body: "Collect budgets, dates, courses, and lodging in one place so your group can actually decide and book faster.",
    ctaLabel: "Start Planning Free",
    ctaHref: "/sign-up",
    updatedAt: now.toISOString()
  },
  {
    key: "faq",
    title: "Can I use Outing.golf before live provider integrations are connected?",
    body: "Yes. This MVP ships with provider-agnostic mock adapters and seeded options so the team flow can be tested immediately.",
    updatedAt: now.toISOString()
  }
];

const demoChat: ChatMessage[] = [
  {
    id: "chat_1",
    outingId: seedOuting.id,
    profileId: "profile_organizer",
    message: "Let’s keep this simple and land on dates first.",
    createdAt: now.toISOString()
  },
  {
    id: "chat_2",
    outingId: seedOuting.id,
    profileId: "profile_friend",
    message: "Anything within the $1.2k-ish range works for me.",
    createdAt: now.toISOString()
  }
];

const demoActivity: ActivityLogEntry[] = [];

async function buildSeedState(): Promise<DemoState> {
  const inventory = await fetchOutingInventory(seedOuting);
  const destinationOptions = inventory.destinations;
  const golfCourseOptions = inventory.golfCourses;
  const lodgingOptions = inventory.lodging;
  const votes: Vote[] = [
    {
      id: "vote_destination_1",
      outingId: seedOuting.id,
      profileId: "profile_organizer",
      entityType: "destination" as const,
      entityId: destinationOptions[0]?.id ?? "",
      weight: 3
    },
    {
      id: "vote_destination_2",
      outingId: seedOuting.id,
      profileId: "profile_friend",
      entityType: "destination" as const,
      entityId: destinationOptions[1]?.id ?? "",
      weight: 2
    },
    {
      id: "vote_course_1",
      outingId: seedOuting.id,
      profileId: "profile_organizer",
      entityType: "golf_course" as const,
      entityId: golfCourseOptions[0]?.id ?? "",
      weight: 3
    },
    {
      id: "vote_lodging_1",
      outingId: seedOuting.id,
      profileId: "profile_friend",
      entityType: "lodging" as const,
      entityId: lodgingOptions[0]?.id ?? "",
      weight: 2
    }
  ].filter((vote) => vote.entityId);
  const favorites: Favorite[] = [
    {
      id: "favorite_destination_1",
      outingId: seedOuting.id,
      profileId: "profile_organizer",
      entityType: "destination" as const,
      entityId: destinationOptions[0]?.id ?? ""
    },
    {
      id: "favorite_lodging_1",
      outingId: seedOuting.id,
      profileId: "profile_friend",
      entityType: "lodging" as const,
      entityId: lodgingOptions[0]?.id ?? ""
    }
  ].filter((favorite) => favorite.entityId);

  return {
    profiles: demoProfiles,
    outings: [seedOuting],
    outingMembers: demoMembers,
    invites: demoInvites,
    preferenceSubmissions: demoPreferences,
    destinationOptions,
    golfCourseOptions,
    lodgingOptions,
    votes,
    favorites,
    chatMessages: demoChat,
    featureFlags: demoFeatureFlags,
    contentBlocks: demoContentBlocks,
    activityLog: demoActivity
  };
}

async function readState() {
  try {
    const raw = await fs.readFile(DEMO_STATE_PATH, "utf8");
    return JSON.parse(raw) as DemoState;
  } catch {
    const initialState = await buildSeedState();
    await fs.writeFile(DEMO_STATE_PATH, JSON.stringify(initialState, null, 2), "utf8");
    return initialState;
  }
}

async function writeState(state: DemoState) {
  await fs.writeFile(DEMO_STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function getDemoState() {
  return readState();
}

export async function getDemoProfileById(profileId: string) {
  return (await readState()).profiles.find((profile) => profile.id === profileId) ?? null;
}

export async function getDemoProfileByEmail(email: string) {
  return (
    (await readState()).profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase()) ??
    null
  );
}

export async function createDemoUser(email: string, fullName: string) {
  const state = await readState();
  const existing = state.profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return existing;
  }

  const profile: Profile = {
    id: generateId("profile"),
    email,
    fullName,
    appRole: "member",
    createdAt: new Date().toISOString()
  };

  state.profiles.unshift(profile);
  await writeState(state);
  return profile;
}

export async function createDemoOuting(input: Omit<Outing, "id" | "createdAt" | "status">) {
  const state = await readState();
  const outing: Outing = {
    ...input,
    id: generateId("outing"),
    status: "planning",
    createdAt: new Date().toISOString()
  };

  state.outings.unshift(outing);
  state.outingMembers.unshift({
    id: generateId("member"),
    outingId: outing.id,
    profileId: input.organizerId,
    role: "organizer",
    joinedAt: new Date().toISOString()
  });

  const inventory = await fetchOutingInventory(outing);

  state.destinationOptions.unshift(...inventory.destinations);
  state.golfCourseOptions.unshift(...inventory.golfCourses);
  state.lodgingOptions.unshift(...inventory.lodging);
  await writeState(state);

  return outing;
}

export async function createDemoInvite(outingId: string, email: string, invitedBy: string) {
  const state = await readState();
  const invite: Invite = {
    id: generateId("invite"),
    outingId,
    email,
    invitedBy,
    status: "pending",
    token: generateId("token"),
    createdAt: new Date().toISOString()
  };

  state.invites.unshift(invite);
  await writeState(state);
  return invite;
}

export async function resendDemoInvite(inviteId: string, invitedBy: string) {
  const state = await readState();
  const invite = state.invites.find((item) => item.id === inviteId);

  if (!invite) {
    return null;
  }

  invite.invitedBy = invitedBy;
  invite.status = "pending";
  invite.token = generateId("token");
  invite.createdAt = new Date().toISOString();

  await writeState(state);
  return invite;
}

export async function updateDemoOuting(
  outingId: string,
  profileId: string,
  updates: Partial<Pick<Outing, "name" | "destinationLabel" | "destinationType" | "budgetTarget" | "numberOfPlayers" | "lodgingPreference" | "notes" | "preferredDateWindows">>
) {
  const state = await readState();
  const outing = state.outings.find((item) => item.id === outingId);

  if (!outing || outing.organizerId !== profileId) {
    return null;
  }

  Object.assign(outing, updates);
  await writeState(state);
  return outing;
}

export async function deleteDemoOuting(outingId: string, profileId: string) {
  const state = await readState();
  const outing = state.outings.find((item) => item.id === outingId);

  if (!outing || outing.organizerId !== profileId) {
    return false;
  }

  state.outings = state.outings.filter((item) => item.id !== outingId);
  state.outingMembers = state.outingMembers.filter((item) => item.outingId !== outingId);
  state.invites = state.invites.filter((item) => item.outingId !== outingId);
  state.preferenceSubmissions = state.preferenceSubmissions.filter((item) => item.outingId !== outingId);
  state.destinationOptions = state.destinationOptions.filter((item) => item.outingId !== outingId);
  state.golfCourseOptions = state.golfCourseOptions.filter((item) => item.outingId !== outingId);
  state.lodgingOptions = state.lodgingOptions.filter((item) => item.outingId !== outingId);
  state.votes = state.votes.filter((item) => item.outingId !== outingId);
  state.favorites = state.favorites.filter((item) => item.outingId !== outingId);
  state.chatMessages = state.chatMessages.filter((item) => item.outingId !== outingId);

  await writeState(state);
  return true;
}

export async function joinDemoOuting(outingId: string, profileId: string) {
  const state = await readState();
  const existing = state.outingMembers.find((item) => item.outingId === outingId && item.profileId === profileId);

  if (existing) {
    return existing;
  }

  const next: OutingMember = {
    id: generateId("member"),
    outingId,
    profileId,
    role: "participant",
    joinedAt: new Date().toISOString()
  };

  state.outingMembers.unshift(next);
  await writeState(state);
  return next;
}

export async function upsertDemoPreference(
  profileId: string,
  outingId: string,
  submission: Omit<PreferenceSubmission, "id" | "profileId" | "outingId" | "updatedAt">
) {
  const state = await readState();
  const existing = state.preferenceSubmissions.find(
    (item) => item.profileId === profileId && item.outingId === outingId
  );

  if (existing) {
    Object.assign(existing, submission, { updatedAt: new Date().toISOString() });
    await writeState(state);
    return existing;
  }

  const next: PreferenceSubmission = {
    ...submission,
    id: generateId("pref"),
    profileId,
    outingId,
    updatedAt: new Date().toISOString()
  };

  state.preferenceSubmissions.unshift(next);
  await writeState(state);
  return next;
}

export async function addDemoChatMessage(outingId: string, profileId: string, message: string) {
  const state = await readState();
  const next: ChatMessage = {
    id: generateId("chat"),
    outingId,
    profileId,
    message,
    createdAt: new Date().toISOString()
  };

  state.chatMessages.push(next);
  await writeState(state);
  return next;
}

export async function updateContentBlock(key: string, value: Partial<ContentBlock>) {
  const state = await readState();
  const block = state.contentBlocks.find((item) => item.key === key);

  if (!block) {
    return null;
  }

  Object.assign(block, value, { updatedAt: new Date().toISOString() });
  await writeState(state);
  return block;
}

export async function toggleFeatureFlag(key: string) {
  const state = await readState();
  const flag = state.featureFlags.find((item) => item.key === key);

  if (!flag) {
    return null;
  }

  flag.enabled = !flag.enabled;
  await writeState(state);
  return flag;
}

export async function updateOptionFlags(input: {
  collection: "destinationOptions" | "golfCourseOptions" | "lodgingOptions";
  id: string;
  field: "featured" | "hidden";
}) {
  const state = await readState();
  const collection = state[input.collection] as Array<
    DestinationOption | GolfCourseOption | LodgingOption
  >;
  const option = collection.find((item) => item.id === input.id);

  if (!option) {
    return null;
  }

  option[input.field] = !option[input.field];
  await writeState(state);
  return option;
}

export async function setDemoOptionFeatured(input: {
  collection: "destinationOptions" | "golfCourseOptions" | "lodgingOptions";
  id: string;
  value: boolean;
  exclusive?: boolean; // if true, clear featured on all other items in the collection first
}) {
  const state = await readState();
  const collection = state[input.collection] as Array<
    DestinationOption | GolfCourseOption | LodgingOption
  >;
  if (input.exclusive && input.value) {
    collection.forEach((item) => { item.featured = false; });
  }
  const option = collection.find((item) => item.id === input.id);
  if (!option) return null;
  option.featured = input.value;
  await writeState(state);
  return option;
}

export async function addDemoOption(
  collection: "destinationOptions" | "golfCourseOptions" | "lodgingOptions",
  option: DestinationOption | GolfCourseOption | LodgingOption,
  outingId: string,
  organizerId: string
) {
  const state = await readState();
  const outing = state.outings.find((o) => o.id === outingId);
  if (!outing || outing.organizerId !== organizerId) return null;
  (state[collection] as Array<DestinationOption | GolfCourseOption | LodgingOption>).push(option);
  await writeState(state);
  return option;
}

export async function addDemoTeeTime(
  outingId: string,
  organizerId: string,
  booking: TeeTimeBooking
) {
  const state = await readState();
  const outing = state.outings.find((o) => o.id === outingId);
  if (!outing || outing.organizerId !== organizerId) return null;
  if (!Array.isArray(outing.teeTimeBookings)) outing.teeTimeBookings = [];
  outing.teeTimeBookings.push(booking);
  await writeState(state);
  return booking;
}

export async function deleteDemoTeeTime(
  outingId: string,
  organizerId: string,
  bookingId: string
) {
  const state = await readState();
  const outing = state.outings.find((o) => o.id === outingId);
  if (!outing || outing.organizerId !== organizerId) return false;
  if (!Array.isArray(outing.teeTimeBookings)) return false;
  outing.teeTimeBookings = outing.teeTimeBookings.filter((b) => b.id !== bookingId);
  await writeState(state);
  return true;
}
