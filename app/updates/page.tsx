import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { releases } from "@/lib/releases";

export const metadata = buildMetadata({
  title: "What's new | Outing.golf",
  description: "The latest Outing.golf updates: easier course selection, day-by-day itineraries, clearer trip estimates, and booking tracking.",
  path: "/updates",
});

export default function UpdatesPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-forest-900">Outing.golf updates</p>
        <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em] text-charcoal sm:text-6xl">What’s new</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/65">Small improvements. Better golf trips. Here’s what we’ve been working on to make planning easier.</p>
        <div className="mt-10 space-y-10">
          {releases.map((release, index) => (
            <article key={release.id} id={release.id} aria-labelledby={`${release.id}-title`} className="scroll-mt-6 rounded-[28px] border border-charcoal/10 bg-white p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <time dateTime={release.date} className="text-charcoal/60">{release.dateLabel}</time>
                {index === 0 && <span className="rounded-full bg-forest-900/10 px-3 py-1 text-xs font-semibold text-forest-900">Latest release</span>}
                <Link href={`/updates#${release.id}`} aria-label={`Link to ${release.dateLabel} release`} className="ml-auto text-forest-900 underline underline-offset-4">Share this update</Link>
              </div>
              <h2 id={`${release.id}-title`} className="mt-5 font-serif text-3xl leading-tight tracking-[-0.03em] text-charcoal sm:text-4xl">{release.title}</h2>
              <p className="mt-4 leading-7 text-charcoal/65">{release.summary}</p>
              <div className="mt-8 space-y-7 border-t border-charcoal/10 pt-8">
                {release.highlights.map((item) => (
                  <section key={item.title}>
                    <h3 className="text-lg font-semibold text-charcoal">{item.title}</h3>
                    <p className="mt-2 leading-7 text-charcoal/70">{item.body}</p>
                  </section>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-charcoal/10 pt-6">
                <Button href="/dashboard">Try it on your next trip</Button>
                <Link href="/contact" className="text-sm font-medium text-forest-900 underline underline-offset-4">Tell us what could be better</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
