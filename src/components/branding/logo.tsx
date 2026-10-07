import Image from "next/image";
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
    <Link
      href={href}
      aria-label="Outing.golf home"
      className={cn("inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-900", className)}
    >
      <Image
        src={compact ? "/brand/outing-icon.svg?v=20261007" : "/brand/outing-logo.svg?v=20261007"}
        alt="Outing.golf"
        width={compact ? 64 : 487}
        height={compact ? 64 : 96}
        className={compact ? "h-11 w-11" : "h-auto w-[108px] min-[375px]:w-[144px] sm:w-[180px]"}
        unoptimized
      />
    </Link>
  );
}
