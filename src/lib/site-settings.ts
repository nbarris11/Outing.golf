import { cache } from "react";

import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LandingPageSettings, SiteProfileSettings } from "@/types/domain";

export const defaultSiteProfileSettings: SiteProfileSettings = {
  legalBusinessName: "Outing.golf",
  heroBadge: "Golf trip planning, simplified",
  launchStatusLabel: "Private preview",
  supportEmail: "hello@outing.golf",
  footerTagline: "Plan golf trips without spreadsheets, group-text chaos, or budget confusion."
};

export const defaultLandingPageSettings: LandingPageSettings = {
  painPointsTitle: "Golf trips fall apart in the gap between idea and decision",
  painPointsBody:
    "Most groups do not need more options. They need one clean place to collect the basics, see what overlaps, and make a call.",
  painPoints: [
    "The date discussion lives in three different places.",
    "Nobody knows the real budget range until it is too late.",
    "Course and lodging ideas get buried in the chat.",
    "The organizer ends up rebuilding the whole trip in a spreadsheet."
  ],
  stepsTitle: "Three simple steps from messy idea to real plan",
  steps: [
    {
      step: "1",
      title: "Start the outing",
      body: "Set the destination idea, date windows, budget target, and trip style in a minute or two."
    },
    {
      step: "2",
      title: "Collect the group input",
      body: "Everyone shares budgets, available dates, lodging preferences, and destination lean in one short flow."
    },
    {
      step: "3",
      title: "See the best plan",
      body: "Outing.golf highlights the strongest overlap so the group can narrow the trip and book faster."
    }
  ],
  outcomesTitle: "The outcomes that actually make planning easier",
  outcomes: [
    {
      title: "Know the real budget early",
      body: "See where the group actually lines up before you waste time planning the wrong trip."
    },
    {
      title: "Spot date overlap instantly",
      body: "The easiest date window rises to the top so the organizer can move the group forward."
    },
    {
      title: "Compare destinations in one place",
      body: "Courses, lodging, and group votes stay tied to the same shortlist instead of scattered ideas."
    },
    {
      title: "Keep one decision thread",
      body: "The group stays in one planning flow, which means fewer side texts and fewer repeated questions."
    }
  ],
  socialProofTitle: "Built for the person who always ends up organizing the trip",
  socialProofBody:
    "This placeholder is ready for testimonials and launch partners later. For now, it signals the kind of confidence the product is designed to create.",
  socialProofItems: [
    "People actually fill out their preferences because it feels quick.",
    "The organizer can immediately see what is still blocking the decision.",
    "Course and lodging options stay tied to the same shortlist.",
    "The group gets to a confident next step much faster."
  ],
  faqs: [
    {
      question: "Do invitees need accounts?",
      answer: "For the MVP, yes. It keeps outing access private and makes permissions simple."
    },
    {
      question: "Can we compare multiple destinations at once?",
      answer: "Yes. The compare view keeps destinations, courses, and lodging together so tradeoffs stay clear."
    },
    {
      question: "Can I test this before live provider APIs are connected?",
      answer: "Yes. The product ships with mock provider adapters and seeded data so the full workflow can be tested now."
    },
    {
      question: "Is this trying to replace booking tools?",
      answer: "Not in version one. The goal is to get the group to a clear plan first, then layer official booking integrations in later."
    }
  ],
  finalCtaEyebrow: "Start planning",
  finalCtaTitle: "Make the plan obvious for everyone",
  finalCtaBody:
    "Bring budgets, dates, courses, and lodging into one calm workflow so the group can stop circling and start deciding.",
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
