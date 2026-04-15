"use client";

import { useOptimistic, useTransition } from "react";

import { toggleOrganizerPickAction } from "@/lib/actions/outings";

interface Props {
  outingId: string;
  entityType: "golf_course" | "lodging";
  entityId: string;
  isFeatured: boolean;
}

export function OrganizerPickButton({ outingId, entityType, entityId, isFeatured }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFeatured, setOptimisticFeatured] = useOptimistic<boolean>(isFeatured);

  function handleClick() {
    startTransition(async () => {
      setOptimisticFeatured(!optimisticFeatured);
      await toggleOrganizerPickAction(outingId, entityType, entityId, optimisticFeatured);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={optimisticFeatured ? "Remove from trip plan" : "Add to trip plan"}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
        optimisticFeatured
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "border border-charcoal/15 bg-white text-charcoal/60 hover:border-emerald-400 hover:text-emerald-700"
      ].join(" ")}
    >
      {optimisticFeatured ? "✓ In the trip" : "+ Add to trip"}
    </button>
  );
}
