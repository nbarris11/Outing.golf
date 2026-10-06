import type { LodgingOption } from "@/types/domain";
import { rateFreshness } from "@/lib/rate-freshness";
export function LodgingRateNote({ stay, start, end }: { stay: LodgingOption; start?: string; end?: string }) {
  const rate = rateFreshness(stay, start, end);
  return <div className="mt-2 text-xs text-charcoal/60">
    <p>{rate.checkedAt ? `Rate checked ${new Date(rate.checkedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" })} UTC.` : "Saved estimate · last rate check unknown."} Prices and availability can change.</p>
    {rate.datesMismatch && <p className="mt-1 font-medium text-amber-800">This quote is for different dates. Check a new rate before budgeting or booking.</p>}
    <a className="mt-1 inline-block underline" target="_blank" rel="noopener noreferrer" href={`https://www.booking.com/searchresults.html?${new URLSearchParams({ss: stay.name, ...(start && end ? {checkin:start,checkout:end} : {})})}`}>Check current hotel rates ↗</a>
  </div>;
}
