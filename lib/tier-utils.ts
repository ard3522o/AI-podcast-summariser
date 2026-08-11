import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import {
  PLAN_FEATURES,
  PLAN_LIMITS,
  type FeatureName,
  type PlanLimits,
  type PlanName,
} from "./tier-config";

export interface UploadValidationResult {
  allowed: boolean;
  reason?: "file_size" | "duration" | "project_limit";
  message?: string;
  currentCount?: number;
  limit?: number;
}
type AuthObject = Awaited<ReturnType<typeof auth>>;
export async function checkUploadLimits(
  authObj: AuthObject,
  userId: string,
  fileSize: number,
  duration?: number
): Promise<UploadValidationResult> {
  const { has } = authObj;
  let plan: PlanName = "free";
  if (has?.({ plan: "ultra" })) {
    plan = "ultra";
  } else if (has?.({ plan: "pro" })) {
    plan = "pro";
  }
  
  const limits = PLAN_LIMITS[plan];

  if (fileSize > limits.maxFileSize) {
    return {
      allowed: false,
      reason: "file_size",
      message: `File size (${(fileSize / (1024 * 1024)).toFixed(1)}MB) exceeds your plan limit of ${(limits.maxFileSize / (1024 * 1024)).toFixed(0)}MB`,
    };
  }

  if (duration && limits.maxDuration && duration > limits.maxDuration) {
    const durationMinutes = Math.floor(duration / 60);
    const limitMinutes = Math.floor(limits.maxDuration / 60);
    return {
      allowed: false,
      reason: "duration",
      message: `Duration (${durationMinutes} minutes) exceeds your plan limit of ${limitMinutes} minutes`,
    };
  }

  
  if (limits.maxProjects !== null) {
    
    const includeDeleted = plan === "free";
    const projectCount = await convex.query(api.projects.getUserProjectCount, {
      userId,
      includeDeleted,
    });

    if (projectCount >= limits.maxProjects) {
      return {
        allowed: false,
        reason: "project_limit",
        message: `You've reached your plan limit of ${limits.maxProjects} ${plan === "free" ? "total" : "active"} projects`,
        currentCount: projectCount,
        limit: limits.maxProjects,
      };
    }
  }

  return { allowed: true };
}


export function checkFeatureAccess(
  authObj: AuthObject,
  feature: FeatureName
): boolean {
  const { has } = authObj;
  return has ? has({ feature }) : false;
}

export function getPlanFeatures(plan: PlanName): FeatureName[] {
  return PLAN_FEATURES[plan];
}

export function planHasFeature(plan: PlanName, feature: FeatureName): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

export function getMinimumPlanForFeature(feature: FeatureName): PlanName {
  if (PLAN_FEATURES.free.includes(feature)) return "free";
  if (PLAN_FEATURES.pro.includes(feature)) return "pro";
  return "ultra";
}

export type { FeatureName };