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
  title: "Golf Trip Planner for Groups | Outing.golf",
  description:
    "Outing.golf is a golf trip planner that helps organizers collect budgets, dates, course preferences, lodging preferences, and group input in one place so trips get planned faster."
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
