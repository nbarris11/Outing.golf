export function ComingSoonGate({
  hasError = false,
  title,
  body
}: {
  hasError?: boolean;
  title?: string;
  body?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(119,143,113,0.18),transparent_32%),linear-gradient(180deg,#f7f4ee_0%,#f4f1ea_100%)] px-4 text-charcoal">
      <div className="w-full max-w-xl rounded-[32px] border border-charcoal/10 bg-white/95 p-8 shadow-[0_24px_80px_rgba(33,36,35,0.10)] backdrop-blur">
        <p className="text-sm uppercase tracking-[0.24em] text-charcoal/45">Outing.golf</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
          {title ?? "Website coming soon"}
        </h1>
        <p className="mt-4 text-base leading-7 text-charcoal/68">
          {body ??
            "We're still getting the public site ready. If you have private preview access, enter the password below."}
        </p>

        <form action="/api/site-access" method="post" className="mt-8 space-y-4">
          <input type="hidden" name="redirectTo" value="/" />
          <input
            name="password"
            type="password"
            placeholder="Private access password"
            className="w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 text-sm outline-none transition placeholder:text-charcoal/35 focus:border-forest-600"
            required
          />
          {hasError ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              That password didn&apos;t match. Try again.
            </p>
          ) : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-cream shadow-[0_18px_35px_rgba(20,58,44,0.18)] transition hover:bg-forest-800"
          >
            Enter site
          </button>
        </form>
      </div>
    </div>
  );
}
