import { PageShell } from "@/components/layout/page-shell";
import { PageLoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <PageShell>
      <PageLoadingSkeleton />
    </PageShell>
  );
}
