"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  outingId: string;
  currentPrice: number;
}

export function CoursePriceEditor({ courseId, outingId, currentPrice }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(
    currentPrice > 0 ? String(currentPrice) : "",
  );
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const price = parseFloat(value);
    if (!price || price <= 0) return;
    startTransition(async () => {
      setError("");
      try {
        const response = await fetch(
          `/api/outings/${outingId}/courses/${courseId}/price`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ price: Math.round(price) }),
          },
        );
        if (!response.ok) {
          setError("Could not save price. Try again.");
          return;
        }
        setEditing(false);
        router.refresh();
      } catch {
        setError("Could not save price. Check your connection and try again.");
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-0.5 text-[10px] text-charcoal/40 hover:text-forest-900 transition-colors"
      >
        {currentPrice > 0 ? "Edit price" : "Set price"}
      </button>
    );
  }

  return (
    <div className="mt-1 flex flex-wrap items-center justify-end gap-1.5">
      {error && (
        <p role="alert" className="w-full text-xs text-red-700">
          {error}
        </p>
      )}
      <span className="text-xs text-charcoal/55">$</span>
      <input
        aria-label="Estimated price per round"
        type="number"
        min={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 rounded-lg border border-charcoal/15 bg-white px-2 py-1 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-forest-900/30"
        placeholder="85"
        autoFocus
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || !value}
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
