"use client";

import Image from "next/image";
import LogRocket from "logrocket";

export function PinSeekerCard() {
  return (
    <div className="rounded-[28px] bg-cream p-6 shadow-sm ring-1 ring-charcoal/6">
      <Image
        src="/partners/pin-seeker.png"
        alt="Pin Seeker Competitions"
        width={1536}
        height={1024}
        className="h-auto w-full max-w-[320px]"
      />

      <h3 className="mt-4 font-serif text-xl font-semibold text-forest-900">
        Want a real competition on this trip?
      </h3>
      <p className="mt-2 text-sm text-charcoal">
        Once your golf trip is planned, Pin Seeker Competitions brings it to
        life with custom formats, live leaderboards, pairings, side games,
        and complete competition management.
      </p>

      <p className="mt-4 rounded-xl bg-forest-900/10 px-4 py-3 text-sm font-medium text-forest-900">
        Outing.golf groups get a free live leaderboard upgrade.
      </p>

      <a
        href="https://www.pinseekercompetitions.com/outing?ref=outinggolf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => LogRocket.track("pin_seeker_referral_click")}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-cream shadow-[0_18px_35px_rgba(20,58,44,0.18)] transition hover:bg-forest-800"
      >
        Set up your competition
      </a>
    </div>
  );
}
