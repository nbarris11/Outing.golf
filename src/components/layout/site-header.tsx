import Link from "next/link";

import { BrandLogo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { isAdmin } from "@/modules/outings/permissions";

export async function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/6 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <BrandLogo />
        {!minimal ? (
          <nav className="hidden items-center gap-6 text-sm text-charcoal/70 md:flex">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/dashboard">Dashboard</Link>
            {isAdmin(profile) ? <Link href="/admin">Admin</Link> : null}
          </nav>
        ) : null}
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {minimal ? (
                <Button href="/dashboard" variant="secondary">Open Dashboard</Button>
              ) : (
                <>
                  <Link href="/settings" className="hidden text-sm text-charcoal/70 sm:inline-flex">
                    {profile.fullName}
                  </Link>
                  {isDemoMode ? (
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
              {!minimal ? (
                <Link href="/sign-in" className="hidden text-sm text-charcoal/70 sm:inline-flex">
                  Sign in
                </Link>
              ) : null}
              <Button href="/sign-up">Start Planning Free</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
