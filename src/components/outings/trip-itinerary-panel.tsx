import type { GolfCourseOption, LodgingOption } from "@/types/domain";

interface Props {
  outingId: string;
  isOrganizer: boolean;
  nights: number;
  tripStart: string | null;
  selectedCourses: GolfCourseOption[];
  selectedLodging: LodgingOption | null;
  golfOnly: boolean;
  noGolfDays: number[];
  toggleNoGolfDayAction: (formData: FormData) => Promise<void>;
  currency: (n: number) => string;
}

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDayLabel(tripStart: string | null, dayIndex: number): string {
  if (!tripStart) return `Day ${dayIndex}`;
  const d = new Date(tripStart + "T00:00:00");
  d.setDate(d.getDate() + (dayIndex - 1));
  return `Day ${dayIndex} · ${DAY_ABBR[d.getDay()]}`;
}

export function TripItineraryPanel({
  outingId,
  isOrganizer,
  nights,
  tripStart,
  selectedCourses,
  selectedLodging,
  golfOnly,
  noGolfDays,
  toggleNoGolfDayAction,
  currency
}: Props) {
  const noGolfDaySet = new Set(noGolfDays);
  // Map each day number to all courses assigned to that day
  const courseByDay = new Map<number, GolfCourseOption[]>();
  selectedCourses.forEach((c) => {
    if (c.scheduleDay != null) {
      const arr = courseByDay.get(c.scheduleDay) ?? [];
      arr.push(c);
      courseByDay.set(c.scheduleDay, arr);
    }
  });
  const unscheduledPicks = selectedCourses.filter((c) => c.scheduleDay == null);

  // Are there any filled slots / picks at all? Empty panel stays compact.
  const hasAnyPick = selectedCourses.length > 0 || selectedLodging != null;
  const headerSuffix = hasAnyPick
    ? `${selectedCourses.length} course${selectedCourses.length !== 1 ? "s" : ""}${!golfOnly ? (selectedLodging ? " · hotel set" : " · hotel open") : ""}`
    : isOrganizer
      ? "Nothing picked yet"
      : "Waiting on the organizer's picks";

  return (
    <section className="mt-5 rounded-[28px] border border-forest-900/15 bg-[linear-gradient(135deg,#f6f1e4,#f7f4ee)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-charcoal/45">Your trip</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.02em] text-charcoal">
            {isOrganizer ? "Build your plan" : "The trip so far"}
          </h2>
          <p className="mt-0.5 text-sm text-charcoal/55">{headerSuffix}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {/* Day slots */}
        {Array.from({ length: nights }, (_, i) => i + 1).map((day) => {
          const courses = courseByDay.get(day) ?? [];
          const label = formatDayLabel(tripStart, day);
          const isNoGolf = noGolfDaySet.has(day);
          if (isNoGolf) {
            return (
              <div
                key={day}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[18px] border border-charcoal/10 bg-charcoal/4 px-4 py-3"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/45">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-charcoal/55">No golf this day</p>
                </div>
                {isOrganizer && (
                  <form action={toggleNoGolfDayAction}>
                    <input type="hidden" name="outingId" value={outingId} />
                    <input type="hidden" name="day" value={day} />
                    <button
                      type="submit"
                      className="rounded-full px-3 py-1 text-xs font-medium text-forest-900 hover:bg-forest-900/10 transition-colors"
                    >
                      ↩ Add golf back
                    </button>
                  </form>
                )}
              </div>
            );
          }
          if (courses.length > 0) {
            return (
              <div key={day} className="rounded-[18px] border border-emerald-200 bg-white/90 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700/80">{label}</p>
                {courses.map((course, idx) => {
                  const rounds = course.scheduleRounds ?? 1;
                  const cost = course.averageGreensFee * rounds;
                  return (
                    <div
                      key={course.id}
                      className={[
                        "flex flex-wrap items-center justify-between gap-2",
                        idx > 0 ? "mt-2 border-t border-emerald-100 pt-2" : "mt-0.5"
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-charcoal truncate">{course.name}</p>
                        <p className="text-xs text-charcoal/50">
                          {rounds} round{rounds !== 1 ? "s" : ""} · {currency(cost)}/person
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        ✓ In the trip
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          }
          return (
            <div
              key={day}
              className={[
                "flex flex-wrap items-center justify-between gap-2 rounded-[18px] border border-dashed px-4 py-3 transition-colors",
                isOrganizer
                  ? "border-forest-900/25 bg-white/50 hover:border-forest-900/50 hover:bg-white"
                  : "border-charcoal/15 bg-white/30"
              ].join(" ")}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/50">{label}</p>
                <a
                  href={isOrganizer ? "#courses" : undefined}
                  className="mt-0.5 inline-block text-sm font-medium text-charcoal/60 hover:text-forest-900"
                >
                  {isOrganizer ? "Pick a course →" : "Not picked yet"}
                </a>
              </div>
              {isOrganizer && (
                <form action={toggleNoGolfDayAction}>
                  <input type="hidden" name="outingId" value={outingId} />
                  <input type="hidden" name="day" value={day} />
                  <button
                    type="submit"
                    className="rounded-full border border-charcoal/15 bg-white px-2.5 py-1 text-xs font-medium text-charcoal/55 hover:border-charcoal/30 hover:text-charcoal transition-colors"
                    title="Mark this day as a rest / travel day with no golf"
                  >
                    No golf
                  </button>
                </form>
              )}
            </div>
          );
        })}

        {/* Featured courses with no day assigned yet */}
        {unscheduledPicks.length > 0 && (
          <div className="mt-1 rounded-[18px] border border-amber-200 bg-amber-50/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-800">Not scheduled yet</p>
            <ul className="mt-1 space-y-0.5 text-sm text-amber-900">
              {unscheduledPicks.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{c.name}</span>
                  {isOrganizer && (
                    <a href="#courses" className="shrink-0 text-xs font-semibold underline underline-offset-2 hover:no-underline">
                      Assign day →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hotel slot */}
        {!golfOnly && (
          selectedLodging ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-[18px] border border-emerald-200 bg-white/90 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700/80">Hotel · {nights} night{nights !== 1 ? "s" : ""}</p>
                <p className="mt-0.5 font-semibold text-charcoal truncate">{selectedLodging.name}</p>
                <p className="text-xs text-charcoal/50">
                  {currency(selectedLodging.nightlyRate)}/night
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                ✓ In the trip
              </span>
            </div>
          ) : (
            <a
              href={isOrganizer ? "#lodging" : undefined}
              className={[
                "mt-2 flex flex-wrap items-center justify-between gap-2 rounded-[18px] border border-dashed px-4 py-3 transition-colors",
                isOrganizer
                  ? "border-forest-900/25 bg-white/50 hover:border-forest-900/50 hover:bg-white"
                  : "border-charcoal/15 bg-white/30"
              ].join(" ")}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/50">Hotel · {nights} night{nights !== 1 ? "s" : ""}</p>
                <p className="mt-0.5 text-sm font-medium text-charcoal/60">
                  {isOrganizer ? "Pick a hotel →" : "Not picked yet"}
                </p>
              </div>
            </a>
          )
        )}
      </div>
    </section>
  );
}
