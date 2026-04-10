import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Not found</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            This outing isn’t available to you
          </h1>
          <p className="mt-5 text-base leading-7 text-charcoal/68">
            The link may be wrong, the outing may have moved, or your account does not have access.
          </p>
          <Link href="/dashboard" className="mt-8 inline-flex">
            <Button>Return to dashboard</Button>
          </Link>
        </Card>
      </section>
    </PageShell>
  );
}
