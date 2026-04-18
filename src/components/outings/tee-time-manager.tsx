"use client";

import { useState, useTransition } from "react";
import type { TeeTimeBooking } from "@/types/domain";
import { Input, Textarea } from "@/components/ui/field";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

interface TeeTimeManagerProps {
  outingId: string;
  bookings: TeeTimeBooking[];
  addAction: (formData: FormData) => Promise<void>;
  deleteAction: (outingId: string, bookingId: string) => Promise<void>;
  // Suggested course names from existing options
  courseNames?: string[];
}

export function TeeTimeManager({
  outingId,
  bookings,
  addAction,
  deleteAction,
  courseNames = []
}: TeeTimeManagerProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      await addAction(formData);
      form.reset();
      setOpen(false);
    });
  }

  function handleDelete(bookingId: string) {
    setDeletingId(bookingId);
    startTransition(async () => {
      await deleteAction(outingId, bookingId);
      setDeletingId(null);
    });
  }

  const sorted = [...bookings].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="rounded-[22px] border border-charcoal/8 bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-charcoal">⛳ Tee times</p>
        {bookings.length > 0 && (
          <span className="text-xs text-charcoal/40">{bookings.length} booked</span>
        )}
      </div>

      {/* Existing bookings */}
      {sorted.length > 0 && (
        <div className="mt-3 space-y-2">
          {sorted.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start justify-between gap-2 rounded-[14px] bg-cream px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-charcoal truncate">{booking.courseName}</p>
                <p className="mt-0.5 text-[11px] text-charcoal/55">
                  {formatDate(booking.date)} · {booking.teeTime} · {booking.players} players
                </p>
                {booking.confirmationNumber && (
                  <p className="mt-0.5 text-[11px] text-charcoal/40">
                    Conf# {booking.confirmationNumber}
                  </p>
                )}
                {booking.notes && (
                  <p className="mt-0.5 text-[11px] text-charcoal/40 italic">{booking.notes}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(booking.id)}
                disabled={deletingId === booking.id}
                className="shrink-0 rounded-full px-2 py-0.5 text-[11px] text-charcoal/30 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
              >
                {deletingId === booking.id ? "…" : "×"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {open ? (
        <form onSubmit={handleAdd} className="mt-3 space-y-3 rounded-[18px] border border-charcoal/10 bg-cream/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/50">
            Add tee time
          </p>
          <input type="hidden" name="outingId" value={outingId} />

          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/65">Course *</label>
            {courseNames.length > 0 ? (
              <select
                name="courseName"
                required
                autoFocus
                defaultValue={courseNames.length === 1 ? courseNames[0] : ""}
                className="w-full rounded-[18px] border border-charcoal/15 bg-white px-4 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-800/20"
              >
                {courseNames.length > 1 && <option value="">Select a course…</option>}
                {courseNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            ) : (
              <Input name="courseName" placeholder="e.g. TPC Scottsdale" required autoFocus />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/65">Date *</label>
              <Input name="date" type="date" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/65">Tee time *</label>
              <Input name="teeTime" type="time" required />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/65">Players</label>
              <Input name="players" type="number" min="1" max="40" defaultValue={4} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/65">Confirmation #</label>
              <Input name="confirmationNumber" placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/65">Notes</label>
            <Textarea name="notes" placeholder="e.g. Meet at pro shop 30 min early" rows={2} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-1.5 text-xs text-charcoal/50 hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-forest-900 px-4 py-1.5 text-xs font-semibold text-cream hover:bg-forest-900/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving…" : "Save tee time"}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-charcoal/18 py-2.5 text-xs font-medium text-charcoal/45 transition-colors hover:border-charcoal/30 hover:text-charcoal/60"
        >
          + Add a tee time
        </button>
      )}
    </div>
  );
}
