"use client";

import { CheckCircle2, Clock, FileAudio, Loader2, XCircle } from "lucide-react";
import { formatDuration, formatFileSize } from "@/lib/format";
import type { UploadStatus } from "@/lib/types";

interface UploadProgressProps {
  fileName: string; // Display name
  fileSize: number; // Bytes
  fileDuration?: number; // Seconds (optional - may not extract successfully)
  progress: number; // 0-100
  status: UploadStatus; // Current state
  error?: string; // Error message if status is "error"
}

export function UploadProgress({
  fileName,
  fileSize,
  fileDuration,
  progress,
  status,
  error,
}: UploadProgressProps) {
  return (
    <div className="glass-card-strong rounded-2xl p-6 hover-lift">
      <div className="space-y-6">
        <div className="flex items-start gap-5">
          <div className="rounded-2xl gradient-emerald p-4 shadow-lg">
            <FileAudio className="h-8 w-8 text-white" />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg truncate text-gray-900">{fileName}</p>

            <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
              <span className="font-medium">{formatFileSize(fileSize)}</span>
              {fileDuration && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{formatDuration(fileDuration)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            {status === "uploading" && (
              <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
            )}
            {status === "processing" && (
              <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
            )}
            {status === "completed" && (
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            )}
            {status === "error" && (
              <XCircle className="h-7 w-7 text-red-500" />
            )}
          </div>
        </div>

        {(status === "uploading" || status === "processing") && (
          <div className="space-y-3">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 progress-emerald rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">
                {status === "uploading" ? "Uploading..." : "Processing..."}
              </span>
              <span className="text-emerald-600">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {status === "completed" && (
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
            <p className="text-sm font-semibold text-emerald-700">
              Upload completed! Redirecting to project dashboard...
            </p>
          </div>
        )}

        {status === "error" && error && (
          <div className="rounded-xl bg-red-50 border-2 border-red-200 p-5">
            <div className="flex items-start gap-4">
              <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="font-bold text-red-900">Upload Failed</p>
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>

                {error.includes("plan limit") && (
                  <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-red-200">
                    💡 Upgrade your plan to upload larger files or more
                    projects
                  </p>
                )}
                {error.includes("Authentication") && (
                  <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-red-200">
                    💡 Try refreshing the page or signing in again
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}