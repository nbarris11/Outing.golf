// TODO: Neil — swap /founder/neil-placeholder.svg for /founder/neil.jpg (square, ≥280px, neutral bg)
// TODO: Neil — rewrite the body copy in your own voice. First-person, one anecdote, no marketing-speak.
export function FounderNote() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-charcoal/8 bg-cream p-8 sm:grid sm:grid-cols-[140px_1fr] sm:gap-8 sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/founder/neil-placeholder.svg"
          alt="Neil Barris, founder of Outing.golf"
          width={140}
          height={140}
          className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
        />
        <div className="mt-5 sm:mt-0">
          <p className="text-sm uppercase tracking-[0.22em] text-charcoal/50">From the desk of Neil</p>
          <p className="mt-4 font-serif text-xl leading-[1.5] text-charcoal/80">
            I built Outing.golf because I was the guy in the group text. Every spring, same routine — three
            threads, two spreadsheets, one passive-aggressive &ldquo;did everyone see my last message.&rdquo;
            I wanted one place. So I made it. If your group still books trips, you already know why this exists.
          </p>
          <p className="mt-4 font-serif italic text-charcoal/60">— Neil Barris, founder</p>
        </div>
      </div>
    </section>
  );
}
