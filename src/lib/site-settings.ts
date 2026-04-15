import { cache } from "react";

import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LandingPageSettings, SiteProfileSettings } from "@/types/domain";

export const defaultSiteProfileSettings: SiteProfileSettings = {
  legalBusinessName: "Outing.golf",
  heroBadge: "Golf trip planning tool for organizers",
  launchStatusLabel: "Private preview",
  supportEmail: "hello@outing.golf",
  footerTagline: "Plan golf trips without spreadsheets, group-text chaos, or budget confusion."
};

export const defaultLandingPageSettings: LandingPageSettings = {
  painPointsTitle: "Why golf trip organizers need a better planning tool",
  painPointsBody:
    "Outing.golf is a golf trip planning tool built for the person organizing the trip. Instead of chasing replies across group texts and spreadsheets, you can collect group input, browse real courses and hotels, vote on favorites, and move everyone toward one confirmed plan.",
  painPoints: [
    "The date discussion lives in three different places.",
    "Nobody knows the real budget range until it is too late.",
    "Course and lodging ideas get buried in the chat.",
    "The organizer ends up rebuilding the whole trip in a spreadsheet."
  ],
  stepsTitle: "Three steps from scattered idea to confirmed trip",
  steps: [
    {
      step: "1",
      title: "Create the outing",
      body: "Set the destination, date window, budget target, and trip style. Invite your group with a link and they fill out their preferences in one short flow."
    },
    {
      step: "2",
      title: "Compare golf courses and lodging in one place",
      body: "See live golf courses and hotels matched to your destination and group budget. Vote on favorites right inside the app — no side texts required."
    },
    {
      step: "3",
      title: "Lock the plan in Trip HQ",
      body: "The group's final destination, course schedule, lodging pick, and packing list all live in one shared Trip HQ every member can see."
    }
  ],
  outcomesTitle: "Everything the group needs, in one place",
  outcomes: [
    {
      title: "Real courses and hotels, not placeholders",
      body: "Golf course and lodging results come from live providers so what you see is actually available and bookable at your destination."
    },
    {
      title: "Group voting without the group chat",
      body: "Everyone votes on destinations, courses, and lodging right in the app. The organizer sees where the group is landing without running a poll in the text thread."
    },
    {
      title: "A course schedule the whole group can see",
      body: "Assign each course to a specific day and share the full round-by-round schedule inside Trip HQ so everyone arrives knowing the plan."
    },
    {
      title: "A shared packing list for the whole trip",
      body: "Add gear, check items off as you pack, and let the whole group see what is still outstanding so nobody shows up missing clubs or rain gear."
    }
  ],
  socialProofTitle: "Built for the person who always ends up organizing the trip",
  socialProofBody:
    "Outing.golf is designed around one principle: the organizer should spend less time chasing the group and more time actually planning. Every feature — from preference collection to group voting to the shared Trip HQ — exists to close the gap between first message and confirmed trip.",
  socialProofItems: [
    "Group members fill out preferences quickly because the flow is short and mobile-friendly.",
    "The organizer sees budget and date overlap the moment responses come in.",
    "Live course and hotel results are filtered to the group's actual destination and budget.",
    "The final plan — schedule, lodging, packing list — lives in one shared Trip HQ."
  ],
  faqs: [
    {
      question: "Do invitees need accounts?",
      answer: "Yes. Each person signs in to submit their preferences and access the shared Trip HQ. This keeps the outing private and makes sure votes and responses are tied to real group members."
    },
    {
      question: "How are golf courses and hotels found?",
      answer: "Course options are sourced via Google Places, filtered to your destination. Hotel options come from a live lodging API. Results are ranked by fit with your group's budget and trip style."
    },
    {
      question: "Can we schedule multiple courses across different days?",
      answer: "Yes. Once the group has voted on courses, the organizer can assign each one to a specific day. The full round-by-round schedule is visible to every group member inside Trip HQ."
    },
    {
      question: "Is this trying to replace booking tools?",
      answer: "No. Outing.golf focuses on the planning layer — collecting group input, browsing real options, voting, and building the itinerary. Booking happens directly with the venue or hotel once the group has a clear plan."
    }
  ],
  finalCtaEyebrow: "Start planning",
  finalCtaTitle: "Organize your golf trip in one place",
  finalCtaBody:
    "Outing.golf gives golf trip organizers one place to collect group input, compare options, and move from ideas to a real plan.",
  finalCtaLabel: "Start Planning Free",
  finalCtaHref: "/sign-up"
};

function pickString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function pickObject(value: unknown) {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

export function normalizeSiteProfileSettings(value: unknown): SiteProfileSettings {
  const settings = pickObject(value);

  return {
    legalBusinessName: pickString(settings.legalBusinessName, defaultSiteProfileSettings.legalBusinessName),
    heroBadge: pickString(settings.heroBadge, defaultSiteProfileSettings.heroBadge),
    launchStatusLabel: pickString(settings.launchStatusLabel, defaultSiteProfileSettings.launchStatusLabel),
    supportEmail: pickString(settings.supportEmail, defaultSiteProfileSettings.supportEmail),
    footerTagline: pickString(settings.footerTagline, defaultSiteProfileSettings.footerTagline)
  };
}

export function normalizeLandingPageSettings(value: unknown): LandingPageSettings {
  const settings = pickObject(value);
  const rawPainPoints = Array.isArray(settings.painPoints) ? settings.painPoints : [];
  const rawSteps = Array.isArray(settings.steps) ? settings.steps : [];
  const rawOutcomes = Array.isArray(settings.outcomes) ? settings.outcomes : [];
  const rawSocialProof = Array.isArray(settings.socialProofItems) ? settings.socialProofItems : [];
  const rawFaqs = Array.isArray(settings.faqs) ? settings.faqs : [];

  return {
    painPointsTitle: pickString(settings.painPointsTitle, defaultLandingPageSettings.painPointsTitle),
    painPointsBody: pickString(settings.painPointsBody, defaultLandingPageSettings.painPointsBody),
    painPoints: defaultLandingPageSettings.painPoints.map((fallback, index) =>
      pickString(rawPainPoints[index], fallback)
    ),
    stepsTitle: pickString(settings.stepsTitle, defaultLandingPageSettings.stepsTitle),
    steps: defaultLandingPageSettings.steps.map((fallback, index) => {
      const step = pickObject(rawSteps[index]);

      return {
        step: fallback.step,
        title: pickString(step.title, fallback.title),
        body: pickString(step.body, fallback.body)
      };
    }),
    outcomesTitle: pickString(settings.outcomesTitle, defaultLandingPageSettings.outcomesTitle),
    outcomes: defaultLandingPageSettings.outcomes.map((fallback, index) => {
      const outcome = pickObject(rawOutcomes[index]);

      return {
        title: pickString(outcome.title, fallback.title),
        body: pickString(outcome.body, fallback.body)
      };
    }),
    socialProofTitle: pickString(settings.socialProofTitle, defaultLandingPageSettings.socialProofTitle),
    socialProofBody: pickString(settings.socialProofBody, defaultLandingPageSettings.socialProofBody),
    socialProofItems: defaultLandingPageSettings.socialProofItems.map((fallback, index) =>
      pickString(rawSocialProof[index], fallback)
    ),
    faqs: defaultLandingPageSettings.faqs.map((fallback, index) => {
      const faq = pickObject(rawFaqs[index]);

      return {
        question: pickString(faq.question, fallback.question),
        answer: pickString(faq.answer, fallback.answer)
      };
    }),
    finalCtaEyebrow: pickString(settings.finalCtaEyebrow, defaultLandingPageSettings.finalCtaEyebrow),
    finalCtaTitle: pickString(settings.finalCtaTitle, defaultLandingPageSettings.finalCtaTitle),
    finalCtaBody: pickString(settings.finalCtaBody, defaultLandingPageSettings.finalCtaBody),
    finalCtaLabel: pickString(settings.finalCtaLabel, defaultLandingPageSettings.finalCtaLabel),
    finalCtaHref: pickString(settings.finalCtaHref, defaultLandingPageSettings.finalCtaHref)
  };
}

export const getPublicSiteSettings = cache(async () => {
  if (isDemoMode) {
    return {
      siteProfile: defaultSiteProfileSettings,
      landingPage: defaultLandingPageSettings
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      siteProfile: defaultSiteProfileSettings,
      landingPage: defaultLandingPageSettings
    };
  }

  const { data } = await supabase.from("admin_settings").select("key,value");
  const settingsMap = new Map((data ?? []).map((row) => [row.key, row.value]));

  return {
    siteProfile: normalizeSiteProfileSettings(settingsMap.get("site_profile")),
    landingPage: normalizeLandingPageSettings(settingsMap.get("landing_page"))
  };
});
