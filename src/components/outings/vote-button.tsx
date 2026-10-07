"use client";

import { useState, useTransition } from "react";

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
  idleClassName = "bg-forest-900 text-cream hover:bg-forest-900/90",
  activeClassName = "bg-white/20 text-cream ring-2 ring-white/40 hover:bg-white/30",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleClick() {
    const formData = new FormData();
    formData.append("outingId", outingId);
    formData.append("entityType", entityType);
    formData.append("entityId", entityId);
    setError("");
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await castGroupVoteAction(formData);
        if (result?.error) setError(result.error);
        else setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save your vote.");
      }
    });
  }

  return (
    <div>
      <button
        aria-pressed={isMyPick}
        onClick={handleClick}
        disabled={isPending}
        className={[
          "rounded-full px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60",
          isMyPick ? activeClassName : idleClassName,
        ].join(" ")}
      >
        {isPending ? "…" : isMyPick ? "✓ Your pick" : "Vote"}
      </button>
      {saved && (
        <span role="status" className="ml-2 text-xs">
          Saved
        </span>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
