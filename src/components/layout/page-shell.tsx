import type { PropsWithChildren, ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export async function PageShell({
  children,
  inset,
  minimalHeader = false
}: PropsWithChildren<{ inset?: ReactNode; minimalHeader?: boolean }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(119,143,113,0.18),transparent_32%),linear-gradient(180deg,#f7f4ee_0%,#f4f1ea_100%)] text-charcoal">
      <SiteHeader minimal={minimalHeader} />
      {inset}
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
