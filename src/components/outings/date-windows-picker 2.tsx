"use client";

import { useState } from "react";

import { FieldLabel, Input } from "@/components/ui/field";

interface DateWindow {
  start: string;
  end: string;
}

export function DateWindowsPicker() {
  const [windows, setWindows] = useState<DateWindow[]>([{ start: "", end: "" }]);

  const updateWindow = (index: number, field: "start" | "end", value: string) => {
    setWindows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
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
        {windows.map((win, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
              <FieldLabel htmlFor={`dateEnd_${i}`}>
                {windows.length > 1 ? `Option ${i + 1} — end` : "End date"}
              </FieldLabel>
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
        ))}
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
