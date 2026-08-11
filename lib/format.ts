
import bytes from "bytes";
import { format } from "date-fns";
import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from "./constants";

export function formatFileSize(size: number): string {
  return bytes(size, { unitSeparator: " " })??"0 B";
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}


export function formatTimestamp(
  seconds: number,
  options?: {
    padHours?: boolean;
    forceHours?: boolean;
  }
): string {
  const { padHours = true, forceHours = false } = options || {};

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hoursStr = padHours ? String(hours).padStart(2, "0") : String(hours);
  const minutesStr = String(minutes).padStart(2, "0");
  const secsStr = String(secs).padStart(2, "0");

  if (hours > 0 || forceHours) {
    return `${hoursStr}:${minutesStr}:${secsStr}`;
  }
  return `${minutesStr}:${secsStr}`;
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), "PPpp");
}

export function formatSmartDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);

  // Less than 1 minute
  if (diffMins < 1) return "Just now";
  // Less than 1 hour
  if (diffMins < 60) return `${diffMins}m ago`;

  // Less than 24 hours
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  if (diffHours < 24) return `${diffHours}h ago`;

  // Less than 7 days
  const diffDays = Math.floor(diffMs / MS_PER_DAY);
  if (diffDays < 7) return `${diffDays}d ago`;

  // 7+ days: Show date
  return date.toLocaleDateString();
}