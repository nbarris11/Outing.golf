"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currency } from "@/lib/utils";
import type { LodgingOption, LodgingSearchResult } from "@/types/domain";

type SortOption = "recommended" | "lowest_price" | "highest_rating";

function matchesStyle(result: LodgingSearchResult, hotelStyle: string) {
  if (!hotelStyle || hotelStyle === "mixed") {
    return true;
  }

  return result.lodgingType === hotelStyle;
}

export function LodgingSearchPanel({
  outingId,
  destination,
  defaultCheckIn,
  defaultCheckOut,
  defaultGuests,
  isOrganizer,
  savedOptions,
  favoriteOptionIds
}: {
  outingId: string;
  destination: string;
  defaultCheckIn: string;
  defaultCheckOut: string;
  defaultGuests: number;
  isOrganizer: boolean;
  savedOptions: LodgingOption[];
  favoriteOptionIds: string[];
}) {
  const router = useRouter();
  const [destinationQuery, setDestinationQuery] = useState(destination);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(defaultGuests);
  const [maxPrice, setMaxPrice] = useState("");
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [starRating, setStarRating] = useState("any");
  const [hotelStyle, setHotelStyle] = useState("mixed");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [results, setResults] = useState<LodgingSearchResult[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mutatingKey, setMutatingKey] = useState<string | null>(null);

  const savedOfferIds = useMemo(
    () => new Set(savedOptions.map((item) => item.offerId).filter((item): item is string => Boolean(item))),
    [savedOptions]
  );

  const filteredResults = useMemo(() => {
    const priceCap = maxPrice ? Number(maxPrice) : null;

    const sorted = results.filter((item) => {
      if (refundableOnly && !item.refundable) {
        return false;
      }

      if (priceCap !== null && item.priceTotal > priceCap) {
        return false;
      }

      if (starRating !== "any" && (item.starRating ?? 0) < Number(starRating)) {
        return false;
      }

      if (!matchesStyle(item, hotelStyle)) {
        return false;
      }

      return true;
    });

    sorted.sort((left, right) => {
      if (sortBy === "lowest_price") {
        return left.priceTotal - right.priceTotal;
      }

      if (sortBy === "highest_rating") {
        return (right.reviewScore ?? 0) - (left.reviewScore ?? 0);
      }

      return (right.reviewScore ?? 0) * 6 + (right.refundable ? 4 : 0) - ((left.reviewScore ?? 0) * 6 + (left.refundable ? 4 : 0));
    });

    return sorted;
  }, [results, refundableOnly, maxPrice, starRating, hotelStyle, sortBy]);

  async function runSearch() {
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/lodging/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            outingId,
            destination: destinationQuery,
            checkIn,
            checkOut,
            adults: guests,
            children: 0,
            rooms: Math.max(1, Math.ceil(guests / 2)),
            currency: "USD",
            refundableOnly,
            starRating: starRating === "any" ? undefined : [Number(starRating)]
          })
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Search failed");
        }

        setResults(payload.results ?? []);
        setUsedFallback(Boolean(payload.usedFallback));
      } catch (fetchError) {
        setResults([]);
        setUsedFallback(false);
        setError(fetchError instanceof Error ? fetchError.message : "Search failed");
      }
    });
  }

  async function mutateOption(
    url: string,
    key: string,
    body?: Record<string, unknown>
  ) {
    setMutatingKey(key);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Update failed");
      }

      router.refresh();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Update failed");
    } finally {
      setMutatingKey(null);
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">Live lodging search</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Pull live hotel pricing from liteAPI, then save the best options back into this outing.
          </p>
        </div>
        {usedFallback ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">Dev fallback in use</span> : null}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[28px] bg-cream p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm text-charcoal/68">
              Destination
              <input
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3"
                value={destinationQuery}
                onChange={(event) => setDestinationQuery(event.target.value)}
              />
            </label>
            <label className="text-sm text-charcoal/68">
              Check-in
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
              />
            </label>
            <label className="text-sm text-charcoal/68">
              Check-out
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3"
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
              />
            </label>
            <label className="text-sm text-charcoal/68">
              Guests
              <input
                type="number"
                min={1}
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3"
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="mt-4">
            <Button onClick={runSearch} disabled={isPending}>
              {isPending ? "Searching..." : "Search lodging"}
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 ring-1 ring-charcoal/8">
          <p className="text-sm font-medium text-charcoal">Filters and sort</p>
          <div className="mt-4 space-y-4">
            <label className="block text-sm text-charcoal/68">
              Max total price
              <input
                type="number"
                min={0}
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </label>
            <label className="block text-sm text-charcoal/68">
              Minimum star rating
              <select
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3"
                value={starRating}
                onChange={(event) => setStarRating(event.target.value)}
              >
                <option value="any">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5</option>
              </select>
            </label>
            <label className="block text-sm text-charcoal/68">
              Style
              <select
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3"
                value={hotelStyle}
                onChange={(event) => setHotelStyle(event.target.value)}
              >
                <option value="mixed">Any</option>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="house">House-style</option>
              </select>
            </label>
            <label className="block text-sm text-charcoal/68">
              Sort by
              <select
                className="mt-2 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
              >
                <option value="recommended">Recommended</option>
                <option value="lowest_price">Lowest price</option>
                <option value="highest_rating">Highest rating</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm text-charcoal/68">
              <input
                type="checkbox"
                checked={refundableOnly}
                onChange={(event) => setRefundableOnly(event.target.checked)}
              />
              Refundable only
            </label>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {results.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-charcoal/12 px-5 py-4 text-sm text-charcoal/55">
          Run a search above to see live hotel options.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {filteredResults.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-charcoal/12 bg-cream px-5 py-6 text-sm text-charcoal/60">
              No results match the current filters.
            </div>
          ) : (
            filteredResults.map((result) => {
              const isSaved = savedOfferIds.has(result.offerId);
              const savedOption = savedOptions.find((item) => item.offerId === result.offerId);
              const isFavorited = savedOption ? favoriteOptionIds.includes(savedOption.id) : false;

              return (
                <div key={result.offerId} className="rounded-[28px] border border-charcoal/8 bg-white p-5 shadow-[0_20px_60px_rgba(33,36,35,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold tracking-[-0.03em] text-charcoal">{result.hotelName}</p>
                      <p className="mt-1 text-sm text-charcoal/60">
                        {result.roomName}
                        {result.boardType ? ` · ${result.boardType}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-forest-900">{currency(result.priceTotal)}</p>
                      <p className="text-sm text-charcoal/60">{currency(result.nightlyRate)}/night</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <p className="rounded-2xl bg-cream px-3 py-2 text-sm text-charcoal/68">
                      {result.refundable ? "Refundable" : "Non-refundable"}
                    </p>
                    <p className="rounded-2xl bg-cream px-3 py-2 text-sm text-charcoal/68">
                      {result.starRating ? `${result.starRating} star` : "No star rating"}
                    </p>
                    <p className="rounded-2xl bg-cream px-3 py-2 text-sm text-charcoal/68">
                      {result.reviewScore ? `${result.reviewScore}/5 reviews` : "No review score"}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-charcoal/64">
                    {result.cancellationSummary ?? "Cancellation terms are available in the prebook step."}
                  </p>

                  {result.amenities.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.amenities.slice(0, 6).map((amenity) => (
                        <span key={amenity} className="rounded-full bg-cream px-3 py-1 text-xs text-charcoal/60">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {isOrganizer ? (
                      <Button
                        onClick={() =>
                          mutateOption(`/api/outings/${outingId}/lodging-options`, `${result.offerId}:save`, { option: result })
                        }
                        disabled={mutatingKey === `${result.offerId}:save` || isSaved}
                      >
                        {isSaved ? "Saved to outing" : mutatingKey === `${result.offerId}:save` ? "Saving..." : "Save option"}
                      </Button>
                    ) : null}

                    {savedOption ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            mutateOption(
                              `/api/outings/${outingId}/lodging-options/${savedOption.id}/favorite`,
                              `${result.offerId}:favorite`
                            )
                          }
                          disabled={mutatingKey !== null}
                        >
                          {isFavorited ? "Unfavorite" : "Favorite"}
                        </Button>
                        {isOrganizer ? (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              mutateOption(
                                `/api/outings/${outingId}/lodging-options/${savedOption.id}/top-pick`,
                                `${result.offerId}:top-pick`
                              )
                            }
                            disabled={mutatingKey !== null}
                          >
                            {savedOption.topPick ? "Top pick" : "Make top pick"}
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}
