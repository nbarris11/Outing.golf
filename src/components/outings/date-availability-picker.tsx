"use client";

import { useState } from "react";

interface DateWindow {
  start: string;
  end: string;
}

function formatWindow(window: DateWindow) {
  const start = new Date(window.start + "T12:00:00");
  const end = new Date(window.end + "T12:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

export function DateAvailabilityPicker({
  windows,
  defaultSelected = []
}: {
  windows: DateWindow[];
  defaultSelected?: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  if (windows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-charcoal/12 px-4 py-3 text-sm text-charcoal/55">
        No date windows set by the organizer yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {windows.map((win, i) => {
        const value = win.start;
        const isChecked = selected.has(value);
        return (
          <label
            key={i}
            className={[
              "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition",
              isChecked
                ? "border-forest-600 bg-forest-900/6 text-charcoal"
                : "border-charcoal/10 bg-white text-charcoal/70 hover:border-charcoal/20"
            ].join(" ")}
          >
            <input
              type="checkbox"
              name="availableDates"
              value={value}
              checked={isChecked}
              onChange={() => toggle(value)}
              className="accent-forest-900"
            />
            <span className="font-medium">
              Option {i + 1}
            </span>
            <span className="text-charcoal/60">{formatWindow(win)}</span>
          </label>
        );
      })}
    </div>
  );
}
