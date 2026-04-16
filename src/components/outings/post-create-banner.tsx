"use client";

import { useState } from "react";

interface Props {
  shareLink: string;
  outingName: string;
}

export function PostCreateBanner({ shareLink, outingName }: Props) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="mt-5 rounded-[22px] border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf3,#f7f4ee)] px-5 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-charcoal">
          ✓ Invite link ready — share it whenever you&apos;re ready
        </p>
        <button
          onClick={() => setDismissed(false)}
          className="shrink-0 text-xs text-charcoal/45 hover:text-charcoal transition-colors"
        >
          Show invite options
        </button>
      </div>
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      window.prompt("Copy this invite link", shareLink);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const smsBody = encodeURIComponent(
    `Hey! I'm planning a golf trip — ${outingName}. Fill out your dates and budget here: ${shareLink}`
  );
  const emailSubject = encodeURIComponent(`Join my golf trip — ${outingName}`);
  const emailBody = encodeURIComponent(
    `Hey,\n\nI'm planning a golf trip and I want you in. Fill out your dates and budget here (takes about 90 seconds):\n\n${shareLink}\n\nThanks`
  );

  return (
    <div className="mt-5 rounded-[28px] bg-forest-900 p-6 text-cream">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/50">Your trip is created</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
            🎉 Now invite your group
          </h2>
          <p className="mt-1 text-sm text-cream/65">
            They fill out dates and budget in about 90 seconds — then you&apos;ll see overlap here.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-cream/35 hover:text-cream/70 transition-colors text-xl leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Share link input */}
      <div className="mt-5 flex items-center gap-2">
        <input
          readOnly
          value={shareLink}
          className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-cream/80 outline-none select-all"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-xl bg-cream px-4 py-2 text-sm font-semibold text-charcoal hover:bg-white transition-colors"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {/* Quick-share row */}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`sms:?body=${smsBody}`}
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-cream hover:bg-white/20 transition-colors"
        >
          💬 Share via iMessage
        </a>
        <a
          href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-cream hover:bg-white/20 transition-colors"
        >
          ✉️ Share via email
        </a>
      </div>
    </div>
  );
}
