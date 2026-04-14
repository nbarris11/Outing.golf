import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  compact = false,
  href = "/"
}: {
  className?: string;
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3 text-charcoal", className)}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-forest-900/15 bg-forest-900 text-cream shadow-[0_12px_30px_rgba(20,58,44,0.18)]">
        <span className="font-serif text-xl font-semibold italic">O</span>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="font-sans text-lg font-semibold tracking-[-0.03em]">Outing.golf</span>
          <span className="text-xs text-charcoal/58">Clean planning for golf groups</span>
        </span>
      ) : null}
    </Link>
  );
}
