import type { GolfCourseOption, LodgingOption } from "@/types/domain";
import { courseRoundDays } from "@/lib/trip-plan";
import { CoursePriceEditor } from "./course-price-editor";
import { LodgingRateNote } from "./lodging-rate-note";
export function TripPricesPanel({ outingId, courses, lodging, editable, start, end }: { outingId: string; courses: GolfCourseOption[]; lodging: LodgingOption | null; editable: boolean; start?: string; end?: string }) {
  const selected = courses.filter(c => c.featured && !c.hidden);
  const missing = selected.filter(c => c.averageGreensFee <= 0);
  if (!selected.length && !lodging) return null;
  return <details id="trip-prices" open={editable && missing.length > 0} className="mt-5 scroll-mt-24 rounded-2xl border border-charcoal/10 bg-white p-5">
    <summary className="cursor-pointer font-semibold">{missing.length ? `Complete your estimate · ${missing.length} course prices needed` : "Prices and rate checks"}</summary>
    <p className="mt-2 text-sm text-charcoal/65">Enter the price per golfer, per round. Repeated rounds use the same estimate. Confirm taxes, cart fees, and your travel dates with the course.</p>
    <div className="mt-3 divide-y divide-charcoal/10">{selected.map(course => <div key={course.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div><h3 className="text-sm font-semibold">{course.name}</h3><p className="text-xs text-charcoal/60">{courseRoundDays(course).length} round(s) · {course.averageGreensFee > 0 ? `$${course.averageGreensFee}/golfer/round` : "Not included in the total yet"}</p><a className="text-xs underline" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/search?q=${encodeURIComponent(`${course.name} ${course.locationLabel} greens fees ${start ?? ""}`)}`}>Check course rates ↗</a></div>
      {editable && <CoursePriceEditor courseId={course.id} outingId={outingId} currentPrice={course.averageGreensFee} initiallyEditing={course.averageGreensFee <= 0} />}
    </div>)}</div>
    {lodging && <div className="mt-3 border-t border-charcoal/10 pt-3"><h3 className="text-sm font-semibold">{lodging.name}</h3><LodgingRateNote stay={lodging} start={start} end={end} /></div>}
  </details>;
}
