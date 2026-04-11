import Link from "next/link";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-forest-900 text-cream shadow-[0_18px_35px_rgba(20,58,44,0.18)] hover:bg-forest-800",
  secondary:
    "bg-cream text-charcoal ring-1 ring-charcoal/10 hover:bg-white",
  ghost: "bg-transparent text-charcoal hover:bg-charcoal/5"
};

const baseClasses = "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition";

export function Button({
  children,
  className,
  variant = "primary",
  href,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    href?: string;
  }
>) {
  const classes = cn(baseClasses, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
