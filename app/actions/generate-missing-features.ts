"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import type { Id } from "@/convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { PLAN_FEATURES, FEATURE_TO_JOB_MAP } from "@/lib/tier-config";
import type { RetryableJob } from "./retry-job";

export async function generateMissingFeatures(projectId: Id<"projects">) {
  const authObj = await auth();
  const { userId, has } = authObj;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let currentPlan: "free" | "pro" | "ultra" = "free";
  if (has?.({ plan: "ultra" })) {
    currentPlan = "ultra";
  } else if (has?.({ plan: "pro" })) {
    currentPlan = "pro";
  }

  const project = await convex.query(api.projects.getProject, { projectId });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.userId !== userId) {
    throw new Error("Unauthorized - not your project");
  }

  let originalPlan: "free" | "pro" | "ultra" = "free";
  if (project.keyMoments || project.youtubeTimestamps) {
    originalPlan = "ultra";
  } else if (project.socialPosts || project.titles || project.hashtags) {
    originalPlan = "pro";
  }

  const availableFeatures = PLAN_FEATURES[currentPlan];

  const missingJobs: RetryableJob[] = [];

  for (const feature of availableFeatures) {
    const jobName =
      FEATURE_TO_JOB_MAP[feature as keyof typeof FEATURE_TO_JOB_MAP];
    if (!jobName) continue; 

    const hasData = Boolean(project[jobName as keyof typeof project]);

    if (!hasData) {
      missingJobs.push(jobName as RetryableJob);
    }
  }

  if (missingJobs.length === 0) {
    throw new Error(
      "No missing features to generate. All features for your plan are already available."
    );
  }

  await Promise.all(
    missingJobs.map((job) =>
      inngest.send({
        name: "podcast/retry-job",
        data: {
          projectId,
          job,
          userId,
          originalPlan,
          currentPlan,
        },
      })
    )
  );

  return {
    success: true,
    generated: missingJobs,
    message: `Generating ${missingJobs.length} feature${
      missingJobs.length > 1 ? "s" : ""
    }: ${missingJobs.join(", ")}`,
  };
}