import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-sand px-3 py-1 text-xs font-medium text-charcoal/80",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
