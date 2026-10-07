"use client";
import { CourseAccessLabel } from "./course-access-label";
import { courseAccess, courseAccessPriority, discoverableCourse } from "@/lib/course-access";
import { useEffect, useRef, useState, useTransition } from "react";
import type {
  GolfCourseOption,
  LodgingOption,
  TeeTimeBooking,
} from "@/types/domain";
import { courseRoundDays, tripDate, tripDayLabel } from "@/lib/trip-plan";
import { editTripRound } from "@/lib/actions/trip-plan";
import { CoursePriceEditor } from "./course-price-editor";
import { TeeTimeManager } from "./tee-time-manager";
import { addTeeTimeAction, deleteTeeTimeAction } from "@/lib/actions/outings";
import { CoursePreview } from "./course-preview";

interface Props {
  outingId: string;
  isOrganizer: boolean;
  nights: number;
  dayCount: number;
  tripStart: string | null;
  selectedCourses: GolfCourseOption[];
  courses: GolfCourseOption[];
  selectedLodging: LodgingOption | null;
  golfOnly: boolean;
  noGolfDays: number[];
  bookings: TeeTimeBooking[];
  players: number;
  toggleNoGolfDayAction: (formData: FormData) => Promise<void>;
  readOnly?: boolean;
}
export function TripItineraryPanel({
  outingId,
  isOrganizer,
  nights,
  dayCount,
  tripStart,
  selectedCourses,
  courses,
  selectedLodging,
  golfOnly,
  noGolfDays,
  bookings,
  players,
  toggleNoGolfDayAction,
  readOnly = false,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pickerDay, setPickerDay] = useState<number | null>(null);
  useEffect(() => {
    if (pickerDay !== null) dialog.current?.showModal();
  }, [pickerDay]);
  const [showRestricted, setShowRestricted] = useState(false);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const editable = isOrganizer && !readOnly;
  const rounds = selectedCourses.flatMap((course) =>
    courseRoundDays(course).map((day, index) => ({ course, day, index })),
  );
  const unscheduled = rounds.filter((r) => !r.day || r.day > dayCount);
  const matched = courses.filter(c => discoverableCourse(c) && (showRestricted || courseAccess(c).kind !== "restricted")).sort((a,b) => courseAccessPriority(a) - courseAccessPriority(b)).filter((c) =>
    `${c.name} ${c.locationLabel} ${c.summary}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const currentPreview = matched.find((c) => c.id === preview) ?? matched[0];
  function change(
    course: string,
    operation: "add" | "move" | "remove",
    index: number,
    day: number | null,
  ) {
    setError("");
    startTransition(async () => {
      try {
        await editTripRound(outingId, course, operation, index, day);
        if (operation === "add") setPickerDay(null);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not save. Please try again.",
        );
      }
    });
  }
  const bookingGroups = new Map<string, number>();
  rounds.forEach((r) => {
    if (r.day) {
      const key = `${r.course.name}|${tripDate(tripStart, r.day)}`;
      bookingGroups.set(key, (bookingGroups.get(key) ?? 0) + 1);
    }
  });
  const bookedRounds = [...bookingGroups].reduce(
    (n, [key, count]) =>
      n +
      Math.min(
        count,
        Math.floor(
          bookings
            .filter((b) => `${b.courseName}|${b.date}` === key)
            .reduce((sum, b) => sum + b.players, 0) / players,
        ),
      ),
    0,
  );
  return (
    <section
      id="itinerary"
      className="mt-6 scroll-mt-24 rounded-[28px] border border-forest-900/15 bg-cream p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-forest-900/60">
            Your days, your trip
          </p>
          <h2 className="mt-1 font-serif text-3xl">
            {!editable ? "The itinerary" : "Build your days"}
          </h2>
          <p className="mt-2 text-sm text-charcoal/65">
            {dayCount} days · {rounds.length} rounds · {bookedRounds} with tee
            times for the group
            {!golfOnly &&
              ` · ${selectedLodging ? "Stay selected" : "Choose your stay"}`}
          </p>
        </div>
        {editable && (
          <a
            href="#lodging"
            className="rounded-full border border-forest-900/20 px-4 py-2 text-sm"
          >
            {golfOnly ? "Review costs" : "Choose your stay"} ↓
          </a>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="my-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => {
          const assigned = rounds.filter((r) => r.day === day);
          const rest = noGolfDays.includes(day) && !assigned.length;
          const date = tripDate(tripStart, day);
          return (
            <article
              key={day}
              className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-charcoal/45">
                    DAY {day}
                    {day === 1
                      ? " · ARRIVAL"
                      : day === dayCount
                        ? " · DEPARTURE"
                        : ""}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {tripDayLabel(tripStart, day)}
                  </h3>
                </div>
                <span className="text-xs text-forest-900/65">
                  {assigned.length
                    ? `${assigned.length} round${assigned.length === 1 ? "" : "s"}`
                    : rest
                      ? "Travel / free time"
                      : "Open day"}
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {assigned.map(({ course, index }) => {
                  const expectedSpots =
                    assigned.filter((r) => r.course.id === course.id).length *
                    players;
                  const teeTimes = bookings.filter(
                    (b) => b.courseName === course.name && b.date === date,
                  );
                  return (
                    <div
                      key={`${course.id}-${index}`}
                      className="rounded-xl bg-cream/70 p-3"
                    >
                      <h4 className="font-semibold">{course.name}</h4>
                      <CourseAccessLabel course={course} />
                      <p className="mt-1 text-xs text-charcoal/65">
                        {course.averageGreensFee > 0
                          ? `$${course.averageGreensFee}/person · estimate`
                          : "Price needed"}
                      </p>
                      {editable && (
                        <CoursePriceEditor
                          outingId={outingId}
                          courseId={course.id}
                          currentPrice={course.averageGreensFee}
                        />
                      )}
                      {teeTimes.length ? (
                        <p className="mt-2 text-sm text-emerald-800">
                          {teeTimes
                            .map((b) => `${b.teeTime} · ${b.players} golfers`)
                            .join(" / ")}
                          <span className="block text-xs text-charcoal/65">
                            {teeTimes.reduce((n, b) => n + b.players, 0)} of{" "}
                            {expectedSpots} places entered for this course today
                          </span>
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-amber-800">
                          Tee time not entered
                        </p>
                      )}
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-forest-900">
                          Photos, details & map
                        </summary>
                        <CoursePreview outingId={outingId} course={course} />
                      </details>
                      {editable && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
                          <label className="text-xs">
                            Move round{" "}
                            <select
                              aria-label={`Date for ${course.name} round ${index + 1}`}
                              value={day}
                              disabled={pending}
                              onChange={(e) =>
                                change(
                                  course.id,
                                  "move",
                                  index,
                                  Number(e.target.value),
                                )
                              }
                              className="max-w-full rounded-lg border p-2 text-xs"
                            >
                              {Array.from({ length: dayCount }, (_, j) => (
                                <option key={j} value={j + 1}>
                                  {tripDayLabel(tripStart, j + 1)}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button
                            disabled={pending}
                            onClick={() =>
                              change(course.id, "remove", index, null)
                            }
                            className="p-2 text-xs text-red-700"
                          >
                            Remove round
                          </button>
                        </div>
                      )}
                      {isOrganizer && <a
                        className="mt-2 inline-block text-xs font-medium underline"
                        href={`https://www.google.com/search?q=${encodeURIComponent(`${course.name} ${course.locationLabel} tee times ${date} ${players} players`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find tee times for {tripDayLabel(tripStart, day)} ↗
                      </a>}
                      {editable && (
                        <TeeTimeManager
                          outingId={outingId}
                          bookings={[]}
                          addAction={addTeeTimeAction}
                          deleteAction={deleteTeeTimeAction}
                          courseNames={[course.name]}
                          defaultDate={date}
                          defaultPlayers={Math.min(4, players)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {!assigned.length && (
                <p className="my-4 text-sm text-charcoal/60">
                  {rest
                    ? "Leave room for travel, exploring, or a slow morning."
                    : editable ? "Start with a course, or keep this day free." : "Free time — no golf scheduled."}
                </p>
              )}
              {editable && (
                <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                  <button
                    disabled={pending}
                    onClick={() => {
                      setPickerDay(day);
                      setQuery("");
                      setPreview(null);
                    }}
                    className="rounded-full bg-forest-900 px-4 py-2 text-sm text-cream"
                  >
                    + Add a round
                  </button>
                  {!assigned.length && (
                    <form action={toggleNoGolfDayAction}>
                      <input type="hidden" name="outingId" value={outingId} />
                      <input type="hidden" name="day" value={day} />
                      <button className="rounded-full border px-4 py-2 text-sm">
                        {rest ? "Reopen day" : "No golf"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      {unscheduled.length > 0 && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4">
          <h3 className="font-semibold">
            {editable ? "Choose dates for" : "Dates still to come for"} {unscheduled.length} rounds
          </h3>
          {unscheduled.map(({ course, index }) => (
            <div
              key={`${course.id}-${index}`}
              className="mt-2 flex flex-wrap justify-between gap-2 text-sm"
            >
              <span>
                {course.name} · Round {index + 1}
              </span>
              {editable && (
                <select
                  aria-label={`Schedule ${course.name} round ${index + 1}`}
                  value=""
                  disabled={pending}
                  onChange={(e) =>
                    change(course.id, "move", index, Number(e.target.value))
                  }
                  className="rounded-lg border p-2"
                >
                  <option value="">Choose a date</option>
                  {Array.from({ length: dayCount }, (_, j) => (
                    <option key={j} value={j + 1}>
                      {tripDayLabel(tripStart, j + 1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
      {!golfOnly && (
        <div className="mt-4 rounded-xl border border-charcoal/10 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-charcoal/50">
            Your stay · {nights} nights
          </p>
          <p className="mt-1 font-semibold">
            {selectedLodging?.name ?? "Stay to be decided"}
          </p>
          {selectedLodging?.thumbnailUrl && (
            <img
              src={selectedLodging.thumbnailUrl}
              alt={selectedLodging.name}
              className="mt-3 h-40 w-full rounded-xl object-cover"
              loading="lazy"
            />
          )}
          <p className="text-sm text-charcoal/60">
            {selectedLodging?.hotelAddress}
          </p>
          {editable && (
            <a href="#lodging" className="mt-2 inline-block text-sm underline">
              {selectedLodging ? "Change stay" : "Explore stays"}
            </a>
          )}
        </div>
      )}
      {pickerDay !== null && (
        <dialog
          ref={dialog}
          onCancel={() => setPickerDay(null)}
          aria-labelledby="course-picker-title"
          className="fixed inset-0 z-50 m-0 h-dvh w-screen max-w-none overflow-y-auto border-0 bg-cream p-4 sm:p-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-cream py-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-forest-900">
                  Add a round
                </p>
                <h3 id="course-picker-title" className="font-serif text-2xl">
                  {tripDayLabel(tripStart, pickerDay)}
                </h3>
              </div>
              <button
                autoFocus
                onClick={() => setPickerDay(null)}
                className="rounded-full border px-4 py-2"
              >
                Done
              </button>
            </div>
            <label className="block text-sm font-medium">
              Find a course
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search course name, location, or description"
                className="mt-2 w-full rounded-xl border bg-white p-3"
              />
            </label>
            {error && (
              <p role="alert" className="my-3 text-red-700">
                {error}
              </p>
            )}
            <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={showRestricted} onChange={e => setShowRestricted(e.target.checked)} />Include clubs with restricted access</label>
            <p className="mt-2 text-xs text-charcoal/60">Public courses appear first. Check visitor eligibility and tee-time availability before booking.</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                {matched.map((course) => (
                  <article
                    key={course.id}
                    className={`rounded-2xl border bg-white p-4 ${currentPreview?.id === course.id ? "border-forest-900" : "border-charcoal/10"}`}
                  >
                    <button
                      onClick={() => setPreview(course.id)}
                      className="text-left"
                    >
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="mt-1 text-sm text-charcoal/60">
                        {course.locationLabel}
                      </p>
                    </button>
                    <CourseAccessLabel course={course} />
                    <p className="mt-2 text-sm">
                      {course.averageGreensFee > 0
                        ? `$${course.averageGreensFee}/person · estimated`
                        : "Price needed · confirm with the course"}
                    </p>
                    <p className="mt-2 text-sm text-charcoal/65">
                      {course.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        disabled={pending}
                        onClick={() => change(course.id, "add", 0, pickerDay)}
                        className="rounded-full bg-forest-900 px-4 py-2 text-sm text-cream disabled:opacity-50"
                      >
                        {pending
                          ? "Saving…"
                          : `Add to ${tripDayLabel(tripStart, pickerDay)}`}
                      </button>
                      <button
                        onClick={() => setPreview(course.id)}
                        className="px-3 py-2 text-sm underline"
                      >
                        Photos, details & map
                      </button>
                    </div>
                    <div className="lg:hidden">
                      {preview === course.id && (
                        <CoursePreview outingId={outingId} course={course} />
                      )}
                    </div>
                  </article>
                ))}
                {!matched.length && (
                  <p className="p-5">
                    No matching courses. Try another name or add your own course
                    in the course options below.
                  </p>
                )}
              </div>
              <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
                {currentPreview && (
                  <CoursePreview
                    key={currentPreview.id}
                    outingId={outingId}
                    course={currentPreview}
                  />
                )}
              </aside>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
