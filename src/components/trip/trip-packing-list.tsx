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

function PackingSection({
  title,
  subtitle,
  items,
  outingId,
  currentProfileId,
  canRemove,
  profiles,
  section,
  isPending,
  onToggle,
  onRemove,
  onAdd
}: {
  title: string;
  subtitle: string;
  items: OptimisticItem[];
  outingId: string;
  currentProfileId: string;
  canRemove: (item: OptimisticItem) => boolean;
  profiles: Map<string, string>;
  section: "personal" | "group";
  isPending: boolean;
  onToggle: (item: OptimisticItem) => void;
  onRemove: (itemId: string) => void;
  onAdd: (formData: FormData, section: "personal" | "group") => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const checked = items.filter((i) => i.checkedBy).length;
  const total = items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-charcoal">{title}</p>
          <p className="text-xs text-charcoal/45">{subtitle}</p>
        </div>
        <span className="text-xs text-charcoal/45 tabular-nums">{checked}/{total}</span>
      </div>

      {total > 0 && (
        <div className="mb-3 h-1.5 rounded-full bg-sand overflow-hidden">
          <div
            className="h-full rounded-full bg-forest-800 transition-all duration-500"
            style={{ width: total > 0 ? `${(checked / total) * 100}%` : "0%" }}
          />
        </div>
      )}

      <ul className="space-y-0.5">
        {items.map((item) => {
          const isChecked = Boolean(item.checkedBy);
          const checkerName = item.checkedBy ? (profiles.get(item.checkedBy) ?? "Someone") : null;
          return (
            <li key={item.id} className="group flex items-start gap-2.5 py-1.5">
              <button
                onClick={() => onToggle(item)}
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
                <span className={`text-sm leading-5 transition-all duration-150 ${isChecked ? "line-through text-charcoal/35" : "text-charcoal"}`}>
                  {item.label}
                  {!item.isDefault && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wide text-charcoal/30">custom</span>
                  )}
                </span>
                {isChecked && checkerName && (
                  <p className="text-xs text-forest-800/60 mt-0.5">{checkerName} packed this</p>
                )}
              </div>
              {canRemove(item) && (
                <button
                  onClick={() => onRemove(item.id)}
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
        {items.length === 0 && (
          <li className="py-2 text-xs text-charcoal/35 italic">Nothing added yet</li>
        )}
      </ul>

      <form
        ref={formRef}
        action={(fd) => { onAdd(fd, section); formRef.current?.reset(); }}
        className="mt-3 flex gap-2"
      >
        <input type="hidden" name="outingId" value={outingId} />
        <input type="hidden" name="section" value={section} />
        <input
          type="text"
          name="label"
          placeholder={section === "group" ? "Add group item…" : "Add to your list…"}
          maxLength={100}
          className="flex-1 rounded-xl border border-charcoal/12 bg-cream px-3 py-1.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-forest-800/30"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-forest-900 px-3 py-1.5 text-sm font-medium text-cream hover:bg-forest-800 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export function TripPackingList({ items, outingId, currentProfileId, isOrganizer, profiles }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, dispatchOptimistic] = useOptimistic<OptimisticItem[], OptimisticAction>(
    items,
    applyOptimistic
  );

  const personalItems = optimisticItems.filter((i) => i.profileId === currentProfileId);
  const groupItems = optimisticItems.filter((i) => i.profileId === null);

  const totalChecked = [...personalItems, ...groupItems].filter((i) => i.checkedBy).length;
  const totalItems = personalItems.length + groupItems.length;
  const overallProgress = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

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

  function handleAdd(formData: FormData, section: "personal" | "group") {
    const label = formData.get("label");
    if (typeof label !== "string" || !label.trim()) return;

    const tempItem: TripPackingItem = {
      id: `temp-${Date.now()}`,
      outingId,
      profileId: section === "group" ? null : currentProfileId,
      label: label.trim(),
      isDefault: false,
      checkedBy: null,
      checkedAt: null,
      sortOrder: 999
    };

    startTransition(async () => {
      dispatchOptimistic({ type: "add", item: tempItem });
      await addPackingItemAction(formData);
    });
  }

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-xl font-semibold text-forest-900">Packing list</h3>
        <span className="text-sm text-charcoal/50 tabular-nums">
          {totalChecked}/{totalItems} packed
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="mt-3 mb-6 h-2 rounded-full bg-sand overflow-hidden">
        <div
          className="h-full rounded-full bg-forest-800 transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* My list */}
      <PackingSection
        title="My list"
        subtitle="Only you can see this"
        items={personalItems}
        outingId={outingId}
        currentProfileId={currentProfileId}
        canRemove={(item) => !item.isDefault}
        profiles={profiles}
        section="personal"
        isPending={isPending}
        onToggle={handleToggle}
        onRemove={handleRemove}
        onAdd={handleAdd}
      />

      {/* Divider */}
      <div className="my-5 border-t border-charcoal/8" />

      {/* Group list */}
      <PackingSection
        title="Group list"
        subtitle="Visible to everyone — shared supplies, group gear"
        items={groupItems}
        outingId={outingId}
        currentProfileId={currentProfileId}
        canRemove={(item) => isOrganizer || !item.isDefault}
        profiles={profiles}
        section="group"
        isPending={isPending}
        onToggle={handleToggle}
        onRemove={handleRemove}
        onAdd={handleAdd}
      />
    </div>
  );
}
