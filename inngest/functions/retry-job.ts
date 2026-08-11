import { api } from "@/convex/_generated/api";
import { convex } from "@/lib/convex-client";
import type { PlanName, FeatureName } from "@/lib/tier-config";
import { FEATURE_TO_JOB_MAP } from "@/lib/tier-config";
import { planHasFeature } from "@/lib/tier-utils";
import { inngest } from "../client";
import { generateHashtags } from "../steps/ai-generation/hashtags";
import { generateKeyMoments } from "../steps/ai-generation/key-moments";
import { generateSocialPosts } from "../steps/ai-generation/social-posts";
import { generateSummary } from "../steps/ai-generation/summary";
import { generateTitles } from "../steps/ai-generation/titles";
import { generateYouTubeTimestamps } from "../steps/ai-generation/youtube-timestamps";
import type { TranscriptWithExtras } from "@/types/assemblyai";

export const retryJobFunction = inngest.createFunction(
  { id: "retry-job" },
  { event: "podcast/retry-job" },
  async ({ event, step }) => {
    const { projectId, job, originalPlan, currentPlan } = event.data;

    const currentUserPlan = (currentPlan as PlanName) || "free";
    const originalUserPlan = (originalPlan as PlanName) || "free";

    const jobToFeature = Object.fromEntries(
      Object.entries(FEATURE_TO_JOB_MAP).map(([k, v]) => [v, k])
    );

    const featureKey = jobToFeature[job];
    if (
      featureKey &&
      !planHasFeature(currentUserPlan, featureKey as FeatureName)
    ) {
      throw new Error(
        `This feature (${job}) is not available on your current plan. Please upgrade to access it.`
      );
    }

    if (originalUserPlan !== currentUserPlan) {
      console.log(
        `User upgraded from ${originalUserPlan} to ${currentUserPlan}. Generating ${job}.`
      );
    }

    const project = await convex.query(api.projects.getProject, { projectId });
    if (!project?.transcript) {
      throw new Error("Project or transcript not found");
    }

    const transcript = project.transcript as TranscriptWithExtras;

    if (!transcript.text || transcript.text.length === 0) {
      throw new Error(
        "Cannot generate content: transcript text is empty. Please re-upload the file."
      );
    }

    const jobsRequiringChapters = ["keyMoments", "youtubeTimestamps"];
    if (jobsRequiringChapters.includes(job)) {
      if (!transcript.chapters || transcript.chapters.length === 0) {
        throw new Error(
          `Cannot generate ${job}: transcript has no chapters. This podcast may be too short or lack distinct topics for chapter detection.`
        );
      }
    }

    try {
      switch (job) {
        case "keyMoments": {
          const result = await generateKeyMoments(transcript);
          await step.run("save-key-moments", () =>
            convex.mutation(api.projects.saveGeneratedContent, {
              projectId,
              keyMoments: result,
            })
          );
          break;
        }

        case "summary": {
          const result = await generateSummary(step, transcript);
          await step.run("save-summary", () =>
            convex.mutation(api.projects.saveGeneratedContent, {
              projectId,
              summary: result,
            })
          );
          break;
        }

        case "socialPosts": {
          const result = await generateSocialPosts(step, transcript);
          await step.run("save-social-posts", () =>
            convex.mutation(api.projects.saveGeneratedContent, {
              projectId,
              socialPosts: result,
            })
          );
          break;
        }

        case "titles": {
          const result = await generateTitles(step, transcript);
          await step.run("save-titles", () =>
            convex.mutation(api.projects.saveGeneratedContent, {
              projectId,
              titles: result,
            })
          );
          break;
        }

        case "hashtags": {
          const result = await generateHashtags(step, transcript);
          await step.run("save-hashtags", () =>
            convex.mutation(api.projects.saveGeneratedContent, {
              projectId,
              hashtags: result,
            })
          );
          break;
        }

        case "youtubeTimestamps": {
          const result = await generateYouTubeTimestamps(step, transcript);
          await step.run("save-youtube-timestamps", () =>
            convex.mutation(api.projects.saveGeneratedContent, {
              projectId,
              youtubeTimestamps: result,
            })
          );
          break;
        }
      }

      await step.run("clear-job-error", async () => {
        const currentErrors = project.jobErrors || {};
        const updatedErrors = { ...currentErrors };
        delete updatedErrors[job as keyof typeof updatedErrors];

        await convex.mutation(api.projects.saveJobErrors, {
          projectId,
          jobErrors: updatedErrors,
        });
      });

      return { success: true, job };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await convex.mutation(api.projects.saveJobErrors, {
        projectId,
        jobErrors: {
          [job]: errorMessage,
        },
      });

      throw error;
    }
  }
);