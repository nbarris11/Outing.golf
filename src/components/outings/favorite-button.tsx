"use client";

import { useOptimistic, useTransition } from "react";

import { toggleFavoriteAction } from "@/lib/actions/outings";

interface Props {
  outingId: string;
  entityType: "golf_course" | "lodging";
  entityId: string;
  isFavorited: boolean;
  /** Total favorites from all group members for this entity */
  totalCount: number;
}

export function FavoriteButton({ outingId, entityType, entityId, isFavorited, totalCount }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic<{ favorited: boolean; count: number }>({
    favorited: isFavorited,
    count: totalCount
  });

  function handleClick() {
    const next = {
      favorited: !optimistic.favorited,
      count: optimistic.count + (optimistic.favorited ? -1 : 1)
    };
    startTransition(async () => {
      setOptimistic(next);
      await toggleFavoriteAction(outingId, entityType, entityId, optimistic.favorited);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={optimistic.favorited ? "Remove from favorites" : "Add to favorites"}
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
        optimistic.favorited
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
          : "border border-charcoal/15 bg-white text-charcoal/50 hover:border-amber-300 hover:text-amber-600"
      ].join(" ")}
    >
      <span>{optimistic.favorited ? "★" : "☆"}</span>
      {optimistic.count > 0 && (
        <span>{optimistic.count}</span>
      )}
    </button>
  );
}
