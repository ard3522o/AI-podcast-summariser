export function estimateAssemblyAITime(durationSeconds?: number) {
  if (!durationSeconds) {
    durationSeconds = 1800; 
  }

  const bestCaseSeconds = Math.round(durationSeconds * 0.008);
  const conservativeSeconds = Math.round(durationSeconds * 0.25);

  return {
    bestCase: Math.max(30, bestCaseSeconds),
    conservative: Math.max(60, conservativeSeconds),
    average: Math.round((bestCaseSeconds + conservativeSeconds) / 2),
  };
}

export function formatTimeEstimate(seconds: number): string {
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  return `${Math.ceil(seconds / 3600)} hours`;
}

export function formatTimeRange(
  bestCase: number,
  conservative: number,
): string {
  return `${formatTimeEstimate(bestCase)} - ${formatTimeEstimate(
    conservative,
  )}`;
}