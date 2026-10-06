"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  outingId: string;
  currentPrice: number;
  initiallyEditing?: boolean;
}

export function CoursePriceEditor({ courseId, outingId, currentPrice, initiallyEditing = false }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(initiallyEditing);
  const [value, setValue] = useState(
    currentPrice > 0 ? String(currentPrice) : "",
  );
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const price = Number(value);
    if (!Number.isFinite(price) || price < 1 || price > 10000) { setError("Enter a price from $1 to $10,000."); return; }
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
        onClick={() => { setValue(currentPrice > 0 ? String(currentPrice) : ""); setEditing(true); }}
        className="mt-0.5 text-xs text-charcoal/40 hover:text-forest-900 transition-colors"
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
        max={10000}
        disabled={isPending}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 rounded-lg border border-charcoal/15 bg-white px-2 py-1 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-forest-900/30"
        placeholder="85"
        autoFocus={!initiallyEditing}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || !value}
        className="min-h-9 rounded-full bg-forest-900 px-3 py-1 text-xs font-semibold text-cream disabled:opacity-50 transition-opacity"
      >
        {isPending ? "…" : "Save"}
      </button>
      <button
        type="button"
        aria-label="Cancel price edit"
        onClick={() => setEditing(false)}
        className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
