"use client";

import { useEffect, useRef, useState } from "react";

interface CoursePricing {
  avgRate: number | null;
  weekdayRate: number | null;
  weekendRate: number | null;
  sourceUrl: string | null;
  sourceName: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low" | null;
}

interface Props {
  courseName: string;
  locationLabel: string;
  rounds: number;
  /** If the DB already has a stored averageGreensFee (>0), we skip the fetch and use it. */
  storedGreensFee?: number;
}

function currency(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export function CoursePriceDisplay({
  courseName,
  locationLabel,
  rounds,
  storedGreensFee
}: Props) {
  const [pricing, setPricing] = useState<CoursePricing | null>(() =>
    storedGreensFee && storedGreensFee > 0
      ? {
          avgRate: storedGreensFee,
          weekdayRate: null,
          weekendRate: null,
          sourceUrl: null,
          sourceName: null,
          notes: null,
          confidence: null
        }
      : null
  );
  const [state, setState] = useState<"idle" | "loading" | "done" | "unavailable">(
    storedGreensFee && storedGreensFee > 0 ? "done" : "idle"
  );
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    if (storedGreensFee && storedGreensFee > 0) return;
    fetchedRef.current = true;
    setState("loading");

    fetch("/api/course-pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: courseName, location: locationLabel })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { pricing: CoursePricing | null } | null) => {
        if (data?.pricing && data.pricing.avgRate) {
          setPricing(data.pricing);
          setState("done");
        } else {
          setState("unavailable");
        }
      })
      .catch(() => setState("unavailable"));
  }, [courseName, locationLabel, storedGreensFee]);

  if (state === "loading") {
    return (
      <div className="text-right">
        <p className="text-sm text-charcoal/45 animate-pulse">Finding rate…</p>
      </div>
    );
  }

  if (state === "unavailable" || !pricing?.avgRate) {
    return (
      <div className="text-right">
        <p className="text-sm font-medium text-charcoal/60">Rate varies</p>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(
            `${courseName} ${locationLabel} greens fee`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 text-xs text-forest-900 hover:underline"
        >
          Look up →
        </a>
      </div>
    );
  }

  const total = pricing.avgRate * rounds;

  return (
    <div className="text-right">
      <p className="font-semibold text-charcoal">
        {currency(total)}
        <span className="ml-1 text-xs font-normal text-charcoal/50">/person</span>
      </p>
      <p className="mt-0.5 text-xs text-charcoal/45">
        {currency(pricing.avgRate)} × {rounds}rnd
      </p>
      {pricing.sourceName && pricing.sourceUrl && (
        <a
          href={pricing.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-block text-[10px] text-charcoal/40 hover:text-forest-900 hover:underline"
          title={pricing.notes ?? undefined}
        >
          source: {pricing.sourceName}
        </a>
      )}
    </div>
  );
}
