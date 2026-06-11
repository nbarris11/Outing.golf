"use client";

import type { PropsWithChildren } from "react";

import { useMe } from "@/components/auth/use-me";
import { Button } from "@/components/ui/button";

// CTA that routes signed-in organizers straight to trip creation without
// making the host page dynamic. Static HTML links to /sign-up; the href
// upgrades to /outings/new once the session probe resolves.
export function AuthCta({
  children,
  className,
  variant
}: PropsWithChildren<{ className?: string; variant?: "primary" | "secondary" | "ghost" }>) {
  const me = useMe();
  const href = me?.profile ? "/outings/new" : "/sign-up";

  return (
    <Button href={href} variant={variant} className={className}>
      {children}
    </Button>
  );
}

/** Renders children only for signed-out visitors (e.g. the sign-in hint). */
export function SignedOutOnly({ children }: PropsWithChildren) {
  const me = useMe();

  if (me?.profile) {
    return null;
  }

  return <>{children}</>;
}
