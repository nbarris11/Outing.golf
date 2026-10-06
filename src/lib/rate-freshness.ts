import type { LodgingOption } from "@/types/domain";
export function rateFreshness(stay: Pick<LodgingOption, "tags" | "checkIn" | "checkOut">, start?: string, end?: string) {
  const raw = stay.tags.find(t => t.startsWith("rate-checked:"))?.slice(13);
  const date = raw && Number.isFinite(Date.parse(raw)) ? raw : null;
  const quotedStart = stay.checkIn ?? stay.tags.find(t => t.startsWith("rate-start:"))?.slice(11);
  const quotedEnd = stay.checkOut ?? stay.tags.find(t => t.startsWith("rate-end:"))?.slice(9);
  return {
    checkedAt: date,
    datesMismatch: Boolean(start && end && quotedStart && quotedEnd && (start !== quotedStart || end !== quotedEnd)),
  };
}
