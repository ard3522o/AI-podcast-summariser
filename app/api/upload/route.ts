import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { apiError } from "@/lib/api-utils";
import { ALLOWED_AUDIO_TYPES } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/tier-config";

export async function POST(request: Request): Promise<NextResponse> {
  console.log("DEBUG TOKEN:", process.env.BLOB_READ_WRITE_TOKEN ? "Token exists" : "Token is MISSING");
  try {
    // Authenticate user
    const authObj = await auth();
    const { userId, has } = authObj;

    if (!userId) {
      return apiError("Unauthorized", 401);
    }

    // Parse Vercel Blob request body
    const body = (await request.json()) as HandleUploadBody;

    // Determine user's plan and set file size limit
    let maxFileSize = PLAN_LIMITS.free.maxFileSize;
    if (has?.({ plan: "ultra" })) {
      maxFileSize = PLAN_LIMITS.ultra.maxFileSize;
    } else if (has?.({ plan: "pro" })) {
      maxFileSize = PLAN_LIMITS.pro.maxFileSize;
    }

    // Generate pre-signed upload URL with plan-based constraints
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: Object.keys(ALLOWED_AUDIO_TYPES),
        addRandomSuffix: true,
        maximumSizeInBytes: maxFileSize,
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof NextResponse) return error;

    console.error("Upload error:", error);
    return apiError(
      error instanceof Error ? error.message : "Upload failed",
      400
    );
  }
}