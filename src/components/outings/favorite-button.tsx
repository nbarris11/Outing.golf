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
      title={optimistic.favorited ? "Remove your like" : "Like this"}
      aria-pressed={optimistic.favorited}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
        optimistic.favorited
          ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
          : "border border-charcoal/15 bg-white text-charcoal/60 hover:border-rose-300 hover:text-rose-600"
      ].join(" ")}
    >
      <span aria-hidden="true">{optimistic.favorited ? "♥" : "♡"}</span>
      <span>{optimistic.favorited ? "Liked" : "Like"}</span>
      {optimistic.count > 0 && (
        <span className="text-[11px] opacity-70">· {optimistic.count}</span>
      )}
    </button>
  );
}
