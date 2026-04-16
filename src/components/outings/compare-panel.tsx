"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currency } from "@/lib/utils";
import type { GolfCourseOption, LodgingOption } from "@/types/domain";

type CourseWithScore = GolfCourseOption & { fitScore: number };
type LodgingWithScore = LodgingOption & { fitScore: number };

export function ComparePanel({
  courses,
  lodging,
  nights,
  players,
  roundsPerPlayer
}: {
  courses: CourseWithScore[];
  lodging: LodgingWithScore[];
  nights: number;
  players: number;
  roundsPerPlayer: number;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    courses[0]?.id ?? null
  );
  const [selectedLodgingId, setSelectedLodgingId] = useState<string | null>(
    lodging[0]?.id ?? null
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;
  const selectedLodging = lodging.find((l) => l.id === selectedLodgingId) ?? null;

  const golfCostPerPerson = selectedCourse
    ? selectedCourse.averageGreensFee * roundsPerPlayer
    : 0;
  const lodgingTotal = selectedLodging
    ? (selectedLodging.priceTotal ?? selectedLodging.nightlyRate * nights)
    : 0;
  const lodgingCostPerPerson = Math.round(lodgingTotal / players);
  const totalPerPerson = golfCostPerPerson + lodgingCostPerPerson;

  const hasBothSelected = selectedCourse && selectedLodging;

  return (
    <div className="space-y-6">
      {/* ── Cost summary ── */}
      {hasBothSelected && (
        <div className="rounded-[28px] bg-forest-950 px-6 py-5 text-cream">
          <p className="text-sm uppercase tracking-[0.22em] text-cream/50">Estimated cost per person</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-cream/50">Golf ({roundsPerPlayer} rounds)</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{currency(golfCostPerPerson)}</p>
            </div>
            <div>
              <p className="text-xs text-cream/50">Lodging ({nights} nights ÷ {players})</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{currency(lodgingCostPerPerson)}</p>
            </div>
            <div className="rounded-[18px] bg-white/10 px-4 py-3">
              <p className="text-xs text-cream/50">Total per person</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{currency(totalPerPerson)}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-cream/40">
            {selectedCourse.name} · {selectedLodging.name}
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ── Golf courses ── */}
        <Card>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">⛳ Golf courses</h2>
              <p className="mt-1 text-sm text-charcoal/60">
                {roundsPerPlayer} rounds per player · {players} golfers
              </p>
            </div>
            <Badge>{courses.length} courses</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {courses.map((course) => {
              const isSelected = course.id === selectedCourseId;
              const golfPerPerson = course.averageGreensFee * roundsPerPlayer;
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
                  className={[
                    "w-full rounded-[24px] p-4 text-left transition-all",
                    isSelected
                      ? "bg-forest-950 text-cream ring-2 ring-forest-900"
                      : "bg-cream hover:bg-charcoal/5"
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={["font-medium", isSelected ? "text-cream" : "text-charcoal"].join(" ")}>
                          {course.name}
                        </p>
                        {isSelected && (
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-cream">
                            Selected ✓
                          </span>
                        )}
                      </div>
                      <p className={["text-sm", isSelected ? "text-cream/60" : "text-charcoal/60"].join(" ")}>
                        {course.locationLabel}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={["font-semibold", isSelected ? "text-cream" : "text-charcoal"].join(" ")}>
                        {currency(golfPerPerson)}
                        <span className={["ml-1 text-xs font-normal", isSelected ? "text-cream/50" : "text-charcoal/50"].join(" ")}>
                          /person
                        </span>
                      </p>
                      <p className={["text-xs", isSelected ? "text-cream/50" : "text-charcoal/45"].join(" ")}>
                        {course.fitScore} fit score
                      </p>
                    </div>
                  </div>
                  <div className={["mt-3 grid gap-3 sm:grid-cols-3 text-sm", isSelected ? "text-cream/70" : "text-charcoal/68"].join(" ")}>
                    <span>{currency(course.averageGreensFee)} × {roundsPerPlayer} rounds</span>
                    <span>{course.qualityScore}/100 quality</span>
                    <span>{course.walkingFriendly ? "Walking-friendly" : "Riding-first"}</span>
                  </div>
                  {course.summary && !course.summary.startsWith("Live course result") ? (
                    <p className={["mt-3 text-sm leading-6", isSelected ? "text-cream/60" : "text-charcoal/64"].join(" ")}>
                      {course.summary}
                    </p>
                  ) : null}
                </button>
              );
            })}
            {courses.length === 0 && (
              <p className="px-4 py-6 text-sm text-charcoal/50 text-center">No courses seeded yet.</p>
            )}
          </div>
        </Card>

        {/* ── Lodging ── */}
        <Card>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">🏨 Lodging options</h2>
              <p className="mt-1 text-sm text-charcoal/60">
                {nights} nights · split across {players} players
              </p>
            </div>
            <Badge>{lodging.length} stays</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {lodging.map((stay) => {
              const isSelected = stay.id === selectedLodgingId;
              const lodgingTotalCost = stay.priceTotal ?? stay.nightlyRate * nights;
              const perPerson = Math.round(lodgingTotalCost / players);
              return (
                <button
                  key={stay.id}
                  onClick={() => setSelectedLodgingId(isSelected ? null : stay.id)}
                  className={[
                    "w-full rounded-[24px] p-4 text-left transition-all",
                    isSelected
                      ? "bg-forest-950 text-cream ring-2 ring-forest-900"
                      : "bg-cream hover:bg-charcoal/5"
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={["font-medium", isSelected ? "text-cream" : "text-charcoal"].join(" ")}>
                          {stay.name}
                        </p>
                        {isSelected && (
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-cream">
                            Selected ✓
                          </span>
                        )}
                      </div>
                      <p className={["text-sm capitalize", isSelected ? "text-cream/60" : "text-charcoal/60"].join(" ")}>
                        {stay.lodgingType}{stay.topPick ? " · top pick" : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={["font-semibold", isSelected ? "text-cream" : "text-charcoal"].join(" ")}>
                        {currency(perPerson)}
                        <span className={["ml-1 text-xs font-normal", isSelected ? "text-cream/50" : "text-charcoal/50"].join(" ")}>
                          /person
                        </span>
                      </p>
                      <p className={["text-xs", isSelected ? "text-cream/50" : "text-charcoal/45"].join(" ")}>
                        {stay.fitScore} fit score
                      </p>
                    </div>
                  </div>
                  <div className={["mt-3 grid gap-3 sm:grid-cols-3 text-sm", isSelected ? "text-cream/70" : "text-charcoal/68"].join(" ")}>
                    <span>{currency(stay.nightlyRate)}/night × {nights} nights</span>
                    <span>Sleeps {stay.sleeps}</span>
                    <span>
                      {stay.refundable == null
                        ? stay.tags?.[0] ?? "Flexible"
                        : stay.refundable
                          ? "Refundable"
                          : "Non-refundable"}
                    </span>
                  </div>
                  {stay.summary ? (
                    <p className={["mt-3 text-sm leading-6", isSelected ? "text-cream/60" : "text-charcoal/64"].join(" ")}>
                      {stay.summary}
                    </p>
                  ) : null}
                </button>
              );
            })}
            {lodging.length === 0 && (
              <p className="px-4 py-6 text-sm text-charcoal/50 text-center">
                No lodging options saved yet. The organizer can add options via the search tool below.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
