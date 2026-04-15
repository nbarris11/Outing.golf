"use client";

import { useActionState } from "react";

import { sendContactMessage } from "@/lib/actions/contact";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState = { success: false, error: undefined as string | undefined };

export function ContactForm() {
  const [state, action] = useActionState(sendContactMessage, initialState);

  if (state.success) {
    return (
      <div className="mt-10 rounded-2xl border border-forest-600/20 bg-forest-50 px-6 py-8 text-forest-900">
        <p className="font-medium">Message sent!</p>
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
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" name="name" type="text" placeholder="Your name" required />
      </div>
      <div>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea id="message" name="message" placeholder="Your feedback or question..." required />
      </div>
      <SubmitButton label="Send message" pendingLabel="Sending..." />
    </form>
  );
}
