import type { LodgingOption } from "@/types/domain";
import { bookingAffiliateId } from "@/lib/env";

const AWIN_MID = "6776";

interface BookingContext {
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: number | null;
}

/**
 * Build an Awin-tracked Booking.com search link for a specific hotel.
 * Per Booking.com affiliate guidelines, the destination URL must NOT include
 * aid= or label= params — Awin injects those via the cread.php redirect.
 */
export function buildBookingComUrl(
  stay: Pick<LodgingOption, "name" | "city" | "state">,
  ctx: BookingContext = {}
): string {
  const dest = new URL("https://www.booking.com/searchresults.html");
  const ss = [stay.name, stay.city, stay.state].filter(Boolean).join(" ");
  dest.searchParams.set("ss", ss);
  if (ctx.checkIn) dest.searchParams.set("checkin", ctx.checkIn);
  if (ctx.checkOut) dest.searchParams.set("checkout", ctx.checkOut);
  if (ctx.guests) dest.searchParams.set("group_adults", String(ctx.guests));

  if (!bookingAffiliateId) return dest.toString();

  const affiliate = new URL("https://www.awin1.com/cread.php");
  affiliate.searchParams.set("awinmid", AWIN_MID);
  affiliate.searchParams.set("awinaffid", bookingAffiliateId);
  affiliate.searchParams.set("ued", dest.toString());
  return affiliate.toString();
}
