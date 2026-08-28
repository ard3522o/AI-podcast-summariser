import type { PlanName } from "./tier-config";

export function getCurrentPlan(
  hasFunction?: ((params: { plan?: string }) => boolean) | null,
): PlanName {
  if (!hasFunction) return "free";

  // Dev override: set NEXT_PUBLIC_FORCE_PLAN=ultra in .env.local to bypass Clerk plan checks
  const forcePlan = process.env.NEXT_PUBLIC_FORCE_PLAN as PlanName | undefined;
  if (forcePlan && ["free", "pro", "ultra"].includes(forcePlan)) {
    return forcePlan;
  }

  if (hasFunction({ plan: "ultra" })) {
    return "ultra";
  }
  if (hasFunction({ plan: "pro" })) {
    return "pro";
  }
  return "free";
}

export function getUpgradePlan(
  hasFunction?: ((params: { plan?: string }) => boolean) | null,
): PlanName | null {
  const currentPlan = getCurrentPlan(hasFunction);

  if (currentPlan === "free") return "pro";
  if (currentPlan === "pro") return "ultra";
  return null; // Already on Ultra
}

export function getUpgradeCTA(
  hasFunction?: ((params: { plan?: string }) => boolean) | null,
): string {
  const upgradePlan = getUpgradePlan(hasFunction);

  if (upgradePlan === "pro") return "Upgrade to Pro";
  if (upgradePlan === "ultra") return "Upgrade to Ultra";
  return "Ultra Plan"; // Already on Ultra
}
