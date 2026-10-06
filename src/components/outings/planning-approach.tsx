"use client";
import { useState } from "react";
import { FieldLabel, Input } from "@/components/ui/field";
export function PlanningApproach() {
  const [mode, setMode] = useState("organizer");
  return (
    <fieldset className="rounded-2xl border border-forest-900/15 p-5">
      <legend className="px-2 text-lg font-semibold">
        How would you like to plan?
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            value: "organizer",
            label: "I’ll plan it",
            text: "Choose courses and build the schedule. Share the plan when you’re ready.",
          },
          {
            value: "group",
            label: "Ask the group first",
            text: "Collect dates and budgets, then use the group’s input to build the trip.",
          },
        ].map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-xl border p-4 ${mode === option.value ? "border-forest-900 bg-forest-900/5" : "border-charcoal/10"}`}
          >
            <input
              type="radio"
              name="planningMode"
              value={option.value}
              checked={mode === option.value}
              onChange={() => setMode(option.value)}
              className="mr-2 accent-forest-900"
            />
            <span className="font-semibold">{option.label}</span>
            <p className="mt-2 text-sm text-charcoal/65">{option.text}</p>
          </label>
        ))}
      </div>
      {mode === "group" && (
        <div className="mt-4">
          <FieldLabel htmlFor="initialInviteEmail">
            First golfer’s email (optional)
          </FieldLabel>
          <Input
            id="initialInviteEmail"
            name="initialInviteEmail"
            type="email"
            placeholder="friend@example.com"
          />
          <p className="mt-2 text-xs text-charcoal/60">
            Creating the trip sends this invitation. Or leave it blank and share
            a link later.
          </p>
        </div>
      )}
      <p className="mt-3 text-xs text-charcoal/60">
        You can change this later. Both options include group sharing.
      </p>
    </fieldset>
  );
}
