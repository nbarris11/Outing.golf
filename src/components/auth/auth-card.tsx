import Link from "next/link";

import { Card } from "@/components/ui/card";

export function AuthCard({
  title,
  subtitle,
  helper,
  children
}: {
  title: string;
  subtitle: string;
  helper: { label: string; href: string; text: string };
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Access Outing.golf</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-charcoal/68">{subtitle}</p>
        <div className="mt-8 rounded-[28px] bg-forest-900 p-6 text-cream">
          <p className="text-sm text-cream/70">Demo accounts</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-cream/78">
            <p>`host@outing.golf` for organizer flow</p>
            <p>`friend@outing.golf` for invitee flow</p>
            <p>`admin@outing.golf` for admin dashboard</p>
          </div>
        </div>
      </div>
      <Card className="mx-auto w-full max-w-xl p-8">
        {children}
        <p className="mt-6 text-sm text-charcoal/60">
          {helper.text}{" "}
          <Link href={helper.href} className="font-medium text-forest-900">
            {helper.label}
          </Link>
        </p>
      </Card>
    </div>
  );
}
