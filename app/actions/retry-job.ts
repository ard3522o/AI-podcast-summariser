"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import type { Id } from "@/convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";

export type RetryableJob =
  | "keyMoments"
  | "summary"
  | "socialPosts"
  | "titles"
  | "hashtags"
  | "youtubeTimestamps";

export async function retryJob(projectId: Id<"projects">, job: RetryableJob) {
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

  let originalPlan: "free" | "pro" | "ultra" = "free";
  if (project.keyMoments || project.youtubeTimestamps) {
    originalPlan = "ultra";
  } else if (project.socialPosts || project.titles || project.hashtags) {
    originalPlan = "pro";
  }

  await inngest.send({
    name: "podcast/retry-job",
    data: {
      projectId,
      job,
      userId,
      originalPlan,
      currentPlan,
    },
  });

  return { success: true };
}