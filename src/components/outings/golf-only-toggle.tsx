"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toggleGolfOnlyAction } from "@/lib/actions/outings";

interface Props {
  outingId: string;
  golfOnly: boolean;
}

export function GolfOnlyToggle({ outingId, golfOnly }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticActive, setOptimisticActive] = useOptimistic(golfOnly);

  function handleToggle() {
    const next = !optimisticActive;
    const formData = new FormData();
    formData.set("outingId", outingId);
    formData.set("golfOnly", next ? "true" : "false");

    startTransition(async () => {
      setOptimisticActive(next);
      try {
        await toggleGolfOnlyAction(formData);
      } catch {
        // Action threw — optimistic state auto-reverts when transition ends
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-charcoal/8 bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-charcoal">Golf only — no hotel</p>
        <p className="text-xs text-charcoal/50">
          {optimisticActive
            ? "Hotel is excluded from the cost estimate."
            : "Toggle on to remove lodging from the cost estimate."}
        </p>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={[
          "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none disabled:opacity-60",
          optimisticActive ? "bg-forest-900" : "bg-charcoal/20"
        ].join(" ")}
        aria-label="Toggle golf-only mode"
        aria-pressed={optimisticActive}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left]",
            optimisticActive ? "left-5" : "left-0.5"
          ].join(" ")}
        />
      </button>
    </div>
  );
}
