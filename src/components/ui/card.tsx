import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-charcoal/8 bg-white/92 p-6 shadow-[0_20px_60px_rgba(33,36,35,0.06)] backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
