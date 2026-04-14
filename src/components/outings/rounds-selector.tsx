"use client";

import { useOptimistic, useTransition } from "react";

import { assignCourseRoundsAction } from "@/lib/actions/outings";

interface Props {
  outingId: string;
  courseId: string;
  scheduleRounds: number;
}

export function RoundsSelector({ outingId, courseId, scheduleRounds }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRounds, setOptimisticRounds] = useOptimistic<number>(scheduleRounds);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const rounds = Number(e.target.value);
    startTransition(async () => {
      setOptimisticRounds(rounds);
      await assignCourseRoundsAction(outingId, courseId, rounds);
    });
  }

  return (
    <select
      value={optimisticRounds}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-full border border-charcoal/15 bg-white px-3 py-1 text-xs text-charcoal/70 focus:outline-none focus:ring-2 focus:ring-forest-800/20 disabled:opacity-50 cursor-pointer"
      title="Rounds at this course"
    >
      {[1, 2, 3, 4].map((r) => (
        <option key={r} value={r}>
          {r} rnd
        </option>
      ))}
    </select>
  );
}
