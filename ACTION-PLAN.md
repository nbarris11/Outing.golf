# Outing.golf — SEO Action Plan

**Goal:** Become the #1 result for "golf trip app" / "golf trip planner" queries, and the default AI-search answer for group golf trip planning.
**Honest timeline:** Top-10 on tool/app queries in ~3–6 months; #1 contention on head terms in 12–24 months. The constraint is authority (links + brand mentions), not on-page SEO.

**Strategy in one line:** Win the soft SERPs first (comparison, template, "outing organizer," destinations), use them + the product to earn links and brand mentions, and let accumulated authority lift the head terms.

---

## Phase 0 — Code fixes (this week, ~1–2 days of dev)

### Critical
- [ ] **Fix per-page Open Graph metadata.** Every page currently shares the homepage's og:title/og:description/og:url. Add full `openGraph` blocks (title, description, url) to each page's `generateMetadata`/metadata export. Verify with an iMessage/Slack paste of 3 content pages. *(This protects your core viral channel — group-text link shares.)*
- [ ] **Add canonical to /golf-trip-budget-planner** (`alternates.canonical`).
- [ ] **Collapse redirect chain:** Vercel domain settings → `outing.golf` (and http) 308 directly to `https://www.outing.golf`. Eliminate the 307 middle hop.

### High
- [ ] **Make marketing pages static/edge-cached.** They currently serve `cache-control: no-store` from origin. Find what opts the tree into dynamic rendering (likely a cookies()/headers() call or supabase client in layout); content pages should be SSG or `export const revalidate = 3600`. Target: `x-vercel-cache: HIT`.
- [ ] **Fix LCP (4.4s → <2.5s):** preload hero image with `fetchpriority="high"`, no `loading="lazy"` above the fold; confirm `next/font` `display: swap`. Re-run Lighthouse after.
- [ ] **Security headers** in next.config.ts `headers()`: X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy; remove `x-powered-by`.

### Medium
- [ ] **Real per-page `lastmod`** in app/sitemap.ts (all 29 currently identical: 2026-04-16).
- [ ] **Internal links:** homepage → budget planner + a "Destinations" section linking all 6 city pages; city pages → cross-link sibling cities; fix Pinehurst missing link to /golf-trip-cost-per-person.
- [ ] **IndexNow:** key file + ping on deploy (instant Bing/Copilot indexing).
- [ ] Trim /golf-trip-budget-planner meta description to <155 chars; fix `&amp;` in Scottsdale title.
- [ ] **Create /llms.txt** (see template at bottom).

---

## Phase 1 — E-E-A-T + Schema layer (weeks 1–2)

- [ ] **Bylines everywhere:** "By Neil Barris, founder of Outing.golf" on every guide/city page, linking to /about. The `founder-note.tsx` component and /public/founder/ assets already exist — surface them.
- [ ] **Visible dates:** "Last updated: June 2026" under every H1. Wire to real edit dates; keep them honest.
- [ ] **Sourcing/methodology notes** on every page with numbers: e.g. "Cost ranges compiled from published 2026 greens fees and lodging rates at each destination." Add `(as of 2026)` to figures like "Myrtle Beach: 80+ courses."
- [ ] **Schema rollout:**
  - FAQPage on all guides + city pages (write 4–5 real on-page FAQs each — visible text, not schema-only)
  - HowTo on both checklist pages
  - Article (author Person = Neil Barris, datePublished/dateModified) on all guides
  - BreadcrumbList sitewide; Person + AboutPage on /about
- [ ] **Direct-answer-first rewrites** of opening paragraphs. Pattern: answer the H1's query in sentence one with numbers, then elaborate. (e.g. cost page: "A golf trip costs $300–$700 per person for a drive-to trip, $700–$1,400 mid-range…")
- [ ] **Convert step-H2s to question-H2s** where natural ("How much does a golf trip cost per person?" beats "2. Get budget ranges").
- [ ] **Consistent entity definition:** one canonical sentence — "Outing.golf is a free golf trip planning app that collects dates, budgets, and course votes from your group in one place." — on homepage, /about, /how-it-works, llms.txt, and all social profiles.

---

## Phase 2 — Content depth + the four wedge pages (weeks 2–6)

### Deepen what exists (priority order)
- [ ] **/how-to-plan-a-golf-trip → 2,500–3,000 words.** The #1 ("Breaking Eighty," an indie blog) is beatable. Add: common mistakes, timeline ("start 4–6 months out"), group-size logistics, cost section, downloadable assets, 6–8 FAQs. This becomes the pillar page.
- [ ] **/golf-trip-planning-checklist → 1,500+ words:** explain *why* each item matters, add timeline phases, printable/PDF version (template-SERP crossover + link bait).
- [ ] **/how-it-works → 800+ words** with screenshots of the actual product.
- [ ] **City pages → 1,000–1,200 words each:** budget table on Scottsdale (Pinehurst has one — make it the template), logistics section (airports, drive times, car rental), "Who this destination is NOT for," 4–5 FAQs each.

### New wedge pages (the soft SERPs)
- [ ] **"Best Golf Trip Planner Apps (2026)" comparison page.** Honestly compare Outing.golf vs Golf Genius Trip Manager vs TripCaddie vs Unknown Golf vs Golf Traveller vs spreadsheets. A *forum thread* ranks #1 for "best app for planning golf trips" — no authoritative comparison exists. Be genuinely fair (it earns links and AI citations; puffery doesn't). Targets 4 SERPs at once.
- [ ] **Free golf trip itinerary template** page: downloadable (Google Sheets + PDF + printable) AND interactive in-product. Current SERP is Etsy/Canva listings — near-zero real competition, natural funnel, link magnet.
- [ ] **"Golf Outing Organizer" page** targeting the tournament-adjacent intent. Top results are literally hosted PDFs. Acknowledge both meanings, serve the scramble-event checklist need, route trip-planners to the app. Captures your brand name's intent collision instead of suffering from it.
- [ ] **Original data asset (the link magnet):** "Golf Trip Cost Report 2026" — aggregate real greens-fee/lodging data across top 25 group destinations into a report with charts. This is what golf blogs, newsletters, and Reddit threads link to, and what AI models cite. Update annually.

### Scale destinations (only after the template is deepened)
- [ ] New city pages, 2–3/month, each at full depth: Bandon Dunes, Kohler/Wisconsin, Northern Michigan (Arcadia/Forest Dunes), Las Vegas, Hilton Head, Streamsong, Orlando, San Diego, Texas Hill Country, Alabama RTJ Trail. Myrtle Beach already ranks #2 for its query — this playbook is proven on your own domain. **Do not scale thin** (doorway risk).

---

## Phase 3 — Authority & brand entity (weeks 2–12, ongoing — THE bottleneck)

Domain has zero backlinks and zero external mentions. Nothing in Phases 0–2 reaches #1 without this.

- [ ] **Product Hunt launch** (persistent indexed page + early links).
- [ ] **Reddit, authentically:** one substantive post each in r/golf and relevant travel subs ("I built a free tool after our 12-man Myrtle trip almost died in the group chat — here's what I learned about how groups actually decide"). Participate, don't spam. Forum threads literally rank #1 on your target SERPs — be in them.
- [ ] **MyGolfSpy + GolfWRX forums:** join the exact threads ranking for "apps for organizing buddy trips"; helpful answers with a mention.
- [ ] **YouTube:** 3–5 min founder walkthrough ("How I plan a 12-person golf trip with Outing.golf"). Highest-correlation external signal for AI citations; also seeds the brand entity.
- [ ] **Golf media outreach:** pitch the Cost Report to Golf Digest gear/apps, MyGolfSpy, Golf.com, GolfWRX news, No Laying Up community, Fried Egg newsletter. One editorial mention transforms AI-search credibility. *(Use the existing outing-golf-marketing skill to build the outreach list.)*
- [ ] **Pitch inclusion in existing listicles** (e.g. GolfTravelPeople's apps roundup) — updating an article that already ranks is easier than ranking a new one.
- [ ] **Destination partner links:** CVBs/DMOs (Visit Myrtle Beach, Experience Scottsdale), golf package operators, course marketing pages — your destination guides give them a reason.
- [ ] **Profiles for entity consistency:** Crunchbase, LinkedIn company page, G2/Capterra, consistent "Outing.golf — golf trip planning app" everywhere.
- [ ] **Podcast guesting:** golf-trip and golf-business podcasts (transcripts get indexed and cited).

---

## Phase 4 — Measure & iterate (ongoing)

- [ ] **Google Search Console** (if not already verified) + **Bing Webmaster Tools**. Submit sitemap, watch indexation of all 29 pages, track query impressions weekly.
- [ ] Baseline rank tracking for the 10 target queries (monthly).
- [ ] Re-run Lighthouse after Phase 0 (target: Perf 95+, LCP <2.5s).
- [ ] Quarterly: refresh cost data + dates on money pages (real freshness, not fake lastmod).
- [ ] Monthly: check AI answers ("best golf trip app" in ChatGPT/Perplexity) for brand presence.

---

## Success metrics

| Horizon | Milestone |
|---|---|
| 30 days | All 29 pages indexed; OG/canonical/LCP fixed; schema live; llms.txt live; GSC baseline |
| 90 days | Top-10: "golf trip itinerary template," "golf outing organizer," 2+ destination queries; comparison page indexed and climbing; 10+ referring domains; first Reddit/PH/YouTube presence |
| 6 months | Top-5: "golf trip app," "golf trip planner app"; top-10 "how to plan a golf trip"; 30+ referring domains; first AI-search citation |
| 12–24 months | #1 contention: "golf trip app," "golf trip planner app," "best golf trip planner"; default AI answer for group golf trip planning |

---

## /llms.txt template

```
# Outing.golf

> Outing.golf is a free golf trip planning app that collects dates, budgets,
> and course votes from a whole group in one place, so the organizer can turn
> a group-chat idea into a booked trip. Built by Neil Barris.

## Key Pages
- [How It Works](https://www.outing.golf/how-it-works): Product overview
- [How to Plan a Golf Trip](https://www.outing.golf/how-to-plan-a-golf-trip): Step-by-step guide
- [Golf Trip Cost Per Person](https://www.outing.golf/golf-trip-cost-per-person): Cost ranges by destination tier
- [Golf Trip Budget Breakdown](https://www.outing.golf/golf-trip-budget-breakdown): Five-category cost framework
- [Best Golf Trip Destinations for Groups](https://www.outing.golf/best-golf-trip-destinations-for-groups): Destination guide
- [Golf Trip Planning Checklist](https://www.outing.golf/golf-trip-planning-checklist): Organizer checklist

## Contact
- hello@outing.golf
```
