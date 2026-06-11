// TODO: Drop /demo/outing-golf-loop.webm (≤ 800KB) and /demo/outing-golf-loop.mp4 (≤ 1.2MB)
// into public/demo/. Until then, this component shows the poster placeholder only.
//
// Recording spec (Cleanshot X, Loom, or QuickTime + Handbrake):
//   0–3s   Organizer creates an outing
//   3–6s   Invite link sent → first response comes in
//   6–9s   Group responses arrive → overlap view
//   9–12s  Trip HQ assembles
export function DemoLoop() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-charcoal/8 bg-forest-950 shadow-[0_30px_90px_rgba(20,58,44,0.22)]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/demo/poster-placeholder.svg"
          className="block h-auto w-full motion-reduce:hidden"
          aria-label="Outing.golf in motion — creating an outing, inviting a group, watching responses come in, locking the trip."
        >
          <source src="/demo/outing-golf-loop.webm" type="video/webm" />
          <source src="/demo/outing-golf-loop.mp4" type="video/mp4" />
        </video>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/demo/poster-placeholder.svg"
          alt="Outing.golf in motion — preview"
          className="hidden h-auto w-full motion-reduce:block"
        />
      </div>
    </section>
  );
}
