"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(119,143,113,0.18),transparent_32%),linear-gradient(180deg,#f7f4ee_0%,#f4f1ea_100%)] text-charcoal">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Something went wrong</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
              The outing is still safe. This page just needs another try.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-charcoal/68">
              We hit an unexpected issue while loading this view. Try again, and if it keeps happening,
              check your environment setup or seed state.
            </p>
            <div className="mt-8">
              <Button onClick={() => reset()}>Try again</Button>
            </div>
          </Card>
        </section>
      </body>
    </html>
  );
}
