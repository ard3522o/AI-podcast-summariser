import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";

/**
 * GET /api/admin/users
 * List all users with their plan status (admin only)
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses?.[0]?.emailAddress;

  if (!isAdmin(email)) {
    return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
  }

  // List all users
  const usersList = await client.users.getUserList({
    limit: 100,
  });

  const users = usersList.data.map((u) => ({
    id: u.id,
    email: u.emailAddresses?.[0]?.emailAddress || "No email",
    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
    createdAt: u.createdAt,
    lastSignInAt: u.lastSignInAt,
    isAdmin: isAdmin(u.emailAddresses?.[0]?.emailAddress),
  }));

  return NextResponse.json({ users });
}
