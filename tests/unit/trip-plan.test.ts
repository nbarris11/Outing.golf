import { describe, it, expect } from "vitest";
import {
  courseRoundDays,
  tripDayCount,
  tripDate,
  tripCosts,
  lodgingCost,
} from "@/lib/trip-plan";
import type { GolfCourseOption } from "@/types/domain";
const course = (values: Partial<GolfCourseOption> = {}) =>
  ({
    id: "course",
    featured: true,
    hidden: false,
    averageGreensFee: 100,
    scheduleDay: 2,
    scheduleRounds: 2,
    ...values,
  }) as GolfCourseOption;
describe("trip planning", () => {
  it("includes arrival and departure across DST", () => {
    expect(tripDayCount("2027-03-12", "2027-03-15")).toBe(4);
    expect(tripDate("2027-03-12", 4)).toBe("2027-03-15");
  });
  it("includes a same-day trip", () =>
    expect(tripDayCount("2027-03-12", "2027-03-12")).toBe(1));
  it("preserves existing repeated rounds", () =>
    expect(courseRoundDays(course())).toEqual([2, 2]));
  it("keeps individual round dates and unscheduled rounds", () =>
    expect(courseRoundDays(course({ roundDays: [2, 4, null] }))).toEqual([
      2,
      4,
      null,
    ]));
  it("does not resurrect removed rounds", () =>
    expect(courseRoundDays(course({ roundDays: [] }))).toEqual([]));
  it("rounds rooms up for an uneven group", () =>
    expect(lodgingCost(200, 3, 7, 2)).toEqual({
      rooms: 4,
      perPerson: 2400 / 7,
    }));
  it("uses saved occupancy for lodging", () =>
    expect(tripCosts([course()], 200, 3, 8, 4, false).total).toBe(350));
  it("flags unknown rates without pretending golf is free", () => {
    const cost = tripCosts(
      [course({ averageGreensFee: 0 })],
      200,
      3,
      8,
      2,
      false,
    );
    expect(cost.missingPrices).toBe(2);
    expect(cost.incomplete).toBe(true);
  });
  it("excludes unselected and hidden candidates", () =>
    expect(
      tripCosts(
        [course({ featured: false }), course({ hidden: true })],
        null,
        3,
        8,
        2,
        true,
      ).rounds,
    ).toBe(0));
  it("does not add an unselected stay", () => {
    const cost = tripCosts([course()], null, 3, 8, 2, false);
    expect(cost.total).toBe(200);
    expect(cost.incomplete).toBe(true);
  });
  it("golf-only needs no lodging price", () =>
    expect(tripCosts([course()], null, 3, 8, 2, true).incomplete).toBe(false));
});

import { bookingProgress, datesAreConfirmed } from "@/lib/trip-plan";
import type { Outing } from "@/types/domain";
const planningTrip = (values: Partial<Outing> = {}) =>
  ({
    preferredDateWindows: [{ start: "2027-03-12", end: "2027-03-15" }],
    numberOfPlayers: 8,
    teeTimeBookings: [],
    ...values,
  }) as Outing;
describe("planning confirmations", () => {
  it("requires an explicit matching date confirmation", () => {
    expect(datesAreConfirmed(planningTrip())).toBe(false);
    expect(
      datesAreConfirmed(
        planningTrip({
          confirmedDateWindow: { start: "2027-03-12", end: "2027-03-15" },
        }),
      ),
    ).toBe(true);
    expect(
      datesAreConfirmed(
        planningTrip({
          confirmedDateWindow: { start: "2027-04-12", end: "2027-04-15" },
        }),
      ),
    ).toBe(false);
  });
  it("counts partial groups and caps surplus spots for one round", () => {
    const trip = planningTrip({
      teeTimeBookings: [
        {
          id: "b",
          courseName: "TPC",
          date: "2027-03-13",
          teeTime: "09:00",
          players: 4,
        },
      ],
    });
    expect(
      bookingProgress(trip, [course({ name: "TPC", roundDays: [2, 3] })]),
    ).toMatchObject({ filled: 4, total: 16, remaining: 12 });
    trip.teeTimeBookings[0].players = 20;
    expect(
      bookingProgress(trip, [course({ name: "TPC", roundDays: [2, 3] })])
        .filled,
    ).toBe(8);
  });
  it("requires enough places for repeated rounds on the same day", () => {
    const trip = planningTrip({
      teeTimeBookings: [
        {
          id: "b",
          courseName: "TPC",
          date: "2027-03-13",
          teeTime: "09:00",
          players: 8,
        },
      ],
    });
    expect(
      bookingProgress(trip, [course({ name: "TPC", roundDays: [2, 2] })]),
    ).toMatchObject({ filled: 8, total: 16, remaining: 8 });
  });
  it("flags orphan reservations and undated rounds", () => {
    const trip = planningTrip({
      teeTimeBookings: [
        {
          id: "b",
          courseName: "TPC",
          date: "2027-04-13",
          teeTime: "09:00",
          players: 8,
        },
      ],
    });
    expect(
      bookingProgress(trip, [course({ name: "TPC", roundDays: [null, 5] })]),
    ).toMatchObject({ unmatched: 1, undated: 2, filled: 0 });
  });
  it("invalidates hotel confirmation when hotel or dates change", () => {
    const trip = planningTrip({
      lodgingBooking: {
        lodgingId: "stay",
        start: "2027-03-12",
        end: "2027-03-15",
      },
    });
    expect(bookingProgress(trip, [], "stay").stayBooked).toBe(true);
    expect(bookingProgress(trip, [], "another").stayBooked).toBe(false);
    trip.preferredDateWindows = [{ start: "2027-03-13", end: "2027-03-16" }];
    expect(bookingProgress(trip, [], "stay").stayBooked).toBe(false);
  });
});
