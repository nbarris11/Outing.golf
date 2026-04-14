"use client";

import { useState } from "react";

import { FieldLabel, Input } from "@/components/ui/field";

const MAX_NIGHTS = 14;

interface DateWindow {
  start: string;
  end: string;
  nightsError?: string;
}

function calcNights(start: string, end: string): number {
  if (!start || !end) return 0;
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
}

interface DateWindowsPickerProps {
  initialWindows?: { start: string; end: string }[];
}

export function DateWindowsPicker({ initialWindows }: DateWindowsPickerProps = {}) {
  const [windows, setWindows] = useState<DateWindow[]>(
    initialWindows && initialWindows.length > 0 ? initialWindows : [{ start: "", end: "" }]
  );

  const updateWindow = (index: number, field: "start" | "end", value: string) => {
    setWindows((prev) => {
      const next = [...prev];
      const updated = { ...next[index], [field]: value };
      const nights = calcNights(
        field === "start" ? value : updated.start,
        field === "end" ? value : updated.end
      );
      updated.nightsError =
        nights > MAX_NIGHTS
          ? `That's ${nights} nights — golf trips are typically 3–7 nights. Max allowed is ${MAX_NIGHTS}.`
          : nights < 0
            ? "End date must be after start date."
            : undefined;
      // Clamp end date if over the limit
      if (nights > MAX_NIGHTS && field === "end") {
        const clampedEnd = new Date(new Date(updated.start).getTime() + MAX_NIGHTS * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        updated.end = clampedEnd;
        updated.nightsError = undefined;
      }
      next[index] = updated;
      return next;
    });
  };

  const addWindow = () => {
    if (windows.length < 4) {
      setWindows((prev) => [...prev, { start: "", end: "" }]);
    }
  };

  const removeWindow = (index: number) => {
    setWindows((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-[28px] bg-cream p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-charcoal">Date options</p>
        <p className="text-xs text-charcoal/48">Add up to 4 possible weekends</p>
      </div>

      <input type="hidden" name="dateWindowCount" value={windows.length} />

      <div className="space-y-4">
        {windows.map((win, i) => {
          const nights = calcNights(win.start, win.end);
          return (
            <div key={i}>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <div>
                  <FieldLabel htmlFor={`dateStart_${i}`}>
                    {windows.length > 1 ? `Option ${i + 1} — start` : "Start date"}
                  </FieldLabel>
                  <Input
                    id={`dateStart_${i}`}
                    name={`dateStart_${i}`}
                    type="date"
                    required={i === 0}
                    value={win.start}
                    onChange={(e) => updateWindow(i, "start", e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-baseline gap-2">
                    <label htmlFor={`dateEnd_${i}`} className="block text-sm font-medium text-charcoal">
                      {windows.length > 1 ? `Option ${i + 1} — end` : "End date"}
                    </label>
                    {nights > 0 && !win.nightsError && (
                      <span className="text-xs text-charcoal/45">
                        {nights} night{nights !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <Input
                    id={`dateEnd_${i}`}
                    name={`dateEnd_${i}`}
                    type="date"
                    required={i === 0}
                    value={win.end}
                    onChange={(e) => updateWindow(i, "end", e.target.value)}
                  />
                </div>
                {windows.length > 1 && (
                  <div className="flex items-end pb-[3px]">
                    <button
                      type="button"
                      onClick={() => removeWindow(i)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal/40 transition hover:bg-charcoal/8 hover:text-charcoal/70"
                      aria-label="Remove this date window"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {win.nightsError && (
                <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  ⚠️ {win.nightsError}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {windows.length < 4 && (
        <button
          type="button"
          onClick={addWindow}
          className="mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-forest-900 ring-1 ring-forest-900/20 transition hover:bg-forest-900/6"
        >
          <span>+</span>
          Add another date option
        </button>
      )}
    </div>
  );
}
