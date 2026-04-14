"use client";

import { FieldLabel, Input } from "@/components/ui/field";

export function GroupSizeInput({ defaultValue = 8 }: { defaultValue?: number } = {}) {
  return (
    <div className="max-w-sm">
      <FieldLabel htmlFor="groupSize">Group size</FieldLabel>
      <Input
        id="groupSize"
        name="numberOfPlayers"
        type="number"
        min="2"
        max="24"
        defaultValue={defaultValue}
        autoComplete="off"
        onWheel={(e) => e.currentTarget.blur()}
        required
      />
    </div>
  );
}
