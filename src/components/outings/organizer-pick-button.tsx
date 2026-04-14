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

  if (optimisticFeatured) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-3 py-1 text-xs font-medium text-cream transition-colors hover:bg-forest-900/80 disabled:opacity-50"
        title="Remove organizer's pick"
      >
        ★ Organizer&apos;s pick
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-3 py-1 text-xs text-charcoal/55 transition-colors hover:border-forest-900/30 hover:text-forest-900 disabled:opacity-50"
      title="Mark as organizer's pick"
    >
      ☆ Pick this
    </button>
  );
}
