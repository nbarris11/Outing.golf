"use client";

import LogRocket from "logrocket";

export function PinSeekerCard({
  outingId,
  placement = "trip_hq"
}: {
  outingId?: string;
  placement?: "trip_hq" | "planning";
}) {
  function handleClick() {
    // Placement travels as an event property so the three surfaces can be
    // compared in LogRocket, not just counted together.
    LogRocket.track("pin_seeker_referral_click", { placement });

    // Durable server-side record — session analytics only retain ~30 days,
    // and this is the number the partnership is measured on.
    // keepalive so the request survives the tab losing focus.
    void fetch("/api/partner-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner: "pin_seeker", placement, outingId }),
      keepalive: true
    }).catch(() => {
      // Never let tracking break the outbound link.
    });
  }

  return (
    <aside className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 print:hidden">
      <div><p className="text-xs uppercase tracking-widest text-charcoal/50">Optional extra · Pin Seeker</p><h3 className="mt-1 font-semibold text-forest-900">Bring a little competition to your trip</h3><p className="mt-1 text-sm text-charcoal/65">Formats, pairings, and a free live leaderboard upgrade for Outing.golf groups.</p></div>
      <a href="https://www.pinseekercompetitions.com/outing?ref=outinggolf" target="_blank" rel="noopener noreferrer" onClick={handleClick} className="rounded-full border border-forest-900/20 px-4 py-2 text-sm font-medium">Explore competitions ↗</a>
    </aside>
  );
}
