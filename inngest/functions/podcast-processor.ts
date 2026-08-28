import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import type { PlanName } from "@/lib/tier-config";
import { generateHashtags } from "../steps/ai-generation/hashtags";
import { generateKeyMoments } from "../steps/ai-generation/key-moments";
import { generateSocialPosts } from "../steps/ai-generation/social-posts";
import { generateSummary } from "../steps/ai-generation/summary";
import { generateTitles } from "../steps/ai-generation/titles";
import { generateYouTubeTimestamps } from "../steps/ai-generation/youtube-timestamps";
import { saveResultsToConvex } from "../steps/persistence/save-to-convex";
import { transcribeWithAssemblyAI } from "../steps/transcription/assemblyai";

export const podcastProcessor = inngest.createFunction(
  {
    id: "podcast-processor",
    optimizeParallelism: true,
    retries: 3,
  },
  { event: "podcast/uploaded" },
  async ({ event, step }) => {
    const { projectId, fileUrl, plan: userPlan } = event.data;
    const plan = (userPlan as PlanName) || "free";

    console.log(`[Inngest] Processing project ${projectId} for ${plan} plan`);
    console.log(`[Inngest] File URL: ${event.data.fileUrl}`);
    console.log(`[Inngest] User ID: ${event.data.userId}`);

    try {
      console.log("[Inngest] Step 1: Updating status to processing...");
      await step.run("update-status-processing", async () => {
        await convex.mutation(api.projects.updateProjectStatus, {
          projectId,
          status: "processing",
        });
      });

      console.log("[Inngest] Step 2: Setting transcription to running...");
      await step.run("update-job-status-transcription-running", async () => {
        await convex.mutation(api.projects.updateJobStatus, {
          projectId,
          transcription: "running",
        });
      });

      console.log("[Inngest] Step 3: Starting transcription...");
      const transcript = await step.run("transcribe-audio", () =>
        transcribeWithAssemblyAI(fileUrl, projectId, plan),
      );
      console.log(`[Inngest] Transcription completed. Text length: ${transcript.text?.length || 0}`);

      console.log("[Inngest] Step 4: Marking transcription completed...");
      await step.run("update-job-status-transcription-completed", async () => {
        await convex.mutation(api.projects.updateJobStatus, {
          projectId,
          transcription: "completed",
        });
      });

      console.log("[Inngest] Step 5: Starting AI content generation...");
      await step.run("update-job-status-generation-running", async () => {
        await convex.mutation(api.projects.updateJobStatus, {
          projectId,
          contentGeneration: "running",
        });
      });

      const jobs: Promise<any>[] = [];
      const jobNames: string[] = [];

      jobs.push(generateSummary(step, transcript));
      jobNames.push("summary");

      if (plan === "pro" || plan === "ultra") {
        jobs.push(generateSocialPosts(step, transcript));
        jobNames.push("socialPosts");

        jobs.push(generateTitles(step, transcript));
        jobNames.push("titles");

        jobs.push(generateHashtags(step, transcript));
        jobNames.push("hashtags");
      } else {
        console.log(`Skipping social posts, titles, hashtags for ${plan} plan`);
      }

      if (plan === "ultra") {
        jobs.push(generateKeyMoments(transcript));
        jobNames.push("keyMoments");

        jobs.push(generateYouTubeTimestamps(step, transcript));
        jobNames.push("youtubeTimestamps");
      } else {
        console.log(
          `Skipping key moments and YouTube timestamps for ${plan} plan`,
        );
      }

      console.log(`[Inngest] Running ${jobs.length} AI jobs in parallel...`);
      const results = await Promise.allSettled(jobs);
      console.log("[Inngest] AI jobs completed");

      const generatedContent: Record<string, any> = {};

      results.forEach((result, idx) => {
        const jobName = jobNames[idx];
        if (result.status === "fulfilled") {
          generatedContent[jobName] = result.value;
        }
      });

      const jobErrors: Record<string, string> = {};

      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          const jobName = jobNames[idx];
          const errorMessage =
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason);

          jobErrors[jobName] = errorMessage;
          console.error(`Failed to generate ${jobName}:`, result.reason);
        }
      });

      if (Object.keys(jobErrors).length > 0) {
        await step.run("save-job-errors", () =>
          convex.mutation(api.projects.saveJobErrors, {
            projectId,
            jobErrors,
          }),
        );
      }

      await step.run("update-job-status-generation-completed", async () => {
        await convex.mutation(api.projects.updateJobStatus, {
          projectId,
          contentGeneration: "completed",
        });
      });

      await step.run("save-results-to-convex", () =>
        saveResultsToConvex(projectId, generatedContent),
      );

      return { success: true, projectId, plan };
    } catch (error) {
      console.error("Podcast processing failed:", error);

      try {
        await convex.mutation(api.projects.recordError, {
          projectId,
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          step: "workflow",
          details: {
            stack: error instanceof Error ? error.stack : String(error),
          },
        });
      } catch (cleanupError) {
        console.error("Failed to update project status:", cleanupError);
      }

      throw error;
    }
  },
);
