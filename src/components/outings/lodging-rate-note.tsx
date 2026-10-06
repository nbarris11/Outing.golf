import type { LodgingOption } from "@/types/domain";
import { rateFreshness } from "@/lib/rate-freshness";
export function LodgingRateNote({ stay, start, end }: { stay: LodgingOption; start?: string; end?: string }) {
  const needsRecheck = stay.providerKey === "liteapi" && !stay.tags.includes("rate-basis:room-night");
  const rate = rateFreshness(stay, start, end);
  return <div className="mt-2 text-xs text-charcoal/60">
    {needsRecheck && <p className="font-medium text-amber-800">This older estimate needs a new quote. It is excluded from your total until refreshed.</p>}
    <p>{rate.checkedAt ? `Rate checked ${new Date(rate.checkedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" })} UTC.` : "Saved estimate · last rate check unknown."} Prices and availability can change. Recheck after changing room occupancy.</p>
    {rate.datesMismatch && <p className="mt-1 font-medium text-amber-800">This quote is for different dates. Check a new rate before budgeting or booking.</p>}
    <a className="mt-1 inline-block underline" target="_blank" rel="noopener noreferrer" href={`https://www.booking.com/searchresults.html?${new URLSearchParams({ss: stay.name, ...(start && end ? {checkin:start,checkout:end} : {})})}`}>Check current hotel rates ↗</a>
  </div>;
}
