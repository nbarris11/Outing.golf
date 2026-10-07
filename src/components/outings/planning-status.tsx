"use client";
import { useState, useTransition } from "react";
import type { Outing, GolfCourseOption, LodgingOption } from "@/types/domain";
import {
  bookingProgress,
  tripReadiness,
  datesAreConfirmed,
  tripDayLabel,
} from "@/lib/trip-plan";
import { updatePlanningSetup } from "@/lib/actions/trip-plan";
export function PlanningStatus({
  outing,
  courses,
  lodging,
  editable = false,
}: {
  outing: Outing;
  courses: GolfCourseOption[];
  lodging: LodgingOption | null;
  editable?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [reference, setReference] = useState(
    bookingProgress(outing, courses, lodging?.id).stayBooked ? outing.lodgingBooking?.reference ?? "" : "",
  );
  const readiness = tripReadiness(outing, courses, lodging?.id);
  const confirmed = datesAreConfirmed(outing);
  const progress = bookingProgress(outing, courses, lodging?.id);
  const mode = outing.planningMode ?? "group";
  function save(input: Parameters<typeof updatePlanningSetup>[1]) {
    setError("");
    startTransition(async () => {
      try {
        await updatePlanningSetup(outing.id, input);
        setIndex(0);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save");
      }
    });
  }
  return (
    <section
      className="mt-5 rounded-2xl border border-charcoal/10 bg-white p-5"
      aria-label="Planning and booking progress"
    >
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className="text-lg font-semibold">{editable ? "Your next steps" : "Booking progress"}</h2>
        {editable && (
          <label className="text-sm">
            Planning approach{" "}
            <select
              aria-label="Planning approach"
              disabled={pending}
              value={mode}
              onChange={(e) =>
                save({
                  kind: "mode",
                  mode: e.target.value as "organizer" | "group",
                })
              }
              className="ml-2 rounded-lg border p-2"
            >
              <option value="organizer">I’ll plan it</option>
              <option value="group">Ask the group first</option>
            </select>
          </label>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-forest-900">{readiness.label}{readiness.itineraryReady && !readiness.bookingsComplete ? " · Reservations still to finish" : ""}</p>
      {editable && (
        <p className="mt-2 text-sm text-charcoal/65">
          {mode === "organizer"
            ? "Build your days below. Share the itinerary whenever you’re ready."
            : "Collect dates and budgets from the group, then confirm dates and build your days."}{" "}
          {mode === "group" && (
            <a className="underline" href="#invite-group">
              Invite the group
            </a>
          )}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-cream p-4">
          <h3 className="font-semibold">
            {confirmed ? "✓ Dates confirmed" : editable ? "1. Confirm your dates" : "Dates proposed"}
          </h3>
          <p className="mt-2 text-sm">
            {confirmed
              ? "Your itinerary uses these confirmed dates."
              : "Dates are proposed. The itinerary is a draft using the first option."}
          </p>
          {editable && !confirmed ? (
            <div className="mt-3 space-y-2">
              <select
                aria-label="Trip date option"
                value={index}
                disabled={pending}
                onChange={(e) => setIndex(Number(e.target.value))}
                className="w-full rounded-lg border bg-white p-2 text-sm"
              >
                {outing.preferredDateWindows.map((w, i) => (
                  <option key={`${w.start}-${w.end}`} value={i}>
                    {tripDayLabel(w.start, 1)} – {tripDayLabel(w.end, 1)}
                  </option>
                ))}
              </select>
              {index > 0 && (
                <p className="text-xs text-amber-800">
                  Rounds stay on their day numbers. Entered tee times and hotel
                  bookings keep their original dates and must be checked again.
                </p>
              )}
              <button
                disabled={pending}
                onClick={() => save({ kind: "dates", index, confirm: true })}
                className="rounded-full bg-forest-900 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Confirm dates
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm">
              {tripDayLabel(outing.preferredDateWindows[0]?.start, 1)} –{" "}
              {tripDayLabel(outing.preferredDateWindows[0]?.end, 1)}
            </p>
          )}
          {editable && confirmed && (
            <button
              disabled={pending}
              onClick={() => save({ kind: "dates", index: 0, confirm: false })}
              className="mt-2 text-sm underline"
            >
              Reopen date choice
            </button>
          )}
        </div>
        <div className="rounded-xl bg-cream p-4">
          <h3 className="font-semibold">
            {progress.total > 0 && !progress.remaining
              ? "✓ Tee times entered"
              : editable ? "2. Book your rounds" : "Tee time reservations"}
          </h3>
          <p className="mt-2 text-sm">
            {progress.rounds
              ? `${progress.filled} of ${progress.total} golfer places entered across ${progress.rounds} rounds.`
              : editable ? "Add your first round to start the schedule." : "The organizer is choosing the rounds."}
          </p>
          {progress.remaining > 0 && (
            <p className="mt-2 text-sm">
              {progress.remaining} places still need tee times.
            </p>
          )}
          {progress.undated > 0 && (
            <p className="mt-2 text-xs text-amber-800">
              {progress.undated} rounds need a date.
            </p>
          )}
          {progress.unmatched > 0 && (
            <p className="mt-2 text-xs text-amber-800">
              {progress.unmatched} tee-time entries don’t match this itinerary.
              Review them before booking anything else.
            </p>
          )}
          <p className="mt-2 text-xs text-charcoal/60">
            {editable ? "Enter reservations after booking directly with each course." : "The organizer will update these after booking with each course."}
          </p>
        </div>
        <div className="rounded-xl bg-cream p-4">
          <h3 className="font-semibold">
            {outing.golfOnly
              ? "Stay not needed"
              : progress.stayBooked
                ? "✓ Stay booking recorded"
                : editable ? "3. Confirm your stay" : "Lodging reservation"}
          </h3>
          {!outing.golfOnly && (
            <>
              <p className="mt-2 text-sm">
                {lodging?.name ?? "Choose a place to stay."}
              </p>
              {lodging && (
                <p className="mt-2 text-xs text-charcoal/65">
                  {progress.stayBooked
                    ? `Booked for these dates${outing.lodgingBooking?.reference ? ` · ${outing.lodgingBooking.reference}` : ""}.`
                    : "Selected in the plan. Booking has not been recorded for these dates."}
                </p>
              )}
              {editable && lodging && (
                <div className="mt-3">
                  {!progress.stayBooked && (
                    <input
                      aria-label="Lodging confirmation reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Confirmation reference (optional)"
                      maxLength={120}
                      className="mb-2 w-full rounded-lg border bg-white p-2 text-sm"
                    />
                  )}
                  <button
                    disabled={pending}
                    onClick={() =>
                      save({
                        kind: "lodging",
                        booked: !progress.stayBooked,
                        reference,
                      })
                    }
                    className="rounded-full border border-forest-900/30 px-3 py-2 text-sm"
                  >
                    {progress.stayBooked
                      ? "Mark booking unconfirmed"
                      : "I’ve booked this stay"}
                  </button>
                  <p className="mt-2 text-xs text-charcoal/60">
                    This records your booking; it does not make a reservation.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
