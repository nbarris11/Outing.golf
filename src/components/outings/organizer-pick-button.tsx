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
      title={optimisticFeatured ? "Remove organizer pick" : "Mark as organizer's pick"}
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
        optimisticFeatured
          ? "bg-forest-900 text-cream hover:bg-forest-900/80"
          : "border border-charcoal/15 bg-white text-charcoal/55 hover:border-forest-900/30 hover:text-forest-900"
      ].join(" ")}
    >
      {optimisticFeatured ? "★ Pick" : "☆ Pick"}
    </button>
  );
}
