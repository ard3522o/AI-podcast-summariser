import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export function apiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}


export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export async function withAuth(): Promise<{ userId: string }> {
  const { userId } = await auth();
  if (!userId) {
    throw apiError("Unauthorized", 401);
  }
  return { userId };
}