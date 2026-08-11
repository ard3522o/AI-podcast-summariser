import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import type {
  Hashtags,
  SocialPosts,
  Summary,
  Titles,
} from "@/schemas/ai-outputs";

type KeyMoment = {
  time: string; 
  timestamp: number;
  text: string; 
  description: string; 
};

type YouTubeTimestamp = {
  timestamp: string; 
  description: string; 
};


type GeneratedContent = {
  keyMoments?: KeyMoment[];
  summary?: Summary;
  socialPosts?: SocialPosts;
  titles?: Titles;
  hashtags?: Hashtags;
  youtubeTimestamps?: YouTubeTimestamp[];
};


export async function saveResultsToConvex(
  projectId: Id<"projects">,
  results: GeneratedContent
): Promise<void> {
  await convex.mutation(api.projects.saveGeneratedContent, {
    projectId,
    keyMoments: results.keyMoments,
    summary: results.summary,
    socialPosts: results.socialPosts,
    titles: results.titles,
    hashtags: results.hashtags,
    youtubeTimestamps: results.youtubeTimestamps,
  });

  await convex.mutation(api.projects.updateProjectStatus, {
    projectId,
    status: "completed",
  });

  console.log("Podcast processing completed for project:", projectId);
}