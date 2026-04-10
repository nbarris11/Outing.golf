import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-charcoal/6 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-charcoal/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-medium text-charcoal">Outing.golf</p>
          <p>Plan golf trips without spreadsheets, group-text chaos, or budget confusion.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
