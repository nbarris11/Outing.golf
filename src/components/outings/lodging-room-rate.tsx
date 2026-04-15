"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}

interface LodgingRoomRateProps {
  nightlyRate: number;
  nights: number;
  personsPerRoom: number;
}

export function LodgingRoomRate({ nightlyRate, nights, personsPerRoom }: LodgingRoomRateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(n: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("personsPerRoom", String(n));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const perPersonPerNight = Math.round(nightlyRate / personsPerRoom);
  const totalPerPerson = perPersonPerNight * nights;

  return (
    <div className="text-right shrink-0">
      <div className="flex items-baseline justify-end gap-1.5">
        <p className={`font-semibold text-charcoal transition-opacity ${isPending ? "opacity-50" : ""}`}>
          {fmt(perPersonPerNight)}
          <span className="ml-1 text-xs font-normal text-charcoal/50">/person/night</span>
        </p>
      </div>
      <p className="mt-0.5 text-xs text-charcoal/45">
        {fmt(nightlyRate)}/room × {nights}n = {fmt(totalPerPerson)} total
      </p>
      <div className="mt-1.5 flex items-center justify-end gap-1.5">
        <span className="text-xs text-charcoal/45">Persons/room:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleChange(n)}
              disabled={isPending}
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors disabled:opacity-50",
                personsPerRoom === n
                  ? "bg-forest-900 text-cream"
                  : "bg-charcoal/8 text-charcoal/60 hover:bg-charcoal/15"
              ].join(" ")}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
