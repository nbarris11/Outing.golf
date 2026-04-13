"use client";

import { useOptimistic, useRef, useTransition } from "react";

import {
  addPackingItemAction,
  removePackingItemAction,
  togglePackingItemAction
} from "@/lib/actions/trip";
import type { TripPackingItem } from "@/modules/outings/service";

interface Props {
  items: TripPackingItem[];
  outingId: string;
  currentProfileId: string;
  isOrganizer: boolean;
  profiles: Map<string, string>;
}

interface OptimisticItem extends TripPackingItem {
  optimistic?: boolean;
}

type OptimisticAction =
  | { type: "toggle"; itemId: string; profileId: string }
  | { type: "remove"; itemId: string }
  | { type: "add"; item: TripPackingItem };

function applyOptimistic(state: OptimisticItem[], action: OptimisticAction): OptimisticItem[] {
  switch (action.type) {
    case "toggle":
      return state.map((item) =>
        item.id === action.itemId
          ? {
              ...item,
              checkedBy: item.checkedBy ? null : action.profileId,
              checkedAt: item.checkedBy ? null : new Date().toISOString(),
              optimistic: true
            }
          : item
      );
    case "remove":
      return state.filter((item) => item.id !== action.itemId);
    case "add":
      return [...state, { ...action.item, optimistic: true }];
    default:
      return state;
  }
}

export function TripPackingList({ items, outingId, currentProfileId, isOrganizer, profiles }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, dispatchOptimistic] = useOptimistic<OptimisticItem[], OptimisticAction>(
    items,
    applyOptimistic
  );
  const formRef = useRef<HTMLFormElement>(null);

  const checkedCount = optimisticItems.filter((item) => item.checkedBy).length;
  const total = optimisticItems.length;
  const progress = total > 0 ? (checkedCount / total) * 100 : 0;

  function handleToggle(item: OptimisticItem) {
    startTransition(async () => {
      dispatchOptimistic({ type: "toggle", itemId: item.id, profileId: currentProfileId });
      await togglePackingItemAction(item.id, outingId);
    });
  }

  function handleRemove(itemId: string) {
    startTransition(async () => {
      dispatchOptimistic({ type: "remove", itemId });
      await removePackingItemAction(itemId, outingId);
    });
  }

  async function handleAdd(formData: FormData) {
    const label = formData.get("label");
    if (typeof label !== "string" || !label.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newItem: TripPackingItem = {
      id: tempId,
      outingId,
      label: label.trim(),
      isDefault: false,
      checkedBy: null,
      checkedAt: null,
      sortOrder: 999
    };

    startTransition(async () => {
      dispatchOptimistic({ type: "add", item: newItem });
      formRef.current?.reset();
      await addPackingItemAction(formData);
    });
  }

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-xl font-semibold text-forest-900">Packing list</h3>
        <span className="text-sm text-charcoal/50 tabular-nums">
          {checkedCount}/{total} packed
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 mb-5 h-2 rounded-full bg-sand overflow-hidden">
        <div
          className="h-full rounded-full bg-forest-800 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <ul className="space-y-1">
        {optimisticItems.map((item) => {
          const isChecked = Boolean(item.checkedBy);
          const checkerName = item.checkedBy ? (profiles.get(item.checkedBy) ?? "Someone") : null;

          return (
            <li key={item.id} className="group flex items-start gap-3 py-2">
              <button
                onClick={() => handleToggle(item)}
                disabled={isPending}
                className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-800"
                style={{
                  borderColor: isChecked ? "#245240" : "#d9c8a7",
                  backgroundColor: isChecked ? "#245240" : "transparent"
                }}
                aria-label={isChecked ? `Unpack ${item.label}` : `Pack ${item.label}`}
              >
                {isChecked && (
                  <svg className="w-3 h-3 text-cream" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm leading-5 transition-all duration-150 ${
                    isChecked ? "line-through text-charcoal/35" : "text-charcoal"
                  }`}
                >
                  {item.label}
                  {!item.isDefault && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wide text-charcoal/30">custom</span>
                  )}
                </span>
                {isChecked && checkerName && (
                  <p className="text-xs text-forest-800/60 mt-0.5">
                    {checkerName} packed this
                  </p>
                )}
              </div>

              {isOrganizer && !item.isDefault && (
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isPending}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-charcoal/30 hover:text-red-500 focus:outline-none"
                  aria-label={`Remove ${item.label}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Add item form */}
      <form ref={formRef} action={handleAdd} className="mt-5 flex gap-2">
        <input type="hidden" name="outingId" value={outingId} />
        <input
          type="text"
          name="label"
          placeholder="Add your own item…"
          maxLength={100}
          className="flex-1 rounded-xl border border-charcoal/12 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest-800/30"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-forest-900 px-4 py-2 text-sm font-medium text-cream hover:bg-forest-800 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
}
