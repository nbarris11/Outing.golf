import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { PageShell } from "@/components/layout/page-shell";
import { ArticleByline } from "@/components/marketing/article-byline";
import { AuthCta } from "@/components/marketing/auth-cta";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { articleSchema, breadcrumbSchema, howToSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "How to Plan a Golf Trip with Friends (Step-by-Step Guide)",
  description:
    "How to plan a golf trip in 5 steps: collect budgets and dates first, shortlist 2–3 destinations, then commit. Includes costs, timelines, and the mistakes that kill trips.",
  path: "/how-to-plan-a-golf-trip"
});

const steps = [
  {
    name: "Start with a rough destination idea, not a firm plan",
    text: "Pick a destination type — desert, coastal, mountain, or classic parkland — rather than a specific resort. This gives you room to compare real options once you know what the group can spend."
  },
  {
    name: "Get budget ranges from everyone before you go further",
    text: "Ask for individual budget ranges privately before any group discussion. Asking in a group chat anchors everyone to the first number posted, which is usually not the real range."
  },
  {
    name: "Nail down the date window early",
    text: "Get everyone's availability in the first round of planning. Look for a window that works for most of the group, not a window that requires perfect attendance from everyone."
  },
  {
    name: "Compare courses and lodging together, not separately",
    text: "Evaluate course quality and lodging options together so you are not building separate shortlists that never connect. Three real destination options with courses and lodging attached is better than ten half-researched ideas."
  },
  {
    name: "Make a call and commit",
    text: "Once you have budget overlap and date alignment, pick the strongest destination option and book the trip. The group will adjust."
  }
];

const faqs = [
  {
    question: "How far in advance should you plan a golf trip?",
    answer:
      "Start 4–6 months before the trip date. That gives you a month to collect group input and decide, time to book lodging while group-friendly houses are still available, and a 60–90 day window to lock tee times at popular courses. Peak-season destinations like Scottsdale in March or Myrtle Beach in spring fill earlier — for those, 6 months is the safer number."
  },
  {
    question: "How much should each person budget for a golf trip?",
    answer:
      "As of 2026, a realistic all-in range is $300–$700 per person for a drive-to weekend, $700–$1,400 for a mid-range fly-in trip, $1,400–$2,500 for a premium resort trip, and $2,500–$5,000+ for bucket-list destinations like Pebble Beach or Bandon Dunes. The all-in number includes travel, lodging, greens fees, food, and drinks — not just the golf."
  },
  {
    question: "How many rounds should you play on a 3-day golf trip?",
    answer:
      "Three to four rounds is the sweet spot for a 3-day trip: one round on arrival day if travel allows, one or two on the full middle day, and one before departure. Five rounds in three days sounds great in the group chat and feels like a death march by round four — especially if anyone is walking."
  },
  {
    question: "How do you plan a golf trip with different skill levels?",
    answer:
      "Pick courses with multiple tee options and at least one forgiving layout, then use formats that keep everyone involved — scrambles, best-ball, and match play with handicaps work far better than individual stroke play. Avoid building the whole trip around one brutally hard course that half the group will hate by the ninth hole."
  },
  {
    question: "How do you collect money for a group golf trip?",
    answer:
      "Collect a deposit as soon as the group commits to a destination — typically $100–$300 per person — and set a payment deadline for the balance two to four weeks before any cancellation deadlines. Venmo, Zelle, or a payment pool all work; what matters is that money arrives before names go on bookings. People who have paid show up."
  },
  {
    question: "What are the best months for a golf trip?",
    answer:
      "It depends on the destination: February–April for Arizona and Florida, April–May and September–October for the Carolinas and Myrtle Beach, and June–September for northern destinations like Michigan, Wisconsin, and Bandon. Shoulder months on either side of peak season usually mean 20–40% lower rates for nearly identical conditions."
  }
];

export default function HowToPlanAGolfTripPage() {
  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: "How to Plan a Golf Trip with Friends (Step-by-Step Guide)",
          description:
            "How to plan a golf trip in 5 steps: collect budgets and dates first, shortlist 2–3 destinations, then commit. Includes costs, timelines, and the mistakes that kill trips.",
          path: "/how-to-plan-a-golf-trip"
        })}
      />
      <JsonLd
        data={howToSchema({
          name: "How to Plan a Golf Trip with Friends",
          description:
            "A step-by-step guide for planning a group golf trip from scattered idea to confirmed booking.",
          path: "/how-to-plan-a-golf-trip",
          steps
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How to Plan a Golf Trip", path: "/how-to-plan-a-golf-trip" }
        ])}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Planning guide</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            How to plan a golf trip with friends
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/68">
            To plan a golf trip, collect three things from your group before researching a single course: budget
            ranges, date availability, and a rough destination type. Most groups that start 4–6 months out and
            gather that input in the first week have the trip booked within a month — most groups that skip it
            spend that month arguing in a text thread instead.
          </p>
          <p className="mt-3 text-lg leading-8 text-charcoal/68">
            This guide covers the five steps in order, what a trip actually costs as of 2026, how long the whole
            process takes, and the mistakes that quietly kill more trips than bad weather ever has.
          </p>
          <ArticleByline />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                1. Start with a rough destination idea, not a firm plan
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Pick a destination type — desert courses, coastal layout, mountain, classic parkland — rather than
                a specific resort. This gives you room to compare real options once you know what the group can
                spend. Locking in a destination before you have budget and date alignment is one of the most common
                planning mistakes groups make, and it is the hardest one to walk back, because by then somebody has
                already told his wife it is Scottsdale.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                A destination type also gives you a useful first question for the group: &quot;Are we thinking warm-weather
                resort golf, a drive-to weekend, or a once-in-a-lifetime trip?&quot; Those three answers lead to completely
                different budgets, and you want to find out which trip you are planning before you price anything.
                A foursome that wants 36 holes a day in the desert and a foursome that wants 18 holes and a long
                dinner are both great trips — they are just not the same trip, and discovering that in month three
                is expensive.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                If the group genuinely has no lean, start from the season. The month you can all travel narrows the
                map for you: February points to Arizona and Florida, May points to the Carolinas, August points
                north to Michigan or Wisconsin.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                2. Get budget ranges from everyone before you go further
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Budget is the variable that changes everything. A group that aligns on a $600-per-person range
                plans a completely different trip than one that aligns on $1,400. Ask for individual budget ranges
                privately — asking in a group chat anchors everyone to the first number posted, which is usually
                not the real range. If the first reply is &quot;I&apos;m good for whatever,&quot; the second guy is not going to
                admit his ceiling is $700, and now you are planning a trip two people quietly cannot afford.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Ask for a range, not a number, and make clear it is all-in: flights or gas, lodging, greens fees,
                carts, food, and drinks. Most people answer the budget question thinking only about the golf, then
                get surprised when the real total lands 60–80% higher. Once the ranges come back, plan to the
                overlap — the window where most of the group is comfortable — not to the highest number in the
                thread. A trip priced for the top of the group loses players; a trip priced to the overlap keeps
                them.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Outing.golf collects budget ranges individually so you see the real distribution before you plan
                the wrong trip. For a deeper look at running this step,{" "}
                <a href="/golf-trip-budget-planner" className="text-forest-900 underline-offset-2 hover:underline">
                  see the golf trip budget planner guide
                </a>
                , and for realistic per-person cost ranges by destination,{" "}
                <a href="/golf-trip-cost-per-person" className="text-forest-900 underline-offset-2 hover:underline">
                  the golf trip cost per person guide
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                3. Nail down the date window early
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Dates are harder to move once you start booking. Get everyone&apos;s availability in the first round of
                planning, not after you have already found the perfect resort. Look for a window that works for
                most of the group, not a window that requires perfect attendance from everyone — a window that
                needs all twelve calendars to align perfectly is a window that does not exist.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                The practical move is to offer two or three specific weekends rather than asking the open-ended
                &quot;when works for everyone?&quot; Open-ended availability questions generate open-ended answers, and
                three weeks later you are still collecting maybes. Specific options force real answers: in, out,
                or flexible. Decide up front what your attendance threshold is — most organizers run with the trip
                if 75–80% of the group can make a window — and say so, because it gives the stragglers a deadline
                with teeth.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Watch for landmines inside the window too: Masters week inflates rates across the Southeast, Father&apos;s
                Day weekend books out early, and any holiday Monday adds 20–30% to lodging. A one-week shift on
                either side of peak dates is often the difference between a tight budget and a comfortable one.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                4. Compare courses and lodging together, not separately
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Course quality and lodging options are tied to the same destinations. A good planning process
                evaluates them together so you are not building a shortlist of courses and a separate shortlist of
                lodging that never connects. Three real destination options with courses and lodging attached is
                better than ten half-researched ideas, because the group can only meaningfully compare options that
                are actually complete.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                For each finalist destination, sketch the same simple package: two to four courses you would
                actually play, one lodging option that fits the whole group (a house beats two hotel rooms for
                groups of six or more — shared mornings and a place to play cards at night are half the trip), and
                a rough per-person total. Keep drive times in the math: a famous course 50 minutes from the house
                costs you nearly two hours of round trip, every day, for the whole group. As of 2026, most major
                golf destinations let you build a strong 3-day package without ever leaving a 25-minute radius.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Then put the two or three complete packages in front of the group and let them vote. For a
                practical comparison of where groups actually go,{" "}
                <a href="/best-golf-trip-destinations" className="text-forest-900 underline-offset-2 hover:underline">
                  see the best golf trip destinations guide
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                5. Make a call and commit
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Most golf trips stall at the decision point. The organizer has the data, the group has shared
                preferences, but nobody calls it. Once you have budget overlap and date alignment, pick the
                strongest destination option and book the thing. The group will adjust — they always do, and the
                guy who lobbied hardest for the other destination will have a great time anyway.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Booking order matters here: lodging first, because it locks the dates and the headcount; tee times
                second, starting with the one or two courses the trip is built around; everything else after.
                Collect deposits the same week you book — a trip with money down is a trip that happens, and a trip
                running on verbal commitments is a trip that shrinks by two players a month. From there, build the
                day-by-day plan: arrival round, marquee round on the full day, departure-day logistics. A{" "}
                <a href="/golf-trip-itinerary-template" className="text-forest-900 underline-offset-2 hover:underline">
                  golf trip itinerary template
                </a>{" "}
                saves you from inventing that structure from scratch.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                How long does it take to plan a golf trip?
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Start 4–6 months before the trip date. The active planning — collecting input, comparing options,
                deciding — takes about three to four weeks when it is run deliberately. The rest of the lead time
                exists because the things you need to book have their own calendars: group-friendly lodging at
                popular destinations thins out 3–4 months ahead, and many top public courses open tee sheets 60–90
                days out and fill the prime weekend slots fast.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                A timeline that works for most groups:
              </p>
              <div className="mt-4 space-y-2">
                {[
                  {
                    when: "4–6 months out",
                    what: "Float the trip, collect budget ranges and date availability, settle the destination type."
                  },
                  {
                    when: "3–4 months out",
                    what: "Shortlist 2–3 destinations with courses and lodging attached, group votes, book the lodging, collect deposits."
                  },
                  {
                    when: "2–3 months out",
                    what: "Reserve tee times as booking windows open. Lock the marquee round first."
                  },
                  {
                    when: "1 month out",
                    what: "Collect final payments, confirm travel plans and arrival times, build the round-by-round schedule."
                  },
                  {
                    when: "Week of",
                    what: "Reconfirm tee times and lodging check-in, share the final itinerary and packing list, assign cars."
                  }
                ].map((row) => (
                  <div
                    key={row.when}
                    className="flex flex-col gap-1 rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <p className="w-32 shrink-0 text-sm font-semibold tracking-[-0.01em] text-charcoal">{row.when}</p>
                    <p className="text-sm leading-6 text-charcoal/68">{row.what}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Can you plan a trip in six weeks? Sure — groups do it constantly. You just pay for the compression
                in fewer lodging options, leftover tee times, and higher prices. Six months is not about needing
                six months of work; it is about being first in line for the good stuff.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                How much does a golf trip cost?
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                As of 2026, most group golf trips land between $300 and $2,500 per person all-in, depending on how
                far you travel and how famous the courses are. The honest tiers:
              </p>
              <Card className="mt-5 overflow-hidden p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-charcoal/50">
                      <th className="px-5 py-3 font-medium">Trip tier</th>
                      <th className="px-5 py-3 font-medium">Per person, all-in</th>
                      <th className="px-5 py-3 font-medium">What it looks like</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        tier: "Drive-to weekend",
                        cost: "$300–$700",
                        desc: "2 nights, 2–3 rounds at solid regional courses, shared house, carpool."
                      },
                      {
                        tier: "Mid-range fly-in",
                        cost: "$700–$1,400",
                        desc: "3 nights in Myrtle Beach, Pinehurst-area, or Palm Springs with 3–4 quality rounds."
                      },
                      {
                        tier: "Premium resort",
                        cost: "$1,400–$2,500",
                        desc: "Scottsdale or Kiawah-level trip: resort lodging, marquee courses, peak season."
                      },
                      {
                        tier: "Bucket list",
                        cost: "$2,500–$5,000+",
                        desc: "Pebble Beach, Bandon Dunes, or an overseas links trip. Worth it roughly once a decade."
                      }
                    ].map((row) => (
                      <tr key={row.tier} className="border-t border-charcoal/8 align-top">
                        <td className="px-5 py-3.5 font-medium text-charcoal">{row.tier}</td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-charcoal/75">{row.cost}</td>
                        <td className="px-5 py-3.5 leading-6 text-charcoal/68">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The number people get wrong is rarely the greens fees — it is everything around them. Food, drinks,
                carts, caddies, and the rental car typically add 40–60% on top of golf and lodging. Budget all-in
                from the start and nobody comes home grumbling about the surprise total. For a full destination-by-destination
                breakdown,{" "}
                <a href="/golf-trip-cost-per-person" className="text-forest-900 underline-offset-2 hover:underline">
                  see the golf trip cost per person guide
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Common mistakes that kill golf trips
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Trips rarely die in one dramatic moment. They die from a handful of avoidable planning mistakes,
                usually in the first month:
              </p>
              <div className="mt-5 space-y-4">
                {[
                  {
                    mistake: "Picking the destination before the budget",
                    fix: "Somebody posts a link to a famous resort, the group gets excited, and three weeks later half the group quietly backs out over price. Collect budget ranges first, then only present destinations the overlap can actually afford."
                  },
                  {
                    mistake: "Planning to the loudest voice instead of the group",
                    fix: "The most enthusiastic guy in the chat is not a quorum. Collect input from everyone individually — the quiet majority's real budget and dates should drive the plan, not the first three replies."
                  },
                  {
                    mistake: "Waiting for unanimous availability",
                    fix: "Chasing a weekend that works for all twelve people is how trips slide into next year. Set a threshold — if 75–80% can make it, the trip runs — and announce the date with a deadline."
                  },
                  {
                    mistake: "Booking without collecting deposits",
                    fix: "Verbal commitments evaporate. Collect $100–$300 per person within a week of choosing the destination, before names go on any booking. Whoever has paid is coming; whoever stalls was always a maybe."
                  },
                  {
                    mistake: "Overstuffing the schedule",
                    fix: "36 holes a day for three straight days sounds great in January and feels brutal in person. Plan 3–4 rounds for a 3-day trip and protect one open evening — the long dinner is usually the part everyone remembers."
                  },
                  {
                    mistake: "One organizer carrying everything alone",
                    fix: "Burned-out organizers do not plan next year's trip. Delegate the pieces — one guy owns dinner reservations, one owns the money collection — or use a tool that collects the group input for you."
                  }
                ].map((item) => (
                  <div key={item.mistake} className="rounded-[18px] border border-charcoal/8 bg-white/80 px-5 py-4">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">{item.mistake}</h3>
                    <p className="mt-2 text-sm leading-6 text-charcoal/68">{item.fix}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Planning for different group sizes
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The five steps do not change with group size, but the difficulty curve does — every player past
                eight roughly doubles the coordination work.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                <strong className="font-semibold text-charcoal">A foursome</strong> is the easy mode. One tee time
                per round, any lodging works, and decisions happen in a single phone call. The main risk is the
                opposite of chaos: nobody feels urgency, so the trip drifts. Set the date early and book something
                non-refundable — commitment is the feature, not the bug.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                <strong className="font-semibold text-charcoal">A group of eight</strong> is the classic buddies
                trip: two foursomes, a rentable house, and enough personalities that the budget spread gets real.
                This is the size where collecting input individually starts to matter — eight guys in one thread
                produce noise, not answers. You also now need back-to-back tee times, which is exactly why booking
                60–90 days out stops being optional.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                <strong className="font-semibold text-charcoal">Twelve or more</strong> is an event, not a trip.
                You are managing three-plus tee times per round, large-house or multi-unit lodging, staggered
                arrivals, and a guaranteed dropout or two — so collect deposits early and build the budget assuming
                you lose one player. Pairings and a simple competition format (Ryder Cup-style teams work great at
                this size) keep the golf organized. For the full playbook,{" "}
                <a href="/golf-trip-planner-large-groups" className="text-forest-900 underline-offset-2 hover:underline">
                  see the large group golf trip guide
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                The best way to plan a golf trip
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                The best way to plan a golf trip is to collect budget ranges, dates, and destination preferences
                before you research a single course. Most groups do it backwards — they find a place they love and
                then discover the group cannot agree on price, dates, or both. Getting input first takes one extra
                step and saves several rounds of backtracking.
              </p>
              <p className="mt-3 text-base leading-7 text-charcoal/68">
                Outing.golf is built around this sequence. The organizer creates an outing, shares one link, and the
                group fills out budgets, dates, and preferences in a single short flow — so you can evaluate real
                options before anyone has fallen in love with the wrong resort. It is free for the organizer and the
                group, and most groups have everyone&apos;s answers back within about 24 hours.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal">
                Golf trip planning checklist
              </h2>
              <p className="mt-4 text-base leading-7 text-charcoal/68">
                Use this as a quick reference for where you are in the process:
              </p>
              <div className="mt-5 space-y-2">
                {[
                  "Set a rough destination type (coastal, desert, mountain, classic parkland)",
                  "Collect individual budget ranges from every player — privately",
                  "Gather date availability before locking anything in",
                  "Identify 2–3 real destination options that fit the budget window",
                  "Compare courses and lodging together for each destination",
                  "Share the shortlist with the group and vote on favorites",
                  "Pick the destination and lock in the date",
                  "Book lodging, then tee times — and collect deposits the same week",
                  "Build the round-by-round course schedule",
                  "Create a shared packing list before the trip"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[18px] border border-charcoal/8 bg-white/80 px-4 py-3">
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-charcoal/20" />
                    <p className="text-sm leading-6 text-charcoal/68">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-charcoal/60">
                For a more detailed version with timelines for each phase,{" "}
                <a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">
                  see the full golf trip planning checklist
                </a>
                .
              </p>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/68">
                <li>1. Start with a destination type</li>
                <li>2. Collect budget ranges early</li>
                <li>3. Lock in a date window</li>
                <li>4. Compare courses and lodging together</li>
                <li>5. Make the call</li>
                <li>How long planning takes</li>
                <li>What a golf trip costs</li>
                <li>Mistakes that kill trips</li>
                <li>Planning by group size</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-charcoal">Related</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <a href="/golf-trip-planning-checklist" className="text-forest-900 underline-offset-2 hover:underline">
                    Golf trip planning checklist
                  </a>
                </li>
                <li>
                  <a href="/golf-trip-budget-planner" className="text-forest-900 underline-offset-2 hover:underline">
                    Golf trip budget planner
                  </a>
                </li>
                <li>
                  <a href="/golf-trip-itinerary-template" className="text-forest-900 underline-offset-2 hover:underline">
                    Golf trip itinerary template
                  </a>
                </li>
                <li>
                  <a href="/buddies-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">
                    Buddies golf trip planner
                  </a>
                </li>
                <li>
                  <a href="/golf-trip-planner-large-groups" className="text-forest-900 underline-offset-2 hover:underline">
                    Planning for large groups
                  </a>
                </li>
                <li>
                  <a href="/bachelor-golf-trip-planner" className="text-forest-900 underline-offset-2 hover:underline">
                    Bachelor golf trip planner
                  </a>
                </li>
                <li>
                  <a href="/how-it-works" className="text-forest-900 underline-offset-2 hover:underline">
                    How Outing.golf works
                  </a>
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <FaqSection title="Golf trip planning FAQs" faqs={faqs} />

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Golf trip planning tool</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Stop planning by group text
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cream/74">
            Outing.golf collects budgets, dates, courses, and lodging preferences from the group in one place so
            you can actually make a decision.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <AuthCta className="bg-cream text-charcoal hover:bg-white">
              Start Planning Free
            </AuthCta>
            <Button href="/how-it-works" className="border border-cream/30 bg-transparent text-cream hover:bg-white/10">
              See How It Works
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
