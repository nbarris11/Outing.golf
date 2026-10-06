"use client";

import { usePersonsPerRoom } from "./persons-per-room-context";
import { lodgingCost } from "@/lib/trip-plan";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

interface LodgingRoomRateProps {
  nightlyRate: number;
  nights: number;
  players?: number;
}

export function LodgingRoomRate({
  nightlyRate,
  nights,
  players = 4,
}: LodgingRoomRateProps) {
  const { personsPerRoom, setPersonsPerRoom, pending, canEdit } =
    usePersonsPerRoom();

  const { rooms, perPerson: totalPerPerson } = lodgingCost(
    nightlyRate,
    nights,
    players,
    personsPerRoom,
  );
  const perPersonPerNight = nights ? totalPerPerson / nights : 0;

  return (
    <div className="text-right shrink-0">
      <div className="flex items-baseline justify-end gap-1.5">
        <p className="font-semibold text-charcoal">
          {fmt(perPersonPerNight)}
          <span className="ml-1 text-xs font-normal text-charcoal/50">
            /person/night
          </span>
        </p>
      </div>
      <p className="mt-0.5 text-xs text-charcoal/45">
        {rooms} rooms × {fmt(nightlyRate)}/night × {nights} nights ÷ {players}{" "}
        golfers = {fmt(totalPerPerson)}/person
      </p>
      <div className="mt-1.5 flex items-center justify-end gap-1.5">
        <span className="text-xs text-charcoal/45">Persons/room:</span>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(8, players) }, (_, i) => i + 1).map(
            (n) => (
              <button
                key={n}
                type="button"
                disabled={pending || !canEdit}
                aria-label={`${n} people per room`}
                aria-pressed={personsPerRoom === n}
                onClick={() => setPersonsPerRoom(n)}
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  personsPerRoom === n
                    ? "bg-forest-900 text-cream"
                    : "bg-charcoal/8 text-charcoal/60 hover:bg-charcoal/15",
                ].join(" ")}
              >
                {n}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
