# Activation funnel v1

## Scope and rollout

This release adds browser-observed events to the existing LogRocket project. It
does not change authentication, membership writes, email delivery, or the database.
Collection starts after deployment; it cannot reconstruct historical invite opens.
Filter all new reports to `funnel_version = activation_v1`. Use the deployment
timestamp as the start of the new measurement period, not the implementation date.

## Events

| Event | Meaning |
| --- | --- |
| `outing_created` | Organizer reached a creation-success page with a recent persisted outing. |
| `outing_share_action` | Successful clipboard copy/native share, or text/email composer opened. `method` distinguishes these. |
| `outing_invite_opened` | Eligible visitor hydrated a valid shared-link or pending email-invite page. Excludes organizer self-opens and already-joined shared-link visitors. |
| `outing_joined` | Non-organizer reached a join-success page with a recent persisted membership; both invitation routes covered. |
| `outing_preferences_submitted` | Non-organizer reached a preference-save success page with a recent saved response and membership. |

Common properties: `outing_id`, `actor_id` (or `anonymous`), `actor_role`,
`funnel_version`, `placement`. Milestones also have a stable `event_key`.
No invitation token, URL, email address, trip name, destination, budget, or response
text is added to these event payloads. Existing session-recording behavior is unchanged.

Share methods: `copy_link`, `copy_message`, `native_share`, `sms_opened`,
`email_opened`. Clipboard success is not proof of delivery. Composer opens are
intent only. Native sharing is not proof the recipient read the message.
Direct server-sent email invitations are not counted as a share action; their
landing-page opens and subsequent activation are covered.

## Exclusions and duplicate handling

- Production builds on `outing.golf` / `www.outing.golf` only; preview hosts excluded.
- Respects `NEXT_PUBLIC_LOGROCKET_ENABLED=false`.
- Demo mode, admin actors, admin-organized outings, reserved example/test email
  domains, and explicit internal accounts are excluded. Missing organizer metadata
  fails closed for analytics, not for product functionality.
- Set optional server variable `ANALYTICS_INTERNAL_EMAILS` to a comma-separated
  list of other testing/internal accounts (alongside existing `ADMIN_EMAILS`).
  Ordinary personal accounts cannot reliably be identified as tests automatically.
- Creation/join/preferences are deduped in bounded local storage per outing/actor.
  Open events are deduped per outing in session storage, including the signed-out
  to signed-in return. React remounts are deduped in memory as well.
- Cleared storage, another browser/device, storage eviction, or delivery failure
  can cause duplicates or missing events. Aggregate milestones by `event_key`,
  not raw event count. Storage exceptions and analytics failures do not block UX.
- Success hints require matching server-loaded records updated/created within
  15 minutes. Query strings alone cannot create a milestone without those records.
  This is browser analytics, not a tamper-proof transaction ledger.

## How to measure it

Use LogRocket Custom Event filters for each event, restricted to the version above.
The group journey crosses people: do **not** put all five steps in a same-user or
same-session funnel and call the result group activation.

For a cohort of newly created outings, join events by `outing_id` in an export/report:

1. Unique created outings (denominator).
2. Outings with a share action (segmented by method; direct email sends excluded).
3. Outings with an eligible invitation open.
4. Outings with at least one non-organizer joining.
5. Outings with at least one non-organizer submitting preferences.

Report each stage as a percentage of the same creation cohort, allowing seven days
after creation. Activation = stage 5 / stage 1. Also compare participant-level
join-to-response using distinct `(outing_id, actor_id)` pairs, excluding `anonymous`.
Do not infer delivery or recipient conversion from number of copied links.

Compare full, equally aged weekly cohorts; show counts with rates while traffic is
small. Validate creation/member/response counts against Supabase, which remains
the source of truth. JavaScript blockers, users leaving before hydration, invalid
links, and booked-outing redirects can cause browser events to be missed. Anonymous
people cannot be reliably matched across devices, and unauthenticated internal
visitors to real users' trips cannot always be excluded.

No saved LogRocket dashboard is created by the code change; configure the report
in the analytics account after confirming production events arrive.

## Checks

Run `npm test -- --maxWorkers=2` and `npm run typecheck`. Test a disposable trip:
create -> copy message -> open link in another browser -> join -> save preferences.
Check SDK payloads for the five events, then reload success pages to check dedupe.
Use reserved test accounts for product checks (they intentionally emit no funnel
events); use mocked SDK tests for event delivery without polluting production data.
