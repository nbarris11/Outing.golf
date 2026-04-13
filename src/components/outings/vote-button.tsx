"use client";

import { useTransition } from "react";

import { castGroupVoteAction } from "@/lib/actions/outings";

interface Props {
  outingId: string;
  entityType: string;
  entityId: string;
  isMyPick: boolean;
  /** Classes applied when NOT the user's current pick */
  idleClassName?: string;
  /** Classes applied when this IS the user's current pick */
  activeClassName?: string;
}

export function VoteButton({
  outingId,
  entityType,
  entityId,
  isMyPick,
  idleClassName = "bg-forest-900/10 text-forest-900 hover:bg-forest-900/20",
  activeClassName = "bg-white/20 text-cream hover:bg-white/30"
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.append("outingId", outingId);
    formData.append("entityType", entityType);
    formData.append("entityId", entityId);
    startTransition(async () => {
      await castGroupVoteAction(formData);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60",
        isMyPick ? activeClassName : idleClassName
      ].join(" ")}
    >
      {isPending ? "…" : isMyPick ? "✓ Your pick" : "Vote"}
    </button>
  );
}
