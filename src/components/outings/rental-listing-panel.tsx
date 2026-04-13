"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currency } from "@/lib/utils";

function AirbnbIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.09 4.29c.615 0 1.12.504 1.12 1.12a1.12 1.12 0 01-2.24 0c0-.616.505-1.12 1.12-1.12zm3.93 11.55c-.17.396-.404.74-.695 1.02a3.16 3.16 0 01-.99.655c-.37.15-.75.228-1.154.228-.405 0-.785-.077-1.155-.228a3.16 3.16 0 01-.989-.655 3.17 3.17 0 01-.695-1.02c-.614-1.434-.24-2.99.3-4.307.544-1.315 1.31-2.5 1.945-3.43.633.93 1.4 2.115 1.943 3.43.54 1.317.915 2.873.3 4.306h.19zm1.47.614c.16-.382.255-.79.255-1.225 0-.79-.24-1.568-.58-2.317-.342-.748-.813-1.487-1.283-2.185-.47-.698-.943-1.36-1.33-1.948a.414.414 0 00-.692 0c-.387.588-.86 1.25-1.33 1.948-.47.698-.942 1.437-1.283 2.185-.34.749-.58 1.527-.58 2.317 0 .436.094.843.255 1.225.384.895 1.107 1.61 2.017 1.97.38.148.78.225 1.196.225.415 0 .815-.077 1.195-.224.91-.36 1.633-1.076 2.016-1.97l.145-.001z" />
    </svg>
  );
}

function VrboIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  );
}

interface SavedListing {
  name: string;
  url: string;
  nightlyRate: number;
  sleeps: number;
  nights: number;
  players: number;
}

export function RentalListingPanel({
  outingId,
  destination,
  checkIn,
  checkOut,
  guests,
  nights,
  players,
  isOrganizer = false
}: {
  outingId: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  players: number;
  isOrganizer?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Manual listing form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [nightlyRate, setNightlyRate] = useState("");
  const [sleeps, setSleeps] = useState(String(guests));
  const [lodgingType, setLodgingType] = useState<"house" | "resort" | "hotel">("house");

  // Build pre-filled Airbnb search URL
  const airbnbUrl = (() => {
    const params = new URLSearchParams({
      query: destination,
      checkin: checkIn,
      checkout: checkOut,
      adults: String(guests),
      tab_id: "home_tab"
    });
    return `https://www.airbnb.com/s/${encodeURIComponent(destination)}/homes?${params}`;
  })();

  // Build pre-filled VRBO search URL
  const vrboUrl = (() => {
    const params = new URLSearchParams({
      q: destination,
      arrival: checkIn,
      departure: checkOut,
      sleeps: String(guests)
    });
    return `https://www.vrbo.com/search?${params}`;
  })();

  async function saveListing() {
    const rate = parseFloat(nightlyRate);
    if (!name.trim() || !rate || rate <= 0) {
      setError("Please enter a name and a valid nightly rate.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const priceTotal = rate * nights;
        const offerId = `manual-${Date.now()}`;

        const response = await fetch(`/api/outings/${outingId}/lodging-options`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            option: {
              provider: "liteapi",
              hotelId: offerId,
              hotelName: name.trim(),
              roomName: url.trim() ? `View listing →` : "Entire property",
              boardType: null,
              priceTotal,
              currency: "USD",
              nightlyRate: rate,
              cancellationSummary: url.trim()
                ? `See listing for cancellation policy: ${url.trim()}`
                : null,
              refundable: null,
              hotelAddress: null,
              city: destination,
              state: null,
              country: "US",
              latitude: null,
              longitude: null,
              starRating: null,
              reviewScore: null,
              thumbnailUrl: null,
              amenities: ["Entire property", `Sleeps ${sleeps}`],
              checkIn,
              checkOut,
              guestCount: parseInt(sleeps) || guests,
              offerId,
              lodgingType
            }
          })
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Failed to save listing");

        setSuccess(`"${name.trim()}" saved to the outing.`);
        setName("");
        setUrl("");
        setNightlyRate("");
        setSleeps(String(guests));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save listing");
      }
    });
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">Airbnb &amp; VRBO</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Search live listings, then paste the best one back in to save it to the outing.
          </p>
        </div>
      </div>

      {/* Quick-search links */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-[22px] bg-[#FF5A5F] px-5 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <AirbnbIcon />
          Search Airbnb →
        </a>
        <a
          href={vrboUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-[22px] bg-[#1B6FE4] px-5 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <VrboIcon />
          Search VRBO →
        </a>
      </div>

      <p className="mt-3 text-xs text-charcoal/45">
        Links pre-fill {destination} · {checkIn} – {checkOut} · {guests} guests
      </p>

      {/* Divider + manual save form — organizer only */}
      {isOrganizer && (
      <>
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-charcoal/8" />
        <span className="text-xs uppercase tracking-[0.2em] text-charcoal/35">Save a listing</span>
        <span className="h-px flex-1 bg-charcoal/8" />
      </div>

      {/* Manual entry form */}
      <div className="rounded-[24px] bg-cream p-5">
        <p className="text-sm text-charcoal/68 mb-4">
          Found something great? Enter the details below and it'll appear in the compare view alongside the hotel options.
        </p>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-charcoal/68">
              Property name
              <input
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
                placeholder="e.g. Lakehouse on Elm St"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm text-charcoal/68">
              Nightly rate ($)
              <input
                type="number"
                min={0}
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
                placeholder="e.g. 450"
                value={nightlyRate}
                onChange={(e) => setNightlyRate(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-charcoal/68">
              Sleeps (guests)
              <input
                type="number"
                min={1}
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-charcoal"
                value={sleeps}
                onChange={(e) => setSleeps(e.target.value)}
              />
            </label>
            <label className="block text-sm text-charcoal/68">
              Type
              <select
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-charcoal"
                value={lodgingType}
                onChange={(e) => setLodgingType(e.target.value as "house" | "resort" | "hotel")}
              >
                <option value="house">House / Rental</option>
                <option value="resort">Resort / Condo</option>
                <option value="hotel">Hotel</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-charcoal/68">
            Listing URL (optional — saved for reference)
            <input
              type="url"
              className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
              placeholder="https://www.airbnb.com/rooms/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>

          {/* Preview cost */}
          {nightlyRate && parseFloat(nightlyRate) > 0 && (
            <div className="rounded-[18px] bg-white px-4 py-3 text-sm">
              <span className="text-charcoal/55">Total cost: </span>
              <span className="font-semibold text-charcoal">
                {currency(parseFloat(nightlyRate) * nights)}
              </span>
              <span className="mx-2 text-charcoal/30">·</span>
              <span className="text-charcoal/55">Per person: </span>
              <span className="font-semibold text-forest-900">
                {currency(Math.round((parseFloat(nightlyRate) * nights) / players))}
              </span>
            </div>
          )}

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          {success && (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
          )}

          <Button onClick={saveListing} disabled={isPending || !name.trim() || !nightlyRate}>
            {isPending ? "Saving..." : "Save to outing"}
          </Button>
        </div>
      </div>
      </>
      )}
    </Card>
  );
}
