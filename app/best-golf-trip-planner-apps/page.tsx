import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { AuthCta } from "@/components/marketing/auth-cta";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Best Golf Trip Planner Apps in 2026 (Honest Comparison)",
  description:
    "An honest comparison of the best golf trip planner apps in 2026 — Outing.golf, Golf Genius Trip Manager, TripCaddie, Unknown Golf, Golf Traveller, and the spreadsheet — including what each one actually does and who should pick it.",
  path: "/best-golf-trip-planner-apps"
});

const comparisonRows = [
  {
    app: "Outing.golf",
    bestFor: "Groups that still need to decide dates, budget, and destination",
    price: "Free",
    groupInput: "Yes — dates, private budget ranges, and votes from every member",
    liveData: "Yes — live course and lodging options",
    itinerary: "Yes — shared Trip HQ with round-by-round schedule"
  },
  {
    app: "Golf Genius Trip Manager",
    bestFor: "Established annual trips with a stats-loving commissioner",
    price: "$149 per trip",
    groupInput: "Limited — built to manage a trip, not collect group decisions",
    liveData: "No",
    itinerary: "Yes — schedules, pairings, and games"
  },
  {
    app: "TripCaddie",
    bestFor: "Groups that want trip management plus help booking the trip",
    price: "Varies",
    groupInput: "Partial — organizer-led trip setup",
    liveData: "Partial — through its travel-partner side",
    itinerary: "Yes"
  },
  {
    app: "Unknown Golf",
    bestFor: "Groups whose main event is the games and side bets",
    price: "Freemium",
    groupInput: "No — focused on scoring, not planning decisions",
    liveData: "No",
    itinerary: "Basic trip features around the scoring core"
  },
  {
    app: "Golf Traveller",
    bestFor: "Storing the details of a trip you have already booked",
    price: "Freemium",
    groupInput: "No",
    liveData: "No",
    itinerary: "Yes — itinerary storage and sharing"
  },
  {
    app: "Google Sheets / spreadsheet",
    bestFor: "Four people who already agree on everything",
    price: "Free",
    groupInput: "Manual — and budget answers are visible to the whole group",
    liveData: "No — you copy-paste everything in",
    itinerary: "Whatever you build yourself"
  }
];

export default function BestGolfTripPlannerAppsPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "Best Golf Trip Planner Apps in 2026 (Honest Comparison)",
          description:
            "An honest comparison of the best golf trip planner apps in 2026 — Outing.golf, Golf Genius Trip Manager, TripCaddie, Unknown Golf, Golf Traveller, and the spreadsheet — including what each one actually does and who should pick it.",
          path: "/best-golf-trip-planner-apps"
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Best Golf Trip Planner Apps", path: "/best-golf-trip-planner-apps" }
        ])}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Honest comparison</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em] text-charcoal">
            The best golf trip planner apps in 2026
          </h1>
          <ArticleByline />
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            The best golf trip planner app depends on what your group actually needs: Outing.golf if the group still
            has decisions to make (dates, budget, destination), Golf Genius Trip Manager if you run an established
            annual trip with a stats-loving commissioner, and a spreadsheet if your group is four people who already
            agree on everything. Most "golf trip app" lists skip that distinction, which is how organizers end up
            paying for tournament software when their real problem was getting eight guys to commit to a weekend.
          </p>
          <p className="mt-3 text-lg leading-8 text-charcoal/68">
            Full disclosure: Outing.golf is our app. We have tried to be straight about what it does not do — it is
            not a scoring app and it is not a booking engine — and equally straight about what the other tools on
            this list do well. If this comparison is only useful as an ad, nobody links to it, and you stop reading
            in a paragraph. Here is the honest version.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">At a glance</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
          Golf trip planner apps compared (as of 2026)
        </h2>
        <Card className="mt-8 overflow-x-auto p-0">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-charcoal/50">
                <th className="px-5 py-4 font-semibold">App</th>
                <th className="px-5 py-4 font-semibold">Best for</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Group input collection</th>
                <th className="px-5 py-4 font-semibold">Live course / lodging data</th>
                <th className="px-5 py-4 font-semibold">Trip itinerary</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.app} className="border-t border-charcoal/8 align-top">
                  <td className="px-5 py-4 font-semibold text-charcoal">{row.app}</td>
                  <td className="px-5 py-4 leading-6 text-charcoal/68">{row.bestFor}</td>
                  <td className="px-5 py-4 leading-6 text-charcoal/68">{row.price}</td>
                  <td className="px-5 py-4 leading-6 text-charcoal/68">{row.groupInput}</td>
                  <td className="px-5 py-4 leading-6 text-charcoal/68">{row.liveData}</td>
                  <td className="px-5 py-4 leading-6 text-charcoal/68">{row.itinerary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="mt-4 text-sm leading-6 text-charcoal/55">
          Prices and features as of 2026. "Group input collection" means structured input from every member — dates,
          budgets, votes — not just an organizer typing a plan into an app.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-12">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">The contenders</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Outing.golf
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
              Outing.golf is built for the part of the trip nobody else covers: the decision. The organizer creates
              an outing and shares one link. Every member submits their available dates, a real budget range
              (collected privately, so nobody anchors to the loudest guy's number), and destination and lodging
              preferences. The group then votes on live course and lodging options pulled from real data — not a
              tab of copy-pasted links. Once the group decides, the plan lives in a shared Trip HQ with a
              round-by-round schedule, packing list, and countdown. It is free for the organizer and for every
              member, and the median group gets its responses back within 24 hours.
            </p>
            <p className="mt-3 text-[17px] leading-[1.65] text-charcoal/68">
              What it does not do: scoring, side games, or money matches — there is no skins calculator here. It is
              also not a booking engine; you still book tee times and lodging yourself, with the group's actual
              decision in hand. Pick Outing.golf if your group's hardest problem is agreeing on when, where, and
              for how much. That is most groups.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Golf Genius Trip Manager
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
              Golf Genius is the heavyweight of tournament software, and Trip Manager brings that DNA to buddies
              trips: pairings, tee sheets, multi-round formats, points races, and the kind of scoring depth that
              makes a 12-man Ryder Cup weekend feel official. If your trip has a commissioner who keeps a
              spreadsheet of career singles records, this is his app. As of 2026 it runs $149 per trip, which is
              real money but reasonable split across a group that values the product.
            </p>
            <p className="mt-3 text-[17px] leading-[1.65] text-charcoal/68">
              The honest limitation: it manages a trip that already exists. It assumes the dates are set, the
              roster is committed, and the destination is booked — its job starts after the hard group decisions
              are made, and it does not pull live course or lodging data to help you make them. Pick Golf Genius
              Trip Manager if your trip is established, your group is committed, and the games are the main event.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              TripCaddie
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
              TripCaddie is a hybrid: part trip-management app, part travel partner. Alongside the in-app trip
              tools, there is a human travel-planning side that can help arrange the actual golf trip — which is a
              genuinely different value proposition from everything else on this list. If your group wants someone
              else to handle the legwork of putting a package together, that hybrid model has appeal, especially
              for bigger or more expensive trips where a planner's course relationships matter.
            </p>
            <p className="mt-3 text-[17px] leading-[1.65] text-charcoal/68">
              The trade-off is the same one you accept with any travel-partner model: the experience depends partly
              on the humans involved, and the software side is in service of trips that route through it. It is
              less of a fit if your group just wants a free, self-serve tool for collecting input and deciding.
              Pick TripCaddie if you want trip management plus actual help booking the trip, and you are comfortable
              with a partner in the loop.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Unknown Golf
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
              Unknown Golf comes at the trip from the games side. Its core is scoring and side games — skins,
              matches, multi-day team formats — with trip features built around that core. For groups whose
              weekend revolves around the betting sheet, that priority order is exactly right, and it covers the
              gap that decision-layer tools like Outing.golf deliberately leave open. It is the kind of app you
              open on the first tee, not three months before the trip.
            </p>
            <p className="mt-3 text-[17px] leading-[1.65] text-charcoal/68">
              The flip side: it is not a planning tool in any meaningful sense. There is no structured collection
              of dates or budgets, no live course or lodging data, and no mechanism for getting a scattered group
              to a decision. Pick Unknown Golf as a companion app for trip week — it pairs naturally with whatever
              you used to actually plan the trip, whether that is Outing.golf or a very determined group chat.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Golf Traveller
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
              Golf Traveller is an itinerary app: a clean place to store and share the details of a golf trip that
              is already booked. Tee times, lodging confirmations, travel details — everything in one place instead
              of scattered across confirmation emails. For a trip with a lot of moving pieces, that single source
              of truth is genuinely useful, and it is a clear upgrade over forwarding the same email thread to
              eight people who will all lose it.
            </p>
            <p className="mt-3 text-[17px] leading-[1.65] text-charcoal/68">
              But storage is the whole job. Golf Traveller does not help the group decide anything, collect
              anyone's budget or dates, surface live course options, or run games. It starts where planning ends.
              Pick Golf Traveller if your trip is fully booked and your remaining problem is keeping everyone
              pointed at the same information — and note that a Trip HQ-style itinerary is something
              decision-layer apps now include anyway.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
              Google Sheets (the incumbent)
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
              Be honest: the spreadsheet is the app most golf trips actually run on, and it deserves a fair
              hearing. It is free, infinitely flexible, and everyone already knows how to use it. For a small
              group with aligned schedules and similar budgets, a shared sheet plus a group chat genuinely gets
              the job done — no new tool required.
            </p>
            <p className="mt-3 text-[17px] leading-[1.65] text-charcoal/68">
              The cracks show as the group grows. Everything is manual: you build the template, chase responses,
              and consolidate answers by hand. There is no live course or lodging data — just links nobody clicks.
              And every budget answer is public to the whole group, which means people post the number they want
              seen, not the number that is true. We wrote a full breakdown in{" "}
              <a href="/golf-trip-planner-vs-spreadsheet" className="font-medium text-forest-900 underline-offset-2 hover:underline">
                golf trip planner vs. spreadsheet
              </a>
              . Pick the spreadsheet if your group is small, decisive, and allergic to new apps. No shame in it.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Decision guide</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            How do you choose the right golf trip app?
          </h2>
          <p className="mt-4 text-[17px] leading-[1.65] text-charcoal/68">
            Skip the feature lists and start with where your group actually is. Most groups fall into one of these
            situations:
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Nothing is decided yet",
              body: "You have a group chat full of enthusiasm and zero commitments. Your problem is decisions — dates, budget, destination — not management. Use Outing.golf: one link collects everyone's dates, private budget ranges, and votes on live course and lodging options. Free, and it gets you from \"we should do this\" to a confirmed plan."
            },
            {
              title: "Same trip, same crew, every year",
              body: "Dates are tradition, the roster is locked, and the arguments are about pairings and points. Golf Genius Trip Manager ($149/trip as of 2026) is built for exactly this — deep scoring, formats, and standings run by a commissioner who enjoys the job."
            },
            {
              title: "You want help booking, not just deciding",
              body: "Bigger budget, bigger group, and nobody wants to assemble the package themselves. TripCaddie's trip-manager-plus-travel-partner model puts a human in the loop. Compare what they propose against your group's real numbers — our golf trip budget planner guide covers how to collect those first."
            },
            {
              title: "The trip is booked — now run it",
              body: "Use Golf Traveller (or any shared Trip HQ) to keep tee times and lodging details in one place, and Unknown Golf for scoring and side games on the ground. Planning apps and trip-week apps are different jobs; it is fine to use one of each."
            },
            {
              title: "Four guys, one text thread, total agreement",
              body: "A spreadsheet — or honestly nothing — is enough. The coordination overhead of a small, decisive group is too low for any app to add real value. Save this page for the year the trip grows to eight."
            },
            {
              title: "Twelve guys, three time zones, no consensus",
              body: "This is the case every tool claims to solve and most do not. You need structured input collection and voting, not a fancier itinerary. A decision-layer tool first; scoring and itinerary apps after the trip actually exists."
            }
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{item.title}</h3>
              <p className="mt-3 text-[15.5px] leading-[1.6] text-charcoal/68">{item.body}</p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <p className="text-[17px] leading-[1.65] text-charcoal/68">
            One more honest note: these tools are less in competition than the "best of" framing suggests. A group
            could plan with Outing.golf, run games with Unknown Golf, and never feel a conflict — they cover
            different weeks of the trip's life. The expensive mistake is buying a trip manager when your group has
            not actually committed to a trip yet. Decisions first. If you want the full sequence, our guide on{" "}
            <a href="/how-to-plan-a-golf-trip" className="font-medium text-forest-900 underline-offset-2 hover:underline">
              how to plan a golf trip
            </a>{" "}
            walks through it phase by phase.
          </p>
        </div>
      </section>

      <FaqSection
        faqs={[
          {
            question: "What is the best free golf trip planner app?",
            answer:
              "Outing.golf is free for the organizer and every group member, and it covers the planning-specific work: collecting dates and private budget ranges, voting on live course and lodging options, and a shared Trip HQ itinerary. Google Sheets is also free but everything is manual, there is no live data, and budget answers are visible to the whole group. Most other golf trip apps are paid or freemium."
          },
          {
            question: "Is there an app for planning a buddies golf trip?",
            answer:
              "Yes — several, and they specialize. Outing.golf handles the group decision phase (dates, budgets, destination votes) for free. Golf Genius Trip Manager ($149 per trip as of 2026) manages an already-committed trip with deep scoring and games. Unknown Golf covers side games during trip week. The right one depends on whether your group still needs to decide anything or just needs the trip run."
          },
          {
            question: "What app do groups use to split golf trip costs?",
            answer:
              "For settling shared expenses after the trip, general apps like Venmo or Splitwise remain the standard — no golf app does that job better. The golf-specific problem comes before the trip: agreeing what the budget is. Outing.golf collects each member's real budget range privately, so the group plans to a number everyone can actually afford instead of the number someone felt comfortable posting in the chat."
          },
          {
            question: "What is the difference between Golf Genius and Outing.golf?",
            answer:
              "They cover different phases. Outing.golf is the decision layer: it collects dates, private budgets, and preferences from the group and runs votes on live course and lodging options, free. Golf Genius Trip Manager ($149 per trip) is trip management with tournament-software DNA: pairings, formats, scoring, and standings for a trip whose dates and roster are already set. Outing.golf does not do scoring; Golf Genius does not help a group decide where or when to go."
          },
          {
            question: "Do I need a golf trip app, or is a spreadsheet enough?",
            answer:
              "For two to four people who talk regularly and agree easily, a spreadsheet is genuinely enough. Past four or five people with different schedules and budgets, the spreadsheet becomes a job: you build it, chase it, and consolidate it by hand, with no live course data and budgets exposed to the whole group. That is the point where a purpose-built planner starts paying for itself — especially one that is free."
          }
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Related guides</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Planner vs. spreadsheet",
              href: "/golf-trip-planner-vs-spreadsheet",
              body: "A deeper head-to-head on what a shared doc can and cannot do for a group trip."
            },
            {
              title: "How Outing.golf works",
              href: "/how-it-works",
              body: "The full workflow — from one shared link to a confirmed plan in Trip HQ."
            },
            {
              title: "How to plan a golf trip",
              href: "/how-to-plan-a-golf-trip",
              body: "The phase-by-phase guide to going from group-chat idea to booked trip."
            },
            {
              title: "Golf trip budget planner",
              href: "/golf-trip-budget-planner",
              body: "Why collecting real budget ranges early changes the entire planning process."
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
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Start with the decision</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Get your group to an actual plan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects dates, private budget ranges, and votes on live course and lodging options through
            one shared link — free for the organizer and everyone else. The trip manager apps can take it from there.
          </p>
          <div className="mt-8">
            <AuthCta className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </AuthCta>
            <p className="mt-3 text-sm text-cream/65">Free for the organizer · Group members never pay</p>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
