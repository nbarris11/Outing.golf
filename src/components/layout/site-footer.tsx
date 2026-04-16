import Link from "next/link";

import { getPublicSiteSettings } from "@/lib/site-settings";

export async function SiteFooter() {
  const { siteProfile } = await getPublicSiteSettings();

  return (
    <footer className="border-t border-charcoal/6 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-charcoal/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-medium text-charcoal">{siteProfile.legalBusinessName}</p>
          <p>{siteProfile.footerTagline}</p>
          <p className="mt-2">
            Contact:{" "}
            <a className="text-forest-900" href={`mailto:${siteProfile.supportEmail}`}>
              {siteProfile.supportEmail}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/about">About</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/advertise">Advertise with us</Link>
          <Link href="/contact">Feedback &amp; questions</Link>
        </div>
      </div>
    </footer>
  );
}
