import type { Metadata } from "next";
import { getDemoState } from "@/lib/demo/store";
import { isDemoMode } from "@/lib/env";
import { resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { InvitationPage } from "@/components/outings/invitation-page";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const outingId = await resolveOutingIdFromShareToken(token);

  if (!outingId) {
    return { title: "Join Outing · Outing.golf" };
  }

  const outing = isDemoMode
    ? (await getDemoState()).outings.find((item) => item.id === outingId)
    : await (async () => {
        const adminClient = createSupabaseAdminClient();
        if (!adminClient) return null;
        const { data } = await adminClient
          .from("outings")
          .select("name,destination_label")
          .eq("id", outingId)
          .maybeSingle();
        return data;
      })();

  if (!outing) return { title: "Join Outing · Outing.golf" };

  const title = `${outing.name} · Outing.golf`;
  const destination =
    "destinationLabel" in outing
      ? outing.destinationLabel
      : outing.destination_label;
  const description = `Join this golf trip${destination ? ` to ${destination}` : ""}. Preview the courses, dates, and cost, then let the group know if you can make it.`;
  const pageUrl = `https://www.outing.golf/join/${token}`;

  return {
    title,
    robots: { index: false, follow: false },
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Outing.golf",
      type: "website",
      images: [
        { url: `/join/${token}/opengraph-image`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/join/${token}/opengraph-image`],
    },
  };
}

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  return (
    <InvitationPage
      token={token}
      kind="join"
      error={(await searchParams).error}
    />
  );
}
