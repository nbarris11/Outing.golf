import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { LogRocketInit } from "@/components/logrocket-init";
import { getCurrentProfile } from "@/lib/auth";
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
  metadataBase: new URL("https://www.outing.golf"),
  title: "Golf Trip Planner for Groups | Outing.golf",
  description:
    "Collect dates, budgets, and course votes from your group in one place. Outing.golf is the planning tool built for golf trip organizers.",
  openGraph: {
    title: "Golf Trip Planner for Groups | Outing.golf",
    description:
      "Collect dates, budgets, and course votes from your group in one place. Outing.golf is the planning tool built for golf trip organizers.",
    url: "https://www.outing.golf",
    siteName: "Outing.golf",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Golf Trip Planner for Groups | Outing.golf",
    description:
      "Collect dates, budgets, and course votes from your group in one place. Outing.golf is the planning tool built for golf trip organizers."
  }
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getCurrentProfile();
  const user = profile
    ? { id: profile.id, email: profile.email, name: profile.fullName }
    : null;

  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        <LogRocketInit user={user} />
        {children}
      </body>
    </html>
  );
}
