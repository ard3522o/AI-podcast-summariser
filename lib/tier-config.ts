export type PlanName = "free" | "pro" | "ultra";

export interface PlanLimits {
  maxProjects: number | null; // null = unlimited
  maxFileSize: number; // bytes
  maxDuration: number | null; // seconds, null = unlimited
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: {
    maxProjects: 3, // lifetime, including deleted
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxDuration: 600, // 10 minutes
  },
  pro: {
    maxProjects: 30, // active projects only
    maxFileSize: 200 * 1024 * 1024, // 200MB
    maxDuration: 7200, // 2 hours
  },
  ultra: {
    maxProjects: null, // unlimited
    maxFileSize: 3 * 1024 * 1024 * 1024, // 3GB
    maxDuration: null, // unlimited
  },
};


export const FEATURES = {
  SUMMARY: "summary",
  SOCIAL_POSTS: "social_posts",
  TITLES: "titles",
  HASHTAGS: "hashtags",
  YOUTUBE_TIMESTAMPS: "youtube_timestamps",
  KEY_MOMENTS: "key_moments",
  SPEAKER_DIARIZATION: "speaker_diarization",
} as const;

export type FeatureName = (typeof FEATURES)[keyof typeof FEATURES];

export const PLAN_FEATURES: Record<PlanName, FeatureName[]> = {
  free: [FEATURES.SUMMARY],
  pro: [
    FEATURES.SUMMARY,
    FEATURES.SOCIAL_POSTS,
    FEATURES.TITLES,
    FEATURES.HASHTAGS,
  ],
  ultra: [
    FEATURES.SUMMARY,
    FEATURES.SOCIAL_POSTS,
    FEATURES.TITLES,
    FEATURES.HASHTAGS,
    FEATURES.YOUTUBE_TIMESTAMPS,
    FEATURES.KEY_MOMENTS,
    FEATURES.SPEAKER_DIARIZATION,
  ],
};


export const PLAN_NAMES: Record<PlanName, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export const PLAN_PRICES: Record<PlanName, string> = {
  free: "$0",
  pro: "$29/month",
  ultra: "$69/month",
};


export const FEATURE_TO_JOB_MAP = {
  [FEATURES.SOCIAL_POSTS]: "socialPosts",
  [FEATURES.TITLES]: "titles",
  [FEATURES.HASHTAGS]: "hashtags",
  [FEATURES.KEY_MOMENTS]: "keyMoments",
  [FEATURES.YOUTUBE_TIMESTAMPS]: "youtubeTimestamps",
  [FEATURES.SUMMARY]: "summary",
} as const;

export type JobName =
  (typeof FEATURE_TO_JOB_MAP)[keyof typeof FEATURE_TO_JOB_MAP];