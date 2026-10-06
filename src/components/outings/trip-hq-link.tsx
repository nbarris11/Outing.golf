import Link from "next/link";

// Trip HQ can be shared while reservations are still being arranged.
// Its status is calculated from the saved itinerary and booking records.
export function TripHqLink({ outingId }: { outingId: string }) {
  return <Link href={`/outings/${outingId}/trip`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest-900 px-5 py-2 text-sm font-semibold text-cream">Open Trip HQ</Link>;
}
