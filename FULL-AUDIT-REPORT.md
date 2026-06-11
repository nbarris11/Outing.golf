# Outing.golf — Full SEO Audit Report

**Audit date:** June 10, 2026
**Site:** https://www.outing.golf (29 sitemap URLs; Next.js App Router on Vercel)
**Goal:** Rank #1 for "golf trip app," "golf trip planner," and golf-outing-related queries

---

## Executive Summary

### Overall SEO Health Score: 58 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 61 | 13.4 |
| Content Quality (E-E-A-T) | 23% | 54 | 12.4 |
| On-Page SEO | 20% | 62 | 12.4 |
| Schema / Structured Data | 10% | 45 | 4.5 |
| Performance (CWV) | 10% | 82 | 8.2 |
| AI Search Readiness (GEO) | 10% | 41 | 4.1 |
| Images | 5% | 70 | 3.5 |
| **Total** | | | **58.5** |

### The one-paragraph diagnosis

The site's on-page foundation is genuinely good — clean URLs, correct keyword-targeted titles, SSR content, a coherent 29-page content hub, and 100/100 Lighthouse SEO. The problem is **authority and depth**: the domain has effectively **zero backlinks** (never crawled by Common Crawl, no referring domains found), every content page is **half the word count of what ranks**, there is **no author/date/source attribution anywhere**, and the brand **does not exist in any external corpus** (no Reddit, Product Hunt, YouTube, press, or comparison-article mentions). Outing.golf appeared on **0 of 10 target SERPs**. The competitors who do rank (golftraveller.com, golftrip.ai, flowtrip.app, 18away.com) are comparably small — so the gap is closable, but it closes through content depth + links + brand mentions, not more on-page tweaks.

### Top 5 critical issues

1. **Zero domain authority / no backlinks.** Common Crawl has never indexed the domain; only external link found is your own Instagram. This caps every ranking ambition.
2. **OG tags hardcoded to homepage values on every page** (`og:url` = homepage everywhere). Every social/iMessage share of a content page shows the wrong title, description, and URL — killing the exact channel (group texts!) your audience shares links in.
3. **Brand entity does not exist off-site.** No Reddit, Product Hunt, YouTube, press, forum, or listicle mentions. AI search (ChatGPT/Perplexity/AI Overviews) cannot recommend a product it has never seen mentioned anywhere.
4. **Content is systematically thin.** /how-to-plan-a-golf-trip = 786 words vs. ~1,500+ for what ranks; /golf-trip-planning-checklist ≈ 300–430 words; /how-it-works = 365. No bylines, no dates, no sources on any page.
5. **LCP is 4.4s on mobile (POOR)** with HTML served uncached from origin (`x-vercel-cache: MISS`, `cache-control: no-store`). FCP is 1.1s and CLS is 0, so this is one structural fix (hero/LCP preload + static generation), not a rewrite.

### Top 5 quick wins

1. Fix per-page Open Graph metadata (one `generateMetadata` pattern fix).
2. Add missing canonical on /golf-trip-budget-planner; collapse the 2-hop apex→www redirect chain to one 308.
3. Ship `/llms.txt` (1 hour; Perplexity/Claude read it).
4. Add FAQPage + HowTo + Article schema to the content pages that have none (only homepage + how-to page have any).
5. Add visible "By Neil Barris, founder of Outing.golf" bylines + "Last updated: [Month Year]" to every guide — the FounderNote component and /public/founder/ assets already exist.

---

## 1. SERP & Competitive Landscape (the strategy-defining findings)

### Intent split confirmed: "golf trip" ≠ "golf outing"

- **"golf trip …" queries** = multi-day buddies travel. SERPs: travel agencies (Golfbreaks, Golf Zoo), trip-manager SaaS (Golf Genius Trip Manager $149/trip, TripCaddie, Unknown Golf, Golf Traveller), editorial guides (PGA.com, Golf Digest, Breaking Eighty).
- **"golf outing …" queries** = charity/corporate scramble **events at one course**. SERPs: tournament software (Event Caddy, Golf Outing Pro, PlayThru, Gallus) and literal hosted PDF checklists ranking #1–2.
- **Strategic implication:** Your brand name keyword-matches the *wrong* intent cluster. Primary targeting must say "golf trip planner/app" everywhere; "golf outing" is a separate, surprisingly soft SERP you can opportunistically capture with one dedicated page (the #1 results are PDFs — the weakest top results found in the whole analysis).

### Where outing.golf stands today

- Appeared on **0 of 10** target SERPs.
- Only observed organic top-10: **#2 for "myrtle beach golf trip planner for groups"** — proof the destination-page playbook works.
- Brand SERP for `"outing.golf"` returns generic golf-outing pages, not the company.

### Per-query summary

| Query | Who wins | Format that wins | Beatable? |
|---|---|---|---|
| golf trip app | unknowngolf.com, golfgenius.com, golftraveller.com | SaaS product pages | Yes — small domains ranking |
| golf trip planner | Golfbreaks, TripCaddie, agencies | Agency homepages (service intent) | Partially — mixed intent |
| golf trip planner app | Golfbreaks app page, forum thread, small SaaS | Tool pages + app stores | Yes — low competition |
| golf outing planner / organizer | PDFs + tournament SaaS | PDF checklists (!) | Very — weakest SERPs found |
| best app for planning golf trips | MyGolfSpy **forum thread** #1 | No authoritative listicle exists | Yes — glaring content gap |
| how to plan a golf trip | breakingeighty.com (indie blog) #1 | 2,000–3,000-word guides | Yes — with depth + links |
| golf trip itinerary template | PosterMyWall, Etsy, Canva shops | Printable templates | Very — no real SaaS competitor |
| buddies golf trip planner | mybuddiestrip.com, TripCaddie | Mixed | Yes |

### Competitor tiers

- **Strong brands, different model (beatable on intent):** Golfbreaks, Golf Genius ($149/trip, tournament DNA), PGA/Golf Digest editorial.
- **Direct small competitors currently outranking you:** TripCaddie, Unknown Golf, Golf Traveller, GolfTrip.ai, FlowTrip (generic group-trip app winning via one programmatic golf landing page), 18away (template microsite).
- **Not actually competitors:** GolfGameBook, 18Birdies (scoring apps — ranked nowhere on planning queries).

### Five biggest ranking opportunities

1. **"Best golf trip planner apps" comparison content** — a forum thread ranks #1; no authoritative comparison exists. One page can enter 4 SERPs.
2. **Free interactive golf trip itinerary template** — SERP is Etsy/Canva junk; a genuinely useful free template + product funnel wins almost uncontested.
3. **Scale the destination playbook** — Myrtle Beach already ranks #2; replicate with real depth across Bandon, Kohler/Wisconsin, Northern Michigan, Vegas, Hilton Head, Streamsong, etc.
4. **"How to plan a golf trip" definitive guide** — #1 is an indie blog; needs 3,000+ words, original data, links.
5. **"Golf outing organizer" capture page** — beat the PDFs with one well-built page acknowledging both meanings of "outing."

---

## 2. Technical SEO (61/100)

### Critical
- **C1 — OG tags duplicated site-wide.** Every page emits the homepage's `og:title`, `og:description`, and `og:url`. Root cause: layout-level `openGraph` default never overridden in page `generateMetadata()`. Affects social shares, link previews in group texts (your core viral loop), and creates duplicate signals.
- **C2 — Missing canonical on /golf-trip-budget-planner** (only audited page without one).

### High
- **H1 — 2-hop redirect chain:** `http://outing.golf` → 308 → `https://outing.golf` → 307 → `https://www.outing.golf`. Second hop is a *temporary* 307. Fix to single-hop 308 to www in Vercel domain config.
- **H2 — Security headers missing:** X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy all absent; `x-powered-by: Next.js` exposed. Add via `headers()` in next.config.ts.
- **H3 — No edge caching on HTML:** `x-vercel-cache: MISS`, `cache-control: private, no-cache, no-store`. Marketing pages are hitting origin compute on every request — this inflates TTFB/LCP. Content pages should be static/ISR (`export const revalidate = 3600`). Likely cause: something in layout opting the whole tree into dynamic rendering.
- **H4 — Schema missing on most pages** (see §4).

### Medium
- **M1 — sitemap lastmod identical (2026-04-16) on all 29 URLs** — fabricated-looking; use real per-page dates in app/sitemap.ts.
- **M2 — Homepage doesn't link to /golf-trip-budget-planner or ANY destination page.** Destination pages are orphaned from the homepage.
- **M3 — Meta description >155 chars on /golf-trip-budget-planner.**
- **M4 — No IndexNow** (instant Bing/Copilot indexing; free).
- **M5 — Destination pages don't cross-link to each other** (no horizontal cluster linking).

### Low
- `&amp;` entity rendered in Scottsdale title tag; HSTS lacks `includeSubDomains`/`preload`; no explicit robots meta defense-in-depth on private routes.

### Passing
robots.txt clean and correct; sitemap valid; SSR delivering full content/meta to crawlers; viewport correct; 404 handling OK; HSTS present.

---

## 3. Content Quality & E-E-A-T (54/100)

### Per-page status

| Page | Words | Target | Byline | Date | Verdict |
|---|---|---|---|---|---|
| Homepage | 1,118 | 500+ | No | No | OK length; product-forward |
| /how-it-works | 365 | 800 | No | No | Severely thin |
| /how-to-plan-a-golf-trip | 786 | 1,500+ | No | No | Half of competitive depth |
| /golf-trip-planning-checklist | ~300–430 | 1,500 | No | No | Most severe shortfall |
| /best-golf-trip-destinations | 1,064 | 1,500 | No | No | Close; needs methodology |
| /scottsdale-golf-trip-planner | 700 | 800–1,000 | No | No | Thin; **no budget table** (Pinehurst has one) |
| /pinehurst-golf-trip-planner | 829 | 800–1,000 | No | No | Marginal |

### E-E-A-T breakdown (59/100 internally)
- **Experience 12/20:** Zero first-hand signals ("when we tested," "organizers using Outing found…"). Founder story exists as an unused component (src/components/marketing/founder-note.tsx + /public/founder/ assets) — built but not surfaced beyond homepage.
- **Expertise 15/25:** Real category knowledge (Pinehurst No. 2 vs No. 4, Gil Hanse renovation, We-Ko-Pa value play) but no sources, no credentials, no dated price data.
- **Authoritativeness 10/25:** Zero outbound citations, zero press/partner signals, no original data assets. Entirely self-referential.
- **Trustworthiness 22/30:** Contact email sitewide, legal pages, advertise disclosure — good. **No dates anywhere** is the gap.

### Doorway-page risk: MODERATE (yellow flag)
Scottsdale vs Pinehurst share ~40–45% structural overlap (identical H2 skeleton, related-cards, CTA blocks) but genuinely different body content. At 6 city pages this is fine; **if you scale to 15+ cities on this template without deepening each, it becomes a doorway cluster Google's spam systems catch.** Scale with real differentiation: unique tables, FAQs, logistics sections, "who this is NOT for."

---

## 4. Schema / Structured Data (45/100)

**Current state:** Homepage has 4 JSON-LD blocks (SoftwareApplication, Organization w/ founder Neil Barris, WebSite, FAQPage). /how-to-plan-a-golf-trip has HowTo/Article markup. **Everything else — both city pages, budget planner, checklist, how-it-works, about — has zero structured data.**

**Add, in priority order:**
1. **FAQPage** on every guide + city page (4–5 real questions each; directly feeds AI Overviews and PAA).
2. **HowTo** on /golf-trip-planning-checklist and /golf-weekend-planning-checklist.
3. **Article** (with author Person → Neil Barris, datePublished, dateModified) on all guides.
4. **BreadcrumbList** sitewide.
5. **Person** schema for Neil Barris on /about + **AboutPage/ContactPage** types.
6. City pages: Article + FAQPage (+ optional TouristDestination).
7. Keep SoftwareApplication on homepage; add `offers` (free) — do NOT add aggregateRating until you have legitimate review counts.

---

## 5. Performance (82/100)

Lighthouse mobile (lab): **Perf 82, SEO 100, A11y 95, Best Practices 100.** Payload lean at 360 KiB. CLS 0, TBT 60ms, FCP 1.1s.

**The one failure: LCP 4.4s (POOR; threshold 2.5s).**
- FCP→LCP gap of 3.3s = LCP element (hero) discovered/rendered late: not preloaded, behind hydration, or font-blocked.
- Compounded by no-store HTML (every request hits origin — see Technical H3).

**Fixes ranked:** (1) preload hero image with `fetchpriority="high"`, remove any lazy-loading on it (~1.9s savings); (2) make marketing pages static/ISR so they serve from edge; (3) check next/font uses `display: swap`; (4) trim 49 KiB unused JS (bundle-analyzer); (5) verify TTFB <500ms after caching fix.

CrUX field data: unavailable (likely below traffic threshold — itself a signal of how early-stage the domain is).

---

## 6. AI Search Readiness / GEO (41/100)

| Platform | Score | Primary blocker |
|---|---|---|
| Google AI Overviews | 28 | No FAQ/HowTo schema breadth; no authorship/sourcing |
| ChatGPT search | 22 | Brand absent from external corpus |
| Perplexity | 35 | No llms.txt; unsourced statistics |
| Bing Copilot | 30 | No schema breadth; undated content |

- **AI crawler access: PASS.** robots.txt allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, etc.
- **llms.txt: 404.** Create it (template in ACTION-PLAN.md).
- **Citability:** Best pages are /golf-trip-cost-per-person (61/100 — the four-tier cost table is exactly what AI extracts) and /golf-trip-budget-breakdown (58 — the % framework). Worst: /golf-trip-planner-vs-spreadsheet (29 — comparison with no numbers). Universal flaws: answers don't lead the first sentence; zero source attribution on every cost figure; no author; no dates; H2s are steps, not questions.
- **Brand entity: the biggest gap in the entire audit.** Zero mentions on Wikipedia, Reddit, Product Hunt, Hacker News, YouTube, or any golf publication. "Outing.golf" vs "Outing" vs "the outing" used inconsistently on-site. AI models cannot cite an entity that exists only on its own domain.

---

## 7. Backlinks & Authority (effectively 0)

- Common Crawl: **zero captures, 2018–2026** — the domain has never entered the indexed web's link graph.
- Wayback: one 2018 placeholder capture (prior domain tenant). Current site is new to the web.
- Only external "link" found: your own Instagram profile.
- **Tier: brand new / DA ≈ 1–10, referring domains ≈ 0–5.**
- Competitive head terms are held by DA 50–85 domains. Long-tail and destination terms are winnable near-term on content quality; head terms require 12–24 months of sustained link + brand acquisition.

---

## 8. What's already right (don't break these)

- Keyword-correct title architecture ("Golf Trip Planner for Groups | Outing.golf")
- Clean URL slugs that exactly match query patterns
- SSR — full content and meta in raw HTML
- robots.txt and sitemap fundamentals
- Lean page weight, zero CLS
- The content-hub topology (hub guides + destination spokes) is the right architecture — it just needs 2–3× the depth and interlinking
- The Myrtle Beach page proves the model: it's your only top-10 ranking and it's the template to scale

---

*Companion file: [ACTION-PLAN.md](ACTION-PLAN.md) — prioritized roadmap with effort estimates.*
