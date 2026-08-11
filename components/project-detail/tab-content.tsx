"use client";

import { Protect } from "@clerk/nextjs";
import { ErrorRetryCard } from "./error-retry-card";
import { GenerateMissingCard } from "./generate-missing-card";
import { TabSkeleton } from "./tab-skeleton";
import { UpgradePrompt } from "./upgrade-prompt";
import type { Id } from "@/convex/_generated/dataModel";
import type { FeatureName } from "@/lib/tier-config";
import type { RetryableJob } from "@/app/actions/retry-job";

interface TabContentProps {
  isLoading: boolean;
  data: unknown;
  error?: string;
  children: React.ReactNode;
  projectId?: Id<"projects">;
  feature?: FeatureName;
  featureName?: string;
  jobName?: RetryableJob;
  emptyMessage?: string;
}

export function TabContent({
  isLoading,
  data,
  error,
  children,
  projectId,
  feature,
  featureName,
  jobName,
  emptyMessage = "No data available",
}: TabContentProps) {
  const wrapWithProtect = (content: React.ReactNode) => {
    if (!feature || !featureName) return content;

    return (
      <Protect
        feature={feature}
        fallback={
          <UpgradePrompt
            feature={featureName}
            featureKey={feature}
            currentPlan="free"
          />
        }
      >
        {content}
      </Protect>
    );
  };

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (!projectId || !jobName) {
    return <>{children}</>;
  }

  if (error) {
    return wrapWithProtect(
      <ErrorRetryCard
        projectId={projectId}
        job={jobName}
        errorMessage={error}
      />,
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return wrapWithProtect(
      <GenerateMissingCard projectId={projectId} message={emptyMessage} />,
    );
  }

  return wrapWithProtect(children);
}