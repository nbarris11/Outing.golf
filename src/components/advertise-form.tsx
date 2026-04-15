"use client";

import { useActionState } from "react";

import { sendAdvertiseInquiry } from "@/lib/actions/contact";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState = { success: false, error: undefined as string | undefined };

export function AdvertiseForm() {
  const [state, action] = useActionState(sendAdvertiseInquiry, initialState);

  if (state.success) {
    return (
      <div className="mt-10 rounded-2xl border border-forest-600/20 bg-forest-50 px-6 py-8 text-forest-900">
        <p className="font-medium">Inquiry received!</p>
        <p className="mt-1 text-sm text-forest-900/70">Thanks for reaching out — we&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-10 flex flex-col gap-5">
      {state.error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <FieldLabel htmlFor="name">Your name</FieldLabel>
        <Input id="name" name="name" type="text" placeholder="First and last name" required />
      </div>
      <div>
        <FieldLabel htmlFor="organization">Organization</FieldLabel>
        <Input id="organization" name="organization" type="text" placeholder="Company or brand name" required />
      </div>
      <div>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div>
        <FieldLabel htmlFor="website">Website</FieldLabel>
        <Input id="website" name="website" type="url" placeholder="https://yoursite.com" />
      </div>
      <div>
        <FieldLabel htmlFor="message">Tell us about your goals</FieldLabel>
        <Textarea
          id="message"
          name="message"
          placeholder="What are you looking to promote, and who are you trying to reach?"
          required
        />
      </div>
      <SubmitButton label="Send inquiry" pendingLabel="Sending..." />
    </form>
  );
}
