"use client";

import { useState } from "react";

type BookingState = "no_vote" | "voting_open" | "ready";

const TOOLTIP: Record<BookingState | "skipped", string> = {
  no_vote:
    "Open a group vote first — let members pick their preferred course and lodging before you book.",
  voting_open:
    "Voting is still open. Close the vote first, then book the trip and confirm it here.",
  ready:
    "Votes are in! Book the hotel and tee times directly with the venue, then click here to lock it in and notify everyone.",
  skipped:
    "Skipping the group vote — book the trip and click here to notify everyone."
};

interface MarkAsBookedButtonProps {
  outingId: string;
  markAsBooked: (formData: FormData) => Promise<void>;
  bookingState: BookingState;
}

export function MarkAsBookedButton({ outingId, markAsBooked, bookingState }: MarkAsBookedButtonProps) {
  const [visible, setVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const isReady = bookingState === "ready" || skipped;
  const tooltipKey: BookingState | "skipped" = skipped ? "skipped" : bookingState;

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className="relative"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {/* Tooltip */}
        {visible && (
          <div className="absolute bottom-full right-0 z-50 mb-2 w-64 rounded-[16px] bg-charcoal px-4 py-3 text-xs leading-relaxed text-cream shadow-xl">
            {/* Arrow */}
            <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-charcoal" />
            {isReady ? (
              <>
                <p className="font-semibold text-emerald-300">
                  {skipped ? "Booking without a vote" : "✓ Ready to book!"}
                </p>
                <p className="mt-1 text-cream/75">{TOOLTIP[tooltipKey]}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-amber-300">
                  {bookingState === "no_vote" ? "Vote not started" : "Voting still open"}
                </p>
                <p className="mt-1 text-cream/75">{TOOLTIP[bookingState]}</p>
              </>
            )}
          </div>
        )}

        {/* Active booking form */}
        {isReady ? (
          <form action={markAsBooked}>
            <input type="hidden" name="outingId" value={outingId} />
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)] transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto"
            >
              ✓ Mark as booked
            </button>
          </form>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full cursor-not-allowed rounded-full bg-charcoal/12 px-4 py-2 text-sm font-semibold text-charcoal/35 sm:w-auto"
          >
            ✓ Mark as booked
          </button>
        )}
      </div>

      {/* Skip voting — only shown in no_vote state, not once voting has started */}
      {bookingState === "no_vote" && !skipped && (
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="text-xs text-charcoal/40 underline-offset-2 hover:text-charcoal/60 hover:underline transition-colors"
        >
          Skip voting and book directly
        </button>
      )}

      {/* Undo skip */}
      {skipped && (
        <button
          type="button"
          onClick={() => setSkipped(false)}
          className="text-xs text-charcoal/40 underline-offset-2 hover:text-charcoal/60 hover:underline transition-colors"
        >
          ← Require vote first
        </button>
      )}
    </div>
  );
}
