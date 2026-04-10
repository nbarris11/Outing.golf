import Link from "next/link";

import { Button } from "@/components/ui/button";
import { deploymentUrl, environmentLabel, isPreviewEnvironment, isProductionEnvironment } from "@/lib/env";

export function EnvironmentBanner() {
  if (isProductionEnvironment) {
    return null;
  }

  return (
    <div className="border-b border-charcoal/8 bg-sand/55">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm text-charcoal/78 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="font-medium text-charcoal">
            {isPreviewEnvironment ? "QA preview is live." : "Local QA screen is ready."}
          </p>
          <p>
            {environmentLabel} environment at{" "}
            <a href={deploymentUrl} className="underline decoration-charcoal/25 underline-offset-4">
              {deploymentUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>
        <Link href="/qa" className="sm:self-center">
          <Button variant="secondary" className="w-full sm:w-auto">
            Open QA screen
          </Button>
        </Link>
      </div>
    </div>
  );
}
