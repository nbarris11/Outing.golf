"use client";

import { useMemo, useState } from "react";

import { FieldLabel, Input, Select } from "@/components/ui/field";

type DestinationType = "open" | "city" | "state" | "region";

const destinationContent: Record<
  DestinationType,
  {
    fieldLabel: string;
    placeholder: string;
    helper: string;
    suggestions: string[];
  }
> = {
  open: {
    fieldLabel: "Optional direction",
    placeholder: "Driveable golf weekend, anywhere warm, easy direct flights",
    helper: "Best when the group is still open. Give a rough direction or leave it broad.",
    suggestions: ["Driveable golf weekend", "Anywhere warm", "Easy direct flights", "Budget-friendly golf trip"]
  },
  city: {
    fieldLabel: "City",
    placeholder: "Scottsdale, AZ",
    helper: "Use this when the group already has a city in mind.",
    suggestions: ["Scottsdale, AZ", "Myrtle Beach, SC", "Pinehurst, NC", "Bandon, OR"]
  },
  state: {
    fieldLabel: "State",
    placeholder: "Wisconsin",
    helper: "Useful when you want options inside one state without locking one town too early.",
    suggestions: ["Wisconsin", "Michigan", "Florida", "Arizona"]
  },
  region: {
    fieldLabel: "Region",
    placeholder: "Northern Michigan",
    helper: "Great for broader golf clusters with several course and lodging combinations.",
    suggestions: ["Northern Michigan", "Lake of the Ozarks", "Sandhills", "Hilton Head area"]
  }
};

export function DestinationPicker({
  defaultType = "open",
  defaultLabel = ""
}: {
  defaultType?: DestinationType;
  defaultLabel?: string;
}) {
  const [destinationType, setDestinationType] = useState<DestinationType>(defaultType);

  const content = destinationContent[destinationType];
  const datalistId = useMemo(() => `destination-suggestions-${destinationType}`, [destinationType]);

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr]">
      <div>
        <FieldLabel htmlFor="destinationType">How specific is the destination?</FieldLabel>
        <Select
          id="destinationType"
          name="destinationType"
          value={destinationType}
          onChange={(event) => setDestinationType(event.target.value as DestinationType)}
        >
          <option value="open">Keep it flexible</option>
          <option value="city">Specific city</option>
          <option value="state">State</option>
          <option value="region">Region</option>
        </Select>
      </div>
      <div>
        <FieldLabel htmlFor="destinationLabel">{content.fieldLabel}</FieldLabel>
        <Input
          id="destinationLabel"
          name="destinationLabel"
          placeholder={content.placeholder}
          defaultValue={defaultLabel}
          list={datalistId}
        />
        <datalist id={datalistId}>
          {content.suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        <p className="mt-2 text-xs text-charcoal/48">{content.helper}</p>
      </div>
    </div>
  );
}
