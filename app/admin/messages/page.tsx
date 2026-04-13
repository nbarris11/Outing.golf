import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { isAdmin } from "@/modules/outings/permissions";
import { getAdminMessages } from "@/modules/admin/service";

export default async function AdminMessagesPage() {
  const profile = await requireProfile();

  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  const messages = await getAdminMessages();

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-charcoal/55 transition hover:text-charcoal"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Admin dashboard
          </Link>
        </div>

        <div className="mt-6 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Messages
          </h1>
          <p className="mt-3 text-base text-charcoal/68">
            {messages.length} message{messages.length !== 1 ? "s" : ""} (most recent first, max 200)
          </p>
        </div>

        <Card className="mt-8">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-charcoal/45">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="rounded-[20px] bg-cream p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal/40">
                        {msg.profileId}
                      </span>
                      <Link
                        href={`/outings/${msg.outingId}`}
                        className="text-xs text-forest-900 hover:underline"
                      >
                        View outing →
                      </Link>
                    </div>
                    <span className="text-xs text-charcoal/45">
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-charcoal">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
