"use client";

import { useMemo, useState } from "react";

import { FieldLabel, Input, Select } from "@/components/ui/field";

type DestinationType = "open" | "city" | "state" | "region" | "international";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming"
];

const INTERNATIONAL_SUGGESTIONS = [
  "Scotland, UK","Ireland","Canada","Mexico","Dominican Republic",
  "Jamaica","Bahamas","Spain","Portugal","Australia","New Zealand"
];

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
    suggestions: ["Scottsdale, AZ", "Myrtle Beach, SC", "Pinehurst, NC", "Bandon, OR", "Pebble Beach, CA", "Hilton Head, SC"]
  },
  state: {
    fieldLabel: "State",
    placeholder: "Arizona",
    helper: "Useful when you want options inside one state without locking one town too early.",
    suggestions: US_STATES
  },
  region: {
    fieldLabel: "Region",
    placeholder: "Northern Michigan",
    helper: "Great for broader golf clusters with several course and lodging combinations.",
    suggestions: ["Northern Michigan", "Lake of the Ozarks", "Sandhills", "Hilton Head area", "Gulf Coast", "Outer Banks", "Blue Ridge Mountains"]
  },
  international: {
    fieldLabel: "Country or destination",
    placeholder: "Scotland, UK",
    helper: "International trips — the app will find golf options near your destination.",
    suggestions: INTERNATIONAL_SUGGESTIONS
  }
};

export function DestinationPicker({
  defaultType = "open",
  defaultLabel = "",
  defaultZip = ""
}: {
  defaultType?: DestinationType;
  defaultLabel?: string;
  defaultZip?: string;
}) {
  const [destinationType, setDestinationType] = useState<DestinationType>(defaultType);
  const [zipCode, setZipCode] = useState(defaultZip);

  const content = destinationContent[destinationType];
  const datalistId = useMemo(() => `destination-suggestions-${destinationType}`, [destinationType]);
  const showZip = destinationType === "open" || destinationType === "city" || destinationType === "state" || destinationType === "region";

  return (
    <div className="space-y-4">
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
            <option value="international">International</option>
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

      {showZip && (
        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <div />
          <div>
            <FieldLabel htmlFor="originZip">Your zip code (optional)</FieldLabel>
            <Input
              id="originZip"
              name="originZip"
              placeholder="e.g. 48105"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={10}
            />
            <p className="mt-2 text-xs text-charcoal/48">
              Used to estimate drive time and find courses within range of where your group is traveling from.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
