export const metadata = { robots: { index: false, follow: false } };
import { InvitationPage } from "@/components/outings/invitation-page";
export default async function InvitePage({
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
      kind="invite"
      error={(await searchParams).error}
    />
  );
}
