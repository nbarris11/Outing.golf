"use client";

import { useOptimistic, useTransition } from "react";

import { assignCourseScheduleAction } from "@/lib/actions/outings";

interface Props {
  outingId: string;
  courseId: string;
  scheduleDay: number | null;
  /** How many day slots to offer (usually = number of visible courses) */
  maxDays: number;
}

export function CourseScheduleSelector({ outingId, courseId, scheduleDay, maxDays }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDay, setOptimisticDay] = useOptimistic<number | null>(scheduleDay);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const newDay = value === "" ? null : Number(value);
    startTransition(async () => {
      setOptimisticDay(newDay);
      await assignCourseScheduleAction(outingId, courseId, newDay);
    });
  }

  return (
    <select
      value={optimisticDay ?? ""}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-full border border-charcoal/15 bg-white px-3 py-1 text-xs text-charcoal/70 focus:outline-none focus:ring-2 focus:ring-forest-800/20 disabled:opacity-50 cursor-pointer"
    >
      <option value="">No day assigned</option>
      {Array.from({ length: maxDays }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          Day {i + 1}
        </option>
      ))}
    </select>
  );
}
