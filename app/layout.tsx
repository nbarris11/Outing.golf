import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { ComingSoonGate } from "@/components/site-access/coming-soon-gate";
import { getPublicContentBlocks } from "@/lib/content";
import { isSiteAccessEnabled } from "@/lib/env";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant"
});

export const metadata: Metadata = {
  title: "Outing.golf",
  description: "Plan golf outings and golf trips without spreadsheet chaos."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("outing_site_access")?.value === "granted";
  const showGate = isSiteAccessEnabled && !hasAccess;
  const hasError = cookieStore.get("outing_site_access_error")?.value === "1";
  const contentBlocks = showGate ? await getPublicContentBlocks() : [];
  const siteAccessBlock = contentBlocks.find((block) => block.key === "site_access_gate");

  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        {showGate ? (
          <ComingSoonGate
            hasError={hasError}
            title={siteAccessBlock?.title}
            body={siteAccessBlock?.body}
          />
        ) : (
          children
        )}
      </body>
    </html>
  );
}
