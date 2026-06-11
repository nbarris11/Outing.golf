import Link from "next/link";

// E-E-A-T signal block for guide and destination pages: a named human author
// and a visible freshness date, matching the Article schema on the same page.
export function ArticleByline({ updated = "June 2026" }: { updated?: string }) {
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-charcoal/55">
      <span>
        By{" "}
        <Link href="/about" className="font-medium text-forest-900 underline-offset-2 hover:underline">
          Neil Barris
        </Link>
        , founder of Outing.golf
      </span>
      <span aria-hidden="true">·</span>
      <span>Last updated: {updated}</span>
    </p>
  );
}
