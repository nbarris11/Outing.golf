"use client";

import { FieldLabel, Input } from "@/components/ui/field";

export function GroupSizeInput() {
  return (
    <div className="max-w-sm">
      <FieldLabel htmlFor="groupSize">Group size</FieldLabel>
      <Input
        id="groupSize"
        name="numberOfPlayers"
        type="number"
        min="2"
        max="24"
        defaultValue="8"
        autoComplete="off"
        onWheel={(e) => e.currentTarget.blur()}
        required
      />
    </div>
  );
}
