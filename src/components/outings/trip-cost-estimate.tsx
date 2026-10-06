"use client";
import { usePersonsPerRoom } from "./persons-per-room-context";
import { lodgingCost } from "@/lib/trip-plan";
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
interface Props {
  golfPerPerson: number;
  lodgingNightlyRate: number;
  nights: number;
  golfLabel: string;
  golfRoundsLabel: string;
  golfOnly?: boolean;
  players?: number;
  missingPrices?: number;
  hasCourses?: boolean;
  compact?: boolean;
}
export function TripCostEstimate({
  golfPerPerson,
  lodgingNightlyRate,
  nights,
  golfLabel,
  golfRoundsLabel,
  golfOnly = false,
  players = 4,
  missingPrices = 0,
  hasCourses = true,
  compact = false,
}: Props) {
  const { personsPerRoom } = usePersonsPerRoom();
  const { rooms, perPerson } = lodgingCost(
    lodgingNightlyRate,
    nights,
    players,
    personsPerRoom,
  );
  const lodging = golfOnly ? 0 : perPerson;
  const incomplete =
    missingPrices > 0 || !hasCourses || (!golfOnly && !lodgingNightlyRate);
  return (
    <div
      className={
        compact
          ? "rounded-[20px] border border-charcoal/8 bg-white px-4 py-3"
          : "rounded-[28px] bg-forest-950 px-6 py-5 text-cream"
      }
    >
      <p className="text-xs uppercase tracking-widest opacity-60">
        {incomplete ? "Known costs / person" : "Estimated / person"}
      </p>
      <p
        className={
          compact ? "mt-2 text-xl font-semibold" : "mt-2 font-serif text-4xl"
        }
      >
        {money(golfPerPerson + lodging)}
        {incomplete && <span className="text-sm"> + costs needed</span>}
      </p>
      {!compact && (
        <>
          <p className="mt-2 text-sm opacity-70">{golfLabel}</p>
          <p className="mt-3 text-sm">
            {money(golfPerPerson)} golf · {golfRoundsLabel}
          </p>
          {!golfOnly && (
            <p className="text-sm">
              {lodgingNightlyRate
                ? `${money(lodging)} lodging · ${rooms} rooms · ${nights} nights · ${personsPerRoom} people/room`
                : "Choose lodging to include it"}
            </p>
          )}
          <p className="mt-3 text-xs opacity-70">
            {missingPrices > 0 &&
              `${missingPrices} round${missingPrices === 1 ? "" : "s"} still need a price. `}
            Golf and lodging estimates only. Confirm taxes and fees with the
            provider; travel and meals are extra.
          </p>
        </>
      )}
    </div>
  );
}
