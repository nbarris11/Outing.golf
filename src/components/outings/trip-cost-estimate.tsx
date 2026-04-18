"use client";

import { usePersonsPerRoom } from "./persons-per-room-context";

function currency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}

interface TripCostEstimateProps {
  golfPerPerson: number;
  lodgingNightlyRate: number;
  nights: number;
  golfLabel: string;
  golfRoundsLabel: string;
  golfOnly?: boolean;
  players?: number;
}

export function TripCostEstimate({
  golfPerPerson,
  lodgingNightlyRate,
  nights,
  golfLabel,
  golfRoundsLabel,
  golfOnly = false,
  players = 4
}: TripCostEstimateProps) {
  const { personsPerRoom, setPersonsPerRoom } = usePersonsPerRoom();

  const lodgingPerPerson = golfOnly ? 0 : Math.round((lodgingNightlyRate / personsPerRoom) * nights);
  const total = golfPerPerson + lodgingPerPerson;

  return (
    <div className="rounded-[28px] bg-forest-950 px-6 py-5 text-cream">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Estimated per person</p>
          <p className="mt-2 font-serif text-4xl font-semibold tracking-[-0.05em]">
            {currency(total)}
          </p>
          <p className="mt-1 text-sm text-cream/55">{golfLabel}</p>
          {golfOnly && (
            <p className="mt-1 text-xs text-cream/40">Golf only — no lodging included</p>
          )}
        </div>
        <div className="space-y-2 text-sm text-cream/65">
          <p>{currency(golfPerPerson)} golf ({golfRoundsLabel})</p>
          {golfOnly ? (
            <p className="text-xs text-cream/40 italic">Lodging not included for this trip</p>
          ) : (
            <div className="flex items-center gap-2">
              <span>{currency(lodgingPerPerson)} lodging</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-cream/40">({nights}n ÷</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: players }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPersonsPerRoom(n)}
                      title={`${n} person${n !== 1 ? "s" : ""} per room`}
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors",
                        personsPerRoom === n
                          ? "bg-cream text-forest-950"
                          : "bg-cream/15 text-cream/60 hover:bg-cream/25"
                      ].join(" ")}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-cream/40">pp)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
