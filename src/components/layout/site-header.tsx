"use client";

import Link from "next/link";

import { useMe } from "@/components/auth/use-me";
import { BrandLogo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

// Client component on purpose: reading the session via cookies() here would
// force every marketing page into dynamic rendering. The static HTML ships the
// signed-out header and upgrades after the /api/me probe resolves.
export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const me = useMe();
  const profile = me?.profile ?? null;
  const demoMode = me?.demoMode ?? false;

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/6 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <BrandLogo href={profile ? "/dashboard" : "/"} />
        {!minimal ? (
          <nav className="hidden items-center gap-6 text-sm text-charcoal/70 md:flex">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/sample-trip">Sample trip</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/dashboard">Dashboard</Link>
            {profile?.isAdmin ? <Link href="/admin">Admin</Link> : null}
          </nav>
        ) : null}
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {minimal ? (
                <>
                  <Button href="/dashboard" variant="secondary">Open Dashboard</Button>
                  {demoMode ? (
                    <form action="/api/demo/auth/sign-out" method="post">
                      <Button variant="ghost" className="text-sm text-charcoal/60 hover:text-charcoal">Sign out</Button>
                    </form>
                  ) : (
                    <form action={signOutAction}>
                      <Button variant="ghost" className="text-sm text-charcoal/60 hover:text-charcoal">Sign out</Button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <Link href="/settings" className="hidden text-sm text-charcoal/70 sm:inline-flex">
                    {profile.fullName}
                  </Link>
                  {demoMode ? (
                    <form action="/api/demo/auth/sign-out" method="post">
                      <Button variant="secondary">Sign out</Button>
                    </form>
                  ) : (
                    <form action={signOutAction}>
                      <Button variant="secondary">Sign out</Button>
                    </form>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hidden text-sm text-charcoal/70 sm:inline-flex hover:text-charcoal">
                Sign in
              </Link>
              <Button href="/sign-up">Start Planning Free</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
