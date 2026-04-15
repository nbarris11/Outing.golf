"use client";

import { useState, useTransition } from "react";
import { Input, Select } from "@/components/ui/field";

// ─── Destination ─────────────────────────────────────────────────────────────

interface AddDestinationFormProps {
  outingId: string;
  addAction: (formData: FormData) => Promise<void>;
}

export function AddDestinationForm({ outingId, addAction }: AddDestinationFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addAction(formData);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-charcoal/18 py-2.5 text-xs font-medium text-charcoal/45 transition-colors hover:border-charcoal/30 hover:text-charcoal/60"
      >
        + Add a destination option
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-[18px] border border-charcoal/12 bg-cream p-4 space-y-3">
      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-[0.15em]">Add destination</p>
      <input type="hidden" name="outingId" value={outingId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-charcoal/70">City / destination *</label>
          <Input name="name" placeholder="e.g. Scottsdale, AZ" required autoFocus />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-charcoal/70">Region / state</label>
          <Input name="region" placeholder="e.g. Southwest" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
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
          {isPending ? "Adding…" : "Add destination"}
        </button>
      </div>
    </form>
  );
}

// ─── Golf course ──────────────────────────────────────────────────────────────

interface AddGolfCourseFormProps {
  outingId: string;
  destinationOptionId: string;
  addAction: (formData: FormData) => Promise<void>;
}

export function AddGolfCourseForm({ outingId, destinationOptionId, addAction }: AddGolfCourseFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addAction(formData);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-charcoal/18 py-2.5 text-xs font-medium text-charcoal/45 transition-colors hover:border-charcoal/30 hover:text-charcoal/60"
      >
        + Add a golf course
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-[18px] border border-charcoal/12 bg-cream p-4 space-y-3">
      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-[0.15em]">Add golf course</p>
      <input type="hidden" name="outingId" value={outingId} />
      <input type="hidden" name="destinationOptionId" value={destinationOptionId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-charcoal/70">Course name *</label>
          <Input name="name" placeholder="e.g. TPC Scottsdale" required autoFocus />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-charcoal/70">City / location</label>
          <Input name="locationLabel" placeholder="e.g. Scottsdale, AZ" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-charcoal/70">Greens fee per round (approx. $)</label>
        <Input name="averageGreensFee" type="number" min="0" max="1000" placeholder="150" />
      </div>
      <div className="flex items-center justify-end gap-2">
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
          {isPending ? "Adding…" : "Add course"}
        </button>
      </div>
    </form>
  );
}

// ─── Lodging ─────────────────────────────────────────────────────────────────

interface AddLodgingFormProps {
  outingId: string;
  destinationOptionId: string;
  defaultSleeps: number;
  addAction: (formData: FormData) => Promise<void>;
}

export function AddLodgingForm({ outingId, destinationOptionId, defaultSleeps, addAction }: AddLodgingFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addAction(formData);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-charcoal/18 py-2.5 text-xs font-medium text-charcoal/45 transition-colors hover:border-charcoal/30 hover:text-charcoal/60"
      >
        + Add a lodging option
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-[18px] border border-charcoal/12 bg-cream p-4 space-y-3">
      <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-[0.15em]">Add lodging</p>
      <input type="hidden" name="outingId" value={outingId} />
      <input type="hidden" name="destinationOptionId" value={destinationOptionId} />
      <input type="hidden" name="sleeps" value={defaultSleeps} />
      <div>
        <label className="mb-1 block text-xs font-medium text-charcoal/70">Property name *</label>
        <Input name="name" placeholder="e.g. Hyatt Regency Scottsdale" required autoFocus />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-charcoal/70">Type</label>
          <Select name="lodgingType" defaultValue="hotel">
            <option value="hotel">Hotel</option>
            <option value="resort">Resort</option>
            <option value="house">House / rental</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-charcoal/70">Nightly rate (approx. $)</label>
          <Input name="nightlyRate" type="number" min="0" max="10000" placeholder="200" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
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
          {isPending ? "Adding…" : "Add lodging"}
        </button>
      </div>
    </form>
  );
}
