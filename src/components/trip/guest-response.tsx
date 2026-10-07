"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveGuestResponse } from "@/lib/actions/guest-response";
import { responseLabel } from "@/lib/guest-response";
import { datesAreConfirmed, tripDayLabel } from "@/lib/trip-plan";
import type { Outing, PreferenceSubmission, RsvpStatus } from "@/types/domain";

export function GuestResponse({
  outing,
  preference,
  organizerName,
}: {
  outing: Outing;
  preference: PreferenceSubmission | null;
  organizerName: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(!preference?.responseStatus);
  const [status, setStatus] = useState<RsvpStatus | "">(
    preference?.responseStatus ?? "",
  );
  const [dates, setDates] = useState(preference?.availableDates ?? []);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const confirmed = datesAreConfirmed(outing);
  const window = outing.preferredDateWindows[0];
  function submit(form: FormData) {
    setError("");
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await saveGuestResponse(outing.id, {
          responseStatus: status,
          availableDates: dates,
          budgetMin: Number(
            form.get("budgetMin") ??
              preference?.budgetMin ??
              outing.budgetTarget,
          ),
          budgetMax: Number(
            form.get("budgetMax") ??
              preference?.budgetMax ??
              outing.budgetTarget,
          ),
          comments: String(form.get("comments") ?? ""),
          walkingPreference: String(
            form.get("walkingPreference") ??
              preference?.walkingPreference ??
              "either",
          ),
          preferredRounds: form.has("preferredRounds")
            ? form.get("preferredRounds")
              ? Number(form.get("preferredRounds"))
              : null
            : (preference?.preferredRounds ?? null),
          lodgingPreferences: form.has("lodgingPreferences")
            ? [String(form.get("lodgingPreferences"))].filter(Boolean)
            : (preference?.lodgingPreferences ?? []),
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        setEditing(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Please try again.");
      }
    });
  }
  return (
    <section
      id="response"
      className="scroll-mt-6 rounded-[28px] border border-forest-900/15 bg-white p-5 sm:p-6"
    >
      <p className="text-xs uppercase tracking-widest text-forest-900/60">
        Your response
      </p>
      <h2 className="mt-2 font-serif text-2xl">
        {editing ? "Can you make it?" : responseLabel(preference)}
      </h2>
      {confirmed && window && (
        <p className="mt-2 text-sm">
          Dates confirmed · {tripDayLabel(window.start, 1)} –{" "}
          {tripDayLabel(window.end, 1)}, {window.end.slice(0, 4)}
        </p>
      )}
      {saved && (
        <p
          role="status"
          className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"
        >
          Your response is saved. {organizerName} can see{" "}
          {status === "declined"
            ? "that you can't make it"
            : status === "maybe"
              ? "that you're a maybe"
              : "that you're in"}
          . You can change it anytime.
        </p>
      )}
      {!editing ? (
        <div className="mt-3 space-y-3">
          {preference?.responseStatus === "declined" ? (
            <p className="text-sm text-charcoal/65">
              You can still follow the plan. Let the group know if your
              availability changes.
            </p>
          ) : (
            <p className="text-sm text-charcoal/65">
              {preference?.availableDates.length
                ? `Available: ${preference.availableDates.map((d) => tripDayLabel(d, 1)).join(" · ")}. `
                : "No availability confirmed yet. "}
              {outing.votingOpen
                ? "The group vote is open below."
                : `${organizerName} is coordinating the next steps. Check back here for updates.`}
            </p>
          )}
          <button
            className="text-sm underline"
            onClick={() => {
              setEditing(true);
              setSaved(false);
            }}
          >
            Change your response
          </button>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(new FormData(event.currentTarget));
          }}
          className="mt-4 space-y-5"
        >
          <fieldset>
            <legend className="sr-only">RSVP</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["in", "I'm in"],
                  ["maybe", "Maybe"],
                  ["declined", "Can't make it"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${status === value ? "border-forest-900 bg-forest-900/5" : "border-charcoal/15"}`}
                >
                  <input
                    type="radio"
                    name="responseStatus"
                    value={value}
                    checked={status === value}
                    required
                    onChange={() => setStatus(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          {status !== "declined" &&
            !confirmed &&
            outing.preferredDateWindows.length > 0 && (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  Which weekends work?
                </legend>
                <div className="space-y-2">
                  {outing.preferredDateWindows.map((w) => (
                    <label
                      key={w.start}
                      className="flex items-center gap-3 rounded-xl border p-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={dates.includes(w.start)}
                        onChange={(e) =>
                          setDates(
                            e.target.checked
                              ? [...dates, w.start]
                              : dates.filter((d) => d !== w.start),
                          )
                        }
                      />
                      {tripDayLabel(w.start, 1)} – {tripDayLabel(w.end, 1)},{" "}
                      {w.end.slice(0, 4)}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-charcoal/60">
                  Not sure yet? Choose Maybe. If none work, choose Can&apos;t
                  make it and suggest another weekend below.
                </p>
              </fieldset>
            )}
          {status !== "declined" && outing.planningMode !== "organizer" && (
            <fieldset>
              <legend className="text-sm font-semibold">
                Comfortable budget per person
              </legend>
              <p className="mt-1 text-xs text-charcoal/60">
                {outing.golfOnly ? "Golf" : "Golf and lodging"} only. Travel,
                meals, taxes, and extra fees are separate. The organizer can see
                your response.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {["Min", "Max"].map((label) => (
                  <label key={label} className="text-sm">
                    {label} ($)
                    <input
                      name={`budget${label}`}
                      type="number"
                      min="0"
                      max="100000"
                      required
                      defaultValue={
                        label === "Min"
                          ? (preference?.budgetMin ??
                            Math.max(0, outing.budgetTarget - 200))
                          : (preference?.budgetMax ?? outing.budgetTarget)
                      }
                      className="mt-1 w-full rounded-xl border p-3"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <label className="block text-sm">
            Note for the group{" "}
            <span className="text-charcoal/50">(optional)</span>
            <textarea
              name="comments"
              defaultValue={preference?.comments ?? ""}
              maxLength={2000}
              rows={2}
              placeholder="Another weekend, travel plans, or anything the organizer should know"
              className="mt-2 w-full rounded-xl border p-3"
            />
          </label>
          {status !== "declined" && (
            <details>
              <summary className="cursor-pointer text-sm font-medium">
                Optional golf & stay preferences
              </summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="text-sm">
                  Walking or riding
                  <select
                    name="walkingPreference"
                    defaultValue={preference?.walkingPreference ?? "either"}
                    className="mt-1 w-full rounded-xl border p-3"
                  >
                    <option value="either">Either is fine</option>
                    <option value="walking">Prefer walking</option>
                    <option value="riding">Prefer riding</option>
                  </select>
                </label>
                <label className="text-sm">
                  Rounds
                  <select
                    name="preferredRounds"
                    defaultValue={preference?.preferredRounds ?? ""}
                    className="mt-1 w-full rounded-xl border p-3"
                  >
                    <option value="">No preference</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "round" : "rounds"}
                      </option>
                    ))}
                  </select>
                </label>
                {!outing.golfOnly && (
                  <label className="text-sm">
                    Stay
                    <select
                      name="lodgingPreferences"
                      defaultValue={preference?.lodgingPreferences[0] ?? ""}
                      className="mt-1 w-full rounded-xl border p-3"
                    >
                      <option value="">No preference</option>
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                      <option value="house">House</option>
                    </select>
                  </label>
                )}
              </div>
            </details>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <button
              disabled={pending}
              className="rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save response"}
            </button>
            <a href="#itinerary" className="text-sm underline">
              View the trip first
            </a>
          </div>
        </form>
      )}
    </section>
  );
}
