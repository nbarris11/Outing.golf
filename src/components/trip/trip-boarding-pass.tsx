interface Props {
  outingName: string;
  destination: string;
  startDate: string;
  endDate: string;
  courses: Array<{ name: string; scheduleDay?: number | null; dayLabel?: string | null }>;
  lodgingName: string | null;
  playerCount: number;
  memberNames: string[];
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sMonth = s.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const eMonth = e.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const sDay = s.getUTCDate();
  const eDay = e.getUTCDate();

  if (sMonth === eMonth) {
    return `${sMonth} ${sDay} – ${eDay}`;
  }

  return `${sMonth} ${sDay} – ${eMonth} ${eDay}`;
}

function MemberRoster({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  const shown = names.slice(0, 4);
  const extra = names.length - 4;

  return (
    <span className="text-forest-900/70 text-sm">
      {shown.join(", ")}
      {extra > 0 && ` +${extra} more`}
    </span>
  );
}

export function TripBoardingPass({
  outingName,
  destination,
  startDate,
  endDate,
  courses,
  lodgingName,
  playerCount,
  memberNames
}: Props) {
  const dateRange = startDate && endDate ? formatDateRange(startDate, endDate) : startDate ? formatShortDate(startDate) : "TBD";

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-cream border border-charcoal/10 shadow-[0_8px_40px_rgba(20,58,44,0.10)]">
      {/* Dashed perforations on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-1 border-r border-dashed border-charcoal/15 hidden sm:block" style={{ left: "220px" }} />
      <div className="absolute right-0 top-0 bottom-0 w-1 border-l border-dashed border-charcoal/15 hidden sm:block" style={{ right: "80px" }} />

      <div className="flex flex-col sm:flex-row">
        {/* Left section: Brand + trip name */}
        <div className="flex flex-col justify-center p-6 sm:w-52 sm:shrink-0 sm:border-r sm:border-dashed sm:border-charcoal/15">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-forest-900/40">
            OUTING.GOLF
          </span>
          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-[-0.03em] text-forest-900">
            {outingName}
          </h2>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-forest-800 bg-forest-900/8 px-2 py-0.5 rounded-full w-fit">
            ✓ Booked
          </span>
        </div>

        {/* Middle section: Trip details */}
        <div className="flex-1 p-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/35">
              To
            </p>
            <p className="mt-1 text-xl font-bold text-forest-900 leading-tight">
              {destination}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/35">
              Date
            </p>
            <p className="mt-1 text-base font-semibold text-forest-900">
              {dateRange}
            </p>
          </div>

          <div>
            {(() => {
              const scheduledCourses = courses.filter((c) => c.scheduleDay != null);
              const showMultiple = scheduledCourses.length > 1;
              return (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/35">
                    {showMultiple ? "Rounds" : "Course"}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {showMultiple ? (
                      scheduledCourses
                        .sort((a, b) => (a.scheduleDay ?? 0) - (b.scheduleDay ?? 0))
                        .map((c) => (
                          <p key={c.name} className="text-sm font-medium text-forest-900 leading-snug">
                            Day {c.scheduleDay} · {c.name}
                          </p>
                        ))
                    ) : (
                      <p className="text-sm font-medium text-forest-900 leading-snug">
                        {courses[0]?.name ?? "TBD"}
                      </p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/35">
              Stay
            </p>
            <p className="mt-1 text-sm font-medium text-forest-900 leading-snug">
              {lodgingName ?? "TBD"}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/35">
              Roster
            </p>
            <div className="mt-1">
              <MemberRoster names={memberNames} />
            </div>
          </div>
        </div>

        {/* Right section: PAX + rotated label */}
        <div className="hidden sm:flex flex-col items-center justify-center w-20 shrink-0 border-l border-dashed border-charcoal/15 gap-2 py-6">
          <span className="text-2xl font-bold text-forest-900">{playerCount}</span>
          <span className="text-[9px] text-charcoal/40 uppercase tracking-widest">PAX</span>
          <div
            className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-forest-900/30"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Golf Trip
          </div>
        </div>
      </div>

      {/* Subtle golf ball texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #143a2c 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
    </div>
  );
}
