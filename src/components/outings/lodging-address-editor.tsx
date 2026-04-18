"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  optionId: string;
  outingId: string;
  currentAddress: string | null | undefined;
}

export function LodgingAddressEditor({ optionId, outingId, currentAddress }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentAddress ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await fetch(`/api/outings/${outingId}/lodging-options/${optionId}/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: value.trim() || null })
      });
      setEditing(false);
      router.refresh();
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-0.5 text-[10px] text-charcoal/40 hover:text-forest-900 transition-colors"
      >
        {currentAddress ? "Edit address" : "Add address"}
      </button>
    );
  }

  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-52 rounded-lg border border-charcoal/15 bg-white px-2 py-1 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-forest-900/30"
        placeholder="123 Lakeside Dr, Harrison, MI"
        autoFocus
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="rounded-full bg-forest-900 px-2 py-0.5 text-[10px] font-semibold text-cream disabled:opacity-50 transition-opacity"
      >
        {isPending ? "…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-[10px] text-charcoal/40 hover:text-charcoal transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
