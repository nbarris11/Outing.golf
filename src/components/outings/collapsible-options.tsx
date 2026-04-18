"use client";

import { useState, type ReactNode } from "react";

interface Props {
  initialVisibleCount?: number;
  /** Items shown before the cap (e.g. "in the trip" picks) — always visible */
  pinned: ReactNode[];
  /** Items after the cap — hidden behind a toggle once they exceed initialVisibleCount */
  rest: ReactNode[];
  /** Label for the singular item (e.g. "course", "hotel") */
  itemLabel: string;
}

export function CollapsibleOptions({ initialVisibleCount = 3, pinned, rest, itemLabel }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleRest = expanded ? rest : rest.slice(0, initialVisibleCount);
  const hiddenCount = rest.length - visibleRest.length;

  return (
    <>
      {pinned}
      {visibleRest}
      {hiddenCount > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 w-full rounded-[22px] border border-dashed border-charcoal/15 bg-white/60 px-4 py-3 text-sm font-medium text-forest-900 hover:bg-forest-900/5 transition-colors"
        >
          See {hiddenCount} more {itemLabel}{hiddenCount !== 1 ? "s" : ""} ▾
        </button>
      )}
      {expanded && rest.length > initialVisibleCount && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-1 w-full rounded-[22px] border border-dashed border-charcoal/15 bg-white/60 px-4 py-2 text-xs font-medium text-charcoal/55 hover:bg-charcoal/5 transition-colors"
        >
          Show fewer ▴
        </button>
      )}
    </>
  );
}
