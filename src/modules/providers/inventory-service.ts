import type { Outing } from "@/types/domain";

import { getInventoryProviders } from "./registry";

// Central inventory orchestration. The rest of the app consumes normalized option shapes
// and should not care whether the upstream data came from mock feeds, Google Places,
// Expedia Rapid, GolfNow, Vrbo-compatible rentals, or any other official partner later.
export async function fetchOutingInventory(outing: Outing) {
  const providers = getInventoryProviders();
  const destinations = await providers.destinationSearch.searchDestinations({
    outing,
    query: outing.destinationLabel,
    limit: 8
  });
  const golfCourses = await providers.golfCourse.searchCourses({
    outing,
    destinations,
    limitPerDestination: 4
  });
  const lodging = await providers.lodging.searchLodging({
    outing,
    destinations,
    preferredType: outing.lodgingPreference,
    guests: outing.numberOfPlayers,
    limitPerDestination: 4
  });
  const teeTimes = await providers.teeTime.searchTeeTimes({
    outing,
    golfCourses,
    preferredDates: outing.preferredDateWindows.flatMap((window) => [window.start, window.end]),
    players: outing.numberOfPlayers
  });
  const vacationRentals = await providers.vacationRental.searchVacationRentals({
    outing,
    destinations,
    guests: outing.numberOfPlayers
  });

  return {
    providers,
    destinations,
    golfCourses,
    lodging,
    teeTimes,
    vacationRentals
  };
}
