"use client";

import { useState } from "react";
import { inviteMemberAction } from "@/lib/actions/outings";
import { trackFunnel } from "@/lib/analytics/funnel-client";
import type { FunnelContext, FunnelProperties } from "@/lib/analytics/funnel";
import { buildOutingInviteCopy } from "@/lib/outing-invite-copy";
import { SubmitButton } from "@/components/ui/submit-button";

interface Props {
  shareLink: string;
  outingName: string;
  destination?: string;
  analytics: FunnelContext;
  newlyCreated?: boolean;
  pendingInviteCount?: number;
  canInviteByEmail?: boolean;
  notice?: { message: string; type: "success" | "error" };
}

export function PostCreateBanner({ shareLink, outingName, destination, analytics, newlyCreated = false, pendingInviteCount = 0, canInviteByEmail = false, notice }: Props) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");

  const invitation = buildOutingInviteCopy(outingName, destination, shareLink);

  function track(method: FunnelProperties["method"]) {
    trackFunnel("outing_share_action", analytics, { method, placement: "organizer_banner" });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setFeedback("Link copied. Paste it into your group chat so the first golfer can join.");
      track("copy_link");
    } catch {
      setCopied(false);
      setFeedback("Select the invite link and copy it to your group chat.");
    }
  }

  async function handleCopyMessage() {
    try {
      await navigator.clipboard.writeText(invitation.withLink);
      setFeedback("Invite message copied. Paste it into your group chat.");
      track("copy_message");
    } catch {
      setFeedback("Could not copy the message. Use Copy link or select the link above.");
    }
  }

  async function handleShare() {
    if (!navigator.share) return handleCopyMessage();
    try {
      await navigator.share({ title: invitation.title, text: invitation.message, url: shareLink });
      track("native_share");
      setFeedback("Keep an eye on The group below to see who joins.");
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setFeedback("Sharing did not open. Use Copy link instead.");
      }
    }
  }

  const smsBody = encodeURIComponent(invitation.withLink);
  const emailSubject = encodeURIComponent(invitation.title);
  const emailBody = encodeURIComponent(invitation.withLink);

  return (
    <div id="invite-group" className="mb-6 scroll-mt-20 rounded-[28px] bg-forest-900 p-6 text-cream">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/70">{newlyCreated ? "Your trip is created" : "Next step"}</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
            Get your first golfer on board
          </h2>
          <p className="mt-1 text-sm text-cream/65">
            Send this link to your group chat. Friends create a free account, join the trip, and add their dates and budget.
          </p>
          {pendingInviteCount > 0 && <p className="mt-2 text-sm text-cream/80">{pendingInviteCount} email invite{pendingInviteCount === 1 ? "" : "s"} pending. No other golfers have joined yet.</p>}
        </div>
      </div>

      {/* Share link input */}
      <div className="mt-5 flex items-center gap-2">
        <input
          readOnly
          aria-label="Group invite link"
          value={shareLink}
          className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-cream/80 outline-none select-all"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-xl bg-cream px-4 py-2 text-sm font-semibold text-charcoal hover:bg-white transition-colors"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {/* Quick-share row */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={handleShare} className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-charcoal hover:bg-white">Share with friends</button>
        <button type="button" onClick={handleCopyMessage} className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-cream hover:bg-white/20">Copy invite message</button>
        <a
          href={`sms:?body=${smsBody}`}
          onClick={() => track("sms_opened")}
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-cream hover:bg-white/20 transition-colors"
        >
          Share by text
        </a>
        <a
          href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
          onClick={() => track("email_opened")}
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-cream hover:bg-white/20 transition-colors"
        >
          Share by email
        </a>
      </div>
      <p role="status" className="mt-3 text-sm text-cream/80">{feedback || "You can keep planning while your friends join."}</p>
      {notice ? (
        <p role={notice.type === "error" ? "alert" : "status"} className={`mt-3 rounded-xl px-4 py-3 text-sm ${notice.type === "error" ? "bg-red-100 text-red-900" : "bg-emerald-100 text-forest-900"}`}>
          {notice.message}
        </p>
      ) : null}
      {canInviteByEmail ? (
        <form action={inviteMemberAction} className="mt-5 border-t border-white/15 pt-5">
          <input type="hidden" name="outingId" value={analytics.outingId} />
          <label htmlFor="firstInviteEmail" className="block text-sm font-medium">Or invite a golfer by email</label>
          <p className="mt-1 text-xs text-cream/65">We&apos;ll send them a personal link. You can invite more people later.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input id="firstInviteEmail" name="emails" type="email" placeholder="friend@example.com" autoComplete="email" required className="min-w-0 flex-1 rounded-xl bg-white px-4 py-2.5 text-sm text-charcoal outline-none focus:ring-2 focus:ring-cream/70" />
            <SubmitButton label="Send invite" pendingLabel="Sending..." className="justify-center bg-cream text-charcoal hover:bg-white" />
          </div>
        </form>
      ) : null}
    </div>
  );
}
