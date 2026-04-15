import type { TeeTimeBooking } from "@/types/domain";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function formatTime(time: string) {
  // Handle both "HH:MM" (from <input type="time">) and already-formatted strings
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  }
  return time;
}

interface TripTeeTimesProps {
  bookings: TeeTimeBooking[];
}

export function TripTeeTimes({ bookings }: TripTeeTimesProps) {
  if (bookings.length === 0) return null;

  const sorted = [...bookings].sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.teeTime.localeCompare(b.teeTime);
  });

  // Group by date
  const byDate = sorted.reduce<Record<string, TeeTimeBooking[]>>((acc, b) => {
    (acc[b.date] ??= []).push(b);
    return acc;
  }, {});

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
      <h3 className="font-serif text-xl font-semibold text-forest-900">⛳ Tee times</h3>
      <div className="mt-4 space-y-5">
        {Object.entries(byDate).map(([date, times]) => (
          <div key={date}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">
              {formatDate(date)}
            </p>
            <div className="mt-2 space-y-2">
              {times.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start gap-4 rounded-[18px] bg-cream px-4 py-3"
                >
                  {/* Time pill */}
                  <div className="shrink-0 text-center">
                    <p className="text-lg font-bold tracking-tight text-forest-900 leading-none">
                      {formatTime(booking.teeTime)}
                    </p>
                    <p className="mt-1 text-[11px] text-charcoal/40">
                      {booking.players} players
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-px self-stretch bg-charcoal/8" />

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-charcoal leading-snug">{booking.courseName}</p>
                    {booking.confirmationNumber && (
                      <p className="mt-0.5 text-xs text-charcoal/50">
                        Confirmation: <span className="font-mono font-medium text-charcoal/70">{booking.confirmationNumber}</span>
                      </p>
                    )}
                    {booking.notes && (
                      <p className="mt-1 text-xs text-charcoal/50 italic">{booking.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
