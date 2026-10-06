"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";

const likelihoodOptions = ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"];

export function FeedbackForm() {
  const submissionId = useRef<string | null>(null);
  const [willingToTalk, setWillingToTalk] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    submissionId.current ??= crypto.randomUUID();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: submissionId.current,
          rating: Number(fields.get("rating")),
          likedMost: fields.get("likedMost"),
          frustrations: fields.get("frustrations"),
          requestedChange: fields.get("requestedChange"),
          likelihoodToReturn: fields.get("likelihoodToReturn"),
          additionalComments: fields.get("additionalComments"),
          willingToTalk: fields.get("willingToTalk") === "yes",
          contactEmail: willingToTalk === true ? fields.get("contactEmail") : "",
          website: fields.get("website")
        })
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Feedback could not be saved. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Feedback could not be saved. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="mt-10 rounded-2xl border border-forest-600/20 bg-forest-50 px-6 py-8 text-forest-900">
        <h2 className="font-serif text-3xl font-semibold">Thank you!</h2>
        <p className="mt-3 leading-7 text-forest-900/75">
          Your feedback was submitted. We really appreciate you taking the time to help us make the site better.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-7">
      {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-charcoal">Overall, how would you rate your experience? <span aria-hidden="true">*</span></legend>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <label key={value} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="rating" value={value} required />
              <span className="flex h-11 items-center justify-center rounded-xl border border-charcoal/15 bg-cream text-sm font-medium transition hover:border-forest-600 peer-checked:border-forest-900 peer-checked:bg-forest-900 peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest-900">{value}</span>
              <span className="sr-only">{value} out of 10</span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-charcoal/55"><span>Not great</span><span>Excellent</span></div>
      </fieldset>

      <div>
        <FieldLabel htmlFor="likedMost">What do you like most about the site?</FieldLabel>
        <Textarea id="likedMost" name="likedMost" maxLength={2000} rows={3} className="min-h-24" />
      </div>
      <div>
        <FieldLabel htmlFor="frustrations">Was there anything confusing, frustrating, or difficult to use?</FieldLabel>
        <Textarea id="frustrations" name="frustrations" maxLength={2000} rows={3} className="min-h-24" />
      </div>
      <div>
        <FieldLabel htmlFor="requestedChange">If you could add or change ONE thing, what would it be? *</FieldLabel>
        <Textarea id="requestedChange" name="requestedChange" maxLength={2000} rows={3} className="min-h-24" required />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-charcoal">How likely are you to use the site again? <span aria-hidden="true">*</span></legend>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {likelihoodOptions.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/80">
              <input type="radio" name="likelihoodToReturn" value={option} required className="accent-forest-900" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <FieldLabel htmlFor="additionalComments">Anything else you&apos;d like us to know?</FieldLabel>
        <Textarea id="additionalComments" name="additionalComments" maxLength={2000} rows={3} className="min-h-24" />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-charcoal">Would you be open to a quick 15-minute conversation about your experience? <span aria-hidden="true">*</span></legend>
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="radio" name="willingToTalk" value="yes" required checked={willingToTalk === true} onChange={() => setWillingToTalk(true)} className="accent-forest-900" />Yes</label>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="radio" name="willingToTalk" value="no" required checked={willingToTalk === false} onChange={() => setWillingToTalk(false)} className="accent-forest-900" />No</label>
        </div>
      </fieldset>

      {willingToTalk === true && (
        <div>
          <FieldLabel htmlFor="contactEmail">Email address (optional)</FieldLabel>
          <Input id="contactEmail" name="contactEmail" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" />
        </div>
      )}

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
