import type { Metadata } from "next";
import Link from "next/link";

import { TripBoardingPass } from "@/components/trip/trip-boarding-pass";
import { TripCountdown } from "@/components/trip/trip-countdown";
import { TripLineup } from "@/components/trip/trip-lineup";
import { TripTeeTimes } from "@/components/trip/trip-tee-times";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sample Trip HQ · Outing.golf",
  description:
    "See what your group gets when the plan locks in. A fully populated Trip HQ — courses, schedule, packing list, countdown — in one shared view.",
  alternates: {
    canonical: "/sample-trip"
  },
  openGraph: {
    title: "Sample Trip HQ · Outing.golf",
    description: "See what your group gets when the plan locks in.",
    type: "website"
  }
};

// ── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_COURSES = [
  { name: "Caledonia Golf & Fish Club", scheduleDay: 1 },
  { name: "True Blue Golf Club", scheduleDay: 2 },
  { name: "Pawleys Plantation Golf & Country Club", scheduleDay: 3 }
];

const SAMPLE_TEE_TIMES = [
  {
    id: "tt1",
    courseName: "Caledonia Golf & Fish Club",
    date: "2026-06-12",
    teeTime: "8:00 AM",
    players: 4,
    confirmationNumber: "CAL-0612"
  },
  {
    id: "tt2",
    courseName: "True Blue Golf Club",
    date: "2026-06-13",
    teeTime: "8:30 AM",
    players: 4,
    confirmationNumber: "TB-0613"
  },
  {
    id: "tt3",
    courseName: "Pawleys Plantation Golf & Country Club",
    date: "2026-06-14",
    teeTime: "7:45 AM",
    players: 4
  }
];

const SAMPLE_MEMBERS = [
  { name: "Mike Reilly", email: "mike@example.com", role: "organizer" as const },
  { name: "Dave Kim", email: "dave@example.com", role: "participant" as const, homeCity: "Charlotte, NC" },
  { name: "Chris Murphy", email: "chris@example.com", role: "participant" as const, homeCity: "Atlanta, GA" },
  { name: "Jake Torres", email: "jake@example.com", role: "participant" as const, homeCity: "Nashville, TN" }
];

const SAMPLE_PACKING = [
  { personal: true, text: "Golf shoes (soft spikes required)" },
  { personal: true, text: "Rain gear — June showers are real" },
  { personal: false, text: "Cooler + snacks for the cart" },
  { personal: false, text: "Cash for bets + side games" },
  { personal: true, text: "Sunscreen (×2)" },
  { personal: false, text: "Group dinner reservation — Friday night" }
];

// ─────────────────────────────────────────────────────────────────────────────

export default function SampleTripPage() {
  return (
    <div className="min-h-screen bg-forest-900">
      {/* Sample banner */}
      <div className="bg-white/10 px-4 py-3 text-center text-sm text-cream/80 sm:px-6">
        This is a sample Trip HQ — the view your whole group gets once the plan is locked.{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-cream underline-offset-2 hover:underline"
        >
          Start your own Trip HQ →
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-14 pb-14 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #f7f4ee 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cream/45">
            trip confirmed
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-cream sm:text-7xl">
            Myrtle Beach 2026
          </h1>
          <p className="mt-3 text-lg text-cream/65">Myrtle Beach, South Carolina</p>
          <TripCountdown targetDate="2026-06-12" />
        </div>
      </section>

      {/* Content */}
      <div className="rounded-t-[40px] bg-cream min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

          <TripBoardingPass
            outingName="Myrtle Beach 2026"
            destination="Myrtle Beach, SC"
            startDate="2026-06-12"
            endDate="2026-06-15"
            courses={SAMPLE_COURSES}
            lodgingName="Ocean Creek Resort"
            playerCount={4}
            memberNames={SAMPLE_MEMBERS.map((m) => m.name.split(" ")[0])}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Static packing list */}
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold text-forest-900">Packing list</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  4 of 6 packed ✓
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {SAMPLE_PACKING.map((item, i) => (
                  <li
                    key={item.text}
                    className={[
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm",
                      i < 4 ? "bg-cream line-through text-charcoal/40" : "bg-cream text-charcoal/72"
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-4 w-4 shrink-0 rounded-full border-2",
                        i < 4 ? "border-emerald-400 bg-emerald-400" : "border-charcoal/20 bg-white"
                      ].join(" ")}
                    />
                    <span>{item.text}</span>
                    {item.personal && (
                      <span className="ml-auto rounded-full bg-charcoal/6 px-2 py-0.5 text-xs text-charcoal/40">
                        personal
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <TripLineup members={SAMPLE_MEMBERS} />
              <TripTeeTimes bookings={SAMPLE_TEE_TIMES} />

              {/* Quick links preview */}
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
                <h3 className="font-serif text-xl font-semibold text-forest-900">Quick links</h3>
                <ul className="mt-4 space-y-2">
                  {[
                    { icon: "🌤", label: "10-day forecast for Myrtle Beach" },
                    { icon: "⛳", label: "Directions to Caledonia Golf & Fish Club" },
                    { icon: "🍺", label: "Bars & restaurants near Ocean Creek Resort" },
                    { icon: "🚗", label: "Uber to True Blue Golf Club" }
                  ].map((link) => (
                    <li
                      key={link.label}
                      className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal/60"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-[28px] bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] p-8 text-center text-cream">
            <p className="text-sm uppercase tracking-[0.25em] text-cream/55">Ready to build yours?</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">
              Your group deserves a real Trip HQ
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-cream/68">
              Collect dates, budgets, and votes from your group — then lock in the plan and share a Trip HQ like this one.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button href="/sign-up" className="bg-cream text-charcoal hover:bg-white">
                Start planning free
              </Button>
              <Button href="/how-it-works" variant="ghost" className="text-cream/80 hover:text-cream">
                See how it works
              </Button>
            </div>
          </div>

          <div className="mt-12 pb-8" />
        </div>
      </div>
    </div>
  );
}
