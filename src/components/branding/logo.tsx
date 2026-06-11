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
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900 text-cream shadow-[0_12px_30px_rgba(20,58,44,0.18)]">
        <svg viewBox="0 0 44 44" className="h-7 w-7" aria-hidden="true">
          <ellipse cx="22" cy="30" rx="11" ry="3.2" fill="#0a1812" />
          <rect x="21" y="10" width="2" height="20" rx="1" fill="#F7F4EE" />
          <path d="M23 11 L34 14 L23 17 Z" fill="#C8932E" />
        </svg>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="font-sans text-lg font-semibold tracking-[-0.03em]">
            Outing<span className="text-gold">.</span>golf
          </span>
        </span>
      ) : null}
    </Link>
  );
}
