import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { AuthCta } from "@/components/marketing/auth-cta";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema, howToSchema } from "@/lib/schema";

const TITLE = "Golf Outing Organizer: How to Organize a Golf Outing (Event or Trip)";
const DESCRIPTION =
  "A golf outing means a one-day scramble event or a multi-day buddies trip. Here is the complete organizer checklist for both — timeline, pricing, format, and tools.";
const PATH = "/golf-outing-organizer";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH
});

const eventSteps = [
  {
    name: "Pick a date 3–4 months out",
    text: "Charity and corporate outings need a long runway for sponsors and registrations. Aim for a weekday (Monday or Friday) in shoulder season — courses discount those days and your field will not compete with weekend member play. Avoid major local events and holiday weekends.",
    detail:
      "Charity and corporate outings need a long runway — sponsors commit slowly and registrations trickle in. Aim for a weekday, ideally a Monday or Friday, when courses are most willing to close to outside play and most likely to discount. Check the local calendar for conflicts before you announce anything."
  },
  {
    name: "Lock the course and request a shotgun start",
    text: "Call the course's event or outing coordinator directly, not the pro shop counter. A shotgun start (every group tees off simultaneously on different holes) gets a full field around in 4.5–5 hours and gets everyone to the post-round meal at the same time. Most courses require a 72–144 player minimum for a full shotgun.",
    detail:
      "Call the course's event coordinator, not the pro shop counter — outings are a separate business line with separate pricing. Ask for a shotgun start: every foursome tees off at the same time on a different hole, so the whole field finishes together and arrives at the post-round meal as one group. Most courses want 72–144 players to justify a full shotgun; smaller fields get a modified shotgun or consecutive tee times."
  },
  {
    name: "Set the format: scramble",
    text: "A four-person scramble (everyone hits, team plays the best ball) is the standard for a reason — high handicappers contribute, pace of play stays reasonable, and nobody posts a 112 in front of coworkers. Save best-ball or shamble formats for golfier crowds.",
    detail:
      "A four-person scramble — everyone hits, the team plays from the best ball — is the default outing format because it protects bad golfers and pace of play at the same time. Nobody grinds over a 9-footer for triple bogey, and nobody posts a 112 in front of their boss. If your field skews serious, a shamble (scramble off the tee, own ball after) adds some teeth without slowing things down."
  },
  {
    name: "Price it per player",
    text: "As of 2026, typical charity outing pricing runs $75–$150 per player including cart and food at a public course, and $200–$300+ at a private club. Your entry fee should cover the course's per-player cost plus food, prizes, and a margin for the cause.",
    detail:
      "As of 2026, most charity outings at public courses charge $75–$150 per player, which covers greens fee, cart, range balls, and the post-round meal. Private club events run $200–$300 or more. Work backward: the course quotes you a per-player cost, you add food and prize costs, then set the entry fee with enough margin that the event actually raises money. If the math only works at $250 a head, you booked the wrong course."
  },
  {
    name: "Build sponsorship tiers",
    text: "Hole sponsorships ($100–$500 for a sign on a tee box) are the workhorse. Add a title sponsor tier, a cart sponsor, a beverage cart sponsor, and contest sponsorships. Sponsorship revenue is where charity outings actually make money — entry fees mostly cover costs.",
    detail:
      "Entry fees mostly cover costs; sponsorships are where the money is. The workhorse is the hole sponsorship — a sign on a tee box for $100–$500 depending on your market. Above that, build tiers: a title sponsor, a cart sponsor (logo on every cart), a beverage cart sponsor, and named contest sponsorships. Eighteen holes means eighteen cheap, easy yeses for local businesses."
  },
  {
    name: "Open registration with one sheet of truth",
    text: "Use a single registration form or sheet that captures player name, email, foursome requests, shirt size if relevant, and payment status. Most disasters trace back to registrations living in three inboxes.",
    detail:
      "Use one registration form — a Google Form, an event platform, whatever — that captures name, email, foursome requests, and payment status in a single place. Every outing horror story starts the same way: half the registrations live in the organizer's inbox, a quarter in someone's text messages, and the rest on a paper sheet at the front desk. One sheet of truth, updated as money arrives."
  },
  {
    name: "Assign foursomes and holes",
    text: "A week out, build the pairings: honor foursome requests, spread single sign-ups across teams, and assign each foursome a starting hole. Print the hole assignments large — it is the first thing 144 people will ask you on event morning.",
    detail:
      "About a week out, build the pairings. Honor foursome requests, distribute the singles across teams that need a fourth, and assign every group a starting hole for the shotgun. Then print the assignments big — poster-board big. The single most-asked question on outing morning is 'what hole am I on?' and you do not want to answer it 144 times from a clipboard."
  },
  {
    name: "Set up on-course contests",
    text: "Longest drive and closest-to-the-pin (one or two of each, with proxy markers) are the minimum. A hole-in-one contest with a big prize requires hole-in-one insurance — typically $150–$400 as of 2026 depending on prize value and field size.",
    detail:
      "Longest drive and closest-to-the-pin are the minimum — one or two of each, with proxy markers and a pencil on a stake. The upgrade is a hole-in-one contest on a par 3 with a serious prize (a car, $10,000 cash). You do not fund that yourself: hole-in-one insurance covers the payout and typically costs $150–$400 as of 2026, depending on prize value, yardage, and field size. Mulligan sales ($5–$10 each, limit two) are easy extra revenue."
  },
  {
    name: "Buy prizes that people actually want",
    text: "Pro shop gift cards beat trophies. Pay out first place, last place (embrace it), and the contest winners. Keep the prize table simple — the field came for the cause and the golf, not the raffle.",
    detail:
      "Pro shop gift cards beat engraved trophies every time — winners spend them on the spot and the course likes you more. Pay out first place, the contest winners, and (if the crowd has a sense of humor) dead last. If you run a raffle, keep it short; nothing kills a post-round room like 45 minutes of ticket pulls."
  },
  {
    name: "Sort food and beverage early",
    text: "Box lunch at the turn or a post-round buffet are the standard options — the course's F&B minimum is usually part of your contract. Confirm the beverage cart schedule and decide up front whether drink tickets or a cash bar.",
    detail:
      "Food and beverage is usually baked into your course contract as a minimum spend, so decide the shape early: box lunch at the turn, post-round buffet, or both. Confirm the beverage cart will actually run during your event (and how often), and pick a drink policy — tickets, open bar window, or cash — before someone asks at hole 3."
  },
  {
    name: "Script the day-of timeline",
    text: "A standard outing day: registration opens 90 minutes before the start, range and putting contest open, announcements 15 minutes before, shotgun at the announced time, meal and awards within 45 minutes of the last group finishing. Write it down and assign a name to every line.",
    detail:
      "Registration opens 90 minutes before the shotgun. Range and any putting contest open with it. Announcements and rules 15 minutes before start, carts roll to their holes, shotgun fires on time. Meal and awards should begin within 45 minutes of the last group finishing — any longer and half your field leaves before the sponsor thank-yous. Write the timeline down and put a person's name next to every line item."
  },
  {
    name: "Send post-event thank-yous within a week",
    text: "Thank sponsors with results (dollars raised, players attended), thank players with photos and a save-the-date for next year. The follow-up email is next year's registration list.",
    detail:
      "Within a week, send sponsors a results email — dollars raised, players attended, photos with their signage visible — because that email is what gets them to re-up. Send players the photos and a save-the-date. This year's thank-you list is next year's registration list, and outings that skip this step start from zero every spring."
  }
];

const tripSteps = [
  {
    title: "Collect budgets privately",
    body: "Ask each player for a real budget range before any group discussion — group chats anchor to the first number posted."
  },
  {
    title: "Align on a date window",
    body: "Find the window that works for most of the group, not a window that requires perfect attendance."
  },
  {
    title: "Shortlist 2–3 destinations",
    body: "Compare courses and lodging together for the confirmed window — three real options beat ten half-researched ideas."
  },
  {
    title: "Vote and commit",
    body: "Put the shortlist in front of the group, vote, and book lodging first to lock the dates."
  },
  {
    title: "Run the trip from one place",
    body: "Round-by-round schedule, packing list, and logistics in a shared hub instead of a buried text thread."
  }
];

const faqs = [
  {
    question: "How far in advance should I plan a golf outing?",
    answer:
      "For a one-day charity or corporate outing, start 3–4 months out — courses book event dates early and sponsors need lead time to commit. For a multi-day golf trip with friends, 2–4 months works for drive-to destinations; add more runway for peak-season spots like Scottsdale in March or Myrtle Beach in spring, where tee times and lodging tighten up fast."
  },
  {
    question: "How much does it cost to run a charity golf outing per player?",
    answer:
      "As of 2026, typical charity outing entry fees run $75–$150 per player at public courses, covering greens fee, cart, range balls, and the post-round meal. Private club events run $200–$300 or more. The entry fee usually only covers costs — the actual fundraising comes from hole sponsorships, contest sponsorships, mulligan sales, and raffles."
  },
  {
    question: "What format is best for a golf outing?",
    answer:
      "A four-person scramble is the standard for charity and corporate outings: everyone hits, the team plays the best ball, so high handicappers contribute and pace of play stays near 4.5–5 hours. A shamble (scramble off the tee, own ball after) works for golfier fields. For buddies trips, most groups mix formats across rounds — match play, skins, and a Ryder Cup-style team competition are the usual suspects."
  },
  {
    question: "How many players do you need for a golf outing?",
    answer:
      "Most courses want 72–144 players (18–36 foursomes) for a full shotgun-start outing; smaller fields of 20–60 players typically get a modified shotgun or a block of consecutive tee times instead. A buddies golf trip is a different animal — 4 to 16 players is the sweet spot, with 8 or 12 the most common because they split cleanly into foursomes."
  },
  {
    question: "What app helps organize a golf outing?",
    answer:
      "It depends which kind of outing. For one-day scramble events, you want tournament software that handles registration, live scoring, and leaderboards — tools built for event day. For a multi-day golf trip with friends, Outing.golf is built for the decision layer: it collects everyone's dates, budget ranges, and destination preferences through one shared link, runs the group vote on courses and lodging, and keeps the final plan in a shared Trip HQ. It is free for the organizer and the group."
  }
];

export default function GolfOutingOrganizerPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Golf Outing Organizer", path: PATH }
          ]),
          howToSchema({
            name: "How to Organize a One-Day Golf Outing (Charity or Corporate Scramble)",
            description:
              "A 12-step checklist for organizing a one-day golf outing: date, course, format, pricing, sponsorships, registration, contests, food, and the day-of timeline.",
            path: PATH,
            steps: eventSteps.map(({ name, text }) => ({ name, text }))
          })
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Organizer guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em] text-charcoal">
            Golf outing organizer: how to organize a golf outing
          </h1>
          <ArticleByline />
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            A golf outing usually means one of two things: a one-day scramble event for charity, work, or a league —
            or a multi-day buddies golf trip. Organizing each one well takes a different checklist. Here&apos;s both.
          </p>
          <p className="mt-3 text-lg leading-8 text-charcoal/68">
            If you are running a one-day event, start with the 12-step checklist directly below — it covers the date,
            the course contract, pricing, sponsorships, and the day-of timeline. If you are organizing a golf trip
            with friends, jump to the{" "}
            <a href="#golf-trip" className="font-medium text-forest-900 underline-offset-2 hover:underline">
              trip section
            </a>{" "}
            — the job there is group decisions, not event logistics, and the tools are different too.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">The event checklist</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            How to organize a one-day golf outing (charity or corporate scramble)
          </h2>
          <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
            A one-day outing is an event-production job: one course, one date, a field of 72–144 players, and a
            timeline that has to run on rails. The checklist below is the full sequence in order. Most of it happens
            in the 3–4 months before the shotgun fires; the parts that go wrong are almost always the parts that got
            skipped in month one.
          </p>
        </div>
        <div className="mt-8 space-y-5">
          {eventSteps.map((step, index) => (
            <Card key={step.name} className="p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-900/10 text-sm font-semibold text-forest-900">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{step.name}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.6] text-charcoal/68">{step.detail}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="golf-trip" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">The trip checklist</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            Organizing a multi-day golf outing with friends (a golf trip)
          </h2>
          <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
            If your &quot;golf outing&quot; is 8 buddies, 3 nights, and 4 rounds somewhere warm, almost none of the
            checklist above applies. There is no shotgun start to schedule and no sponsor signs to print. The hard
            part is getting a group of adults with different calendars, different budgets, and different opinions to
            converge on one plan — and the organizer usually carries that alone, in a group text that produces 200
            messages and zero decisions.
          </p>
          <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
            The fix is sequencing. Done in the right order, a group golf trip is five steps:
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tripSteps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900/10 text-sm font-semibold text-forest-900">
                {index + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-charcoal">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/66">{step.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 max-w-3xl">
          <p className="text-[17px] leading-[1.65] text-charcoal/68">
            The full walkthrough lives in our{" "}
            <a href="/how-to-plan-a-golf-trip" className="font-medium text-forest-900 underline-offset-2 hover:underline">
              step-by-step golf trip planning guide
            </a>
            , and the{" "}
            <a
              href="/golf-trip-planning-checklist"
              className="font-medium text-forest-900 underline-offset-2 hover:underline"
            >
              golf trip planning checklist
            </a>{" "}
            covers every phase from budget collection to booking order. Or skip the manual version: Outing.golf runs
            this exact flow for you — one shared link collects everyone&apos;s dates, budget range, and destination
            preferences, the group votes on live course and lodging options, and the final plan lives in a shared
            Trip HQ. Free for the organizer and every member, and the median group responds within 24 hours.
          </p>
          <div className="mt-6">
            <AuthCta>Start Planning Free</AuthCta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Terminology</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            What&apos;s the difference between a golf outing and a golf trip?
          </h2>
          <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
            A golf outing is a one-day organized event at a single course — typically a charity, corporate, or league
            scramble with a shotgun start, sponsorships, on-course contests, and a post-round meal, usually fielding
            72–144 players. A golf trip is a multi-day excursion where a group of friends (typically 4–16 players)
            travels to a destination, stays overnight, and plays multiple courses across several rounds. The outing
            organizer&apos;s job is event production: contracts, registration, and a day-of timeline. The trip
            organizer&apos;s job is group decision-making: aligning dates, budgets, and destination preferences, then
            booking lodging and tee times. In casual American usage, &quot;golf outing&quot; gets used for both —
            which is why this page covers both — but the planning work, the timeline, and the right tools are almost
            entirely different.
          </p>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "The full five-step guide — from scattered idea to confirmed trip without the group-text chaos."
            },
            {
              title: "Golf trip planning checklist",
              href: "/golf-trip-planning-checklist",
              body: "A phase-by-phase checklist covering budget, dates, shortlist, decision, and booking order."
            },
            {
              title: "Organize a golf trip with friends",
              href: "/organize-a-golf-trip-with-friends",
              body: "How to run the group side of a buddies trip — getting answers without chasing anyone."
            },
            {
              title: "Bachelor golf trip planner",
              href: "/bachelor-golf-trip-planner",
              body: "Planning a bachelor party golf trip — destinations, budgets, and keeping 12 guys aligned."
            }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-[26px] border border-charcoal/8 bg-white/86 p-5 transition hover:bg-white hover:shadow-sm"
            >
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal group-hover:text-forest-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/66">{item.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">For trip organizers</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Organizing the multi-day kind of outing?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects your group&apos;s dates, budget ranges, and destination preferences through one
            shared link, runs the vote on courses and lodging, and keeps the final plan in a shared Trip HQ.
          </p>
          <div className="mt-8">
            <AuthCta className="bg-cream text-charcoal hover:bg-white">Start Planning Free</AuthCta>
            <p className="mt-3 text-sm text-cream/65">Free for the organizer · Group members never pay</p>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
