import type { GolfCourseOption } from "@/types/domain";

export function tripDayCount(start?: string | null, end?: string | null) {
  if (!start || !end) return 4;
  return Math.max(
    1,
    Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1,
  );
}
export function tripDate(start: string | null | undefined, day: number) {
  if (!start) return "";
  const date = new Date(`${start}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + day - 1);
  return date.toISOString().slice(0, 10);
}
export function tripDayLabel(start: string | null | undefined, day: number) {
  const date = tripDate(start, day);
  return date
    ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : `Day ${day}`;
}
export function courseRoundDays(
  course: Pick<
    GolfCourseOption,
    "roundDays" | "scheduleDay" | "scheduleRounds"
  >,
): (number | null)[] {
  return (
    course.roundDays ??
    Array.from(
      { length: Math.max(1, course.scheduleRounds ?? 1) },
      () => course.scheduleDay ?? null,
    )
  );
}
export function lodgingCost(
  rate: number,
  nights: number,
  players: number,
  occupancy: number,
) {
  const rooms = Math.ceil(Math.max(1, players) / Math.max(1, occupancy));
  return { rooms, perPerson: (rate * nights * rooms) / Math.max(1, players) };
}
export function tripCosts(
  courses: GolfCourseOption[],
  rate: number | null,
  nights: number,
  players: number,
  occupancy: number,
  golfOnly: boolean,
) {
  const selected = courses.filter((c) => c.featured && !c.hidden);
  const rounds = selected.reduce((n, c) => n + courseRoundDays(c).length, 0);
  const missingPrices = selected
    .filter((c) => c.averageGreensFee <= 0)
    .reduce((n, c) => n + courseRoundDays(c).length, 0);
  const golf = selected.reduce(
    (n, c) => n + Math.max(0, c.averageGreensFee) * courseRoundDays(c).length,
    0,
  );
  const lodging =
    golfOnly || !rate
      ? 0
      : lodgingCost(rate, nights, players, occupancy).perPerson;
  return {
    rounds,
    missingPrices,
    golf,
    lodging,
    total: golf + lodging,
    incomplete: !rounds || missingPrices > 0 || (!golfOnly && !rate),
  };
}

export function datesAreConfirmed(
  outing: Pick<
    import("@/types/domain").Outing,
    "preferredDateWindows" | "confirmedDateWindow"
  >,
) {
  const date = outing.preferredDateWindows[0];
  return Boolean(
    date &&
      outing.confirmedDateWindow?.start === date.start &&
      outing.confirmedDateWindow?.end === date.end,
  );
}

export function bookingProgress(
  outing: import("@/types/domain").Outing,
  courses: GolfCourseOption[],
  lodgingId?: string,
) {
  const window = outing.preferredDateWindows[0];
  const groups = new Map<string, number>();
  let rounds = 0;
  let undated = 0;
  for (const course of courses.filter((c) => c.featured && !c.hidden)) {
    for (const day of courseRoundDays(course)) {
      rounds++;
      if (!day || day > tripDayCount(window?.start, window?.end) || !window) {
        undated++;
        continue;
      }
      const key = `${course.name}|${tripDate(window.start, day)}`;
      groups.set(key, (groups.get(key) ?? 0) + outing.numberOfPlayers);
    }
  }
  let filled = 0;
  for (const [key, needed] of groups)
    filled += Math.min(
      needed,
      outing.teeTimeBookings
        .filter((b) => `${b.courseName}|${b.date}` === key)
        .reduce((n, b) => n + Math.max(0, b.players), 0),
    );
  const unmatched = outing.teeTimeBookings.filter(
    (b) => !groups.has(`${b.courseName}|${b.date}`),
  ).length;
  const total = rounds * outing.numberOfPlayers;
  const stayBooked = Boolean(
    lodgingId &&
      outing.lodgingBooking?.lodgingId === lodgingId &&
      outing.lodgingBooking.start === window?.start &&
      outing.lodgingBooking.end === window?.end,
  );
  return {
    rounds,
    undated,
    filled,
    total,
    remaining: Math.max(0, total - filled),
    unmatched,
    stayBooked,
  };
}
