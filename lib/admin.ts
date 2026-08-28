/**
 * Admin configuration for Podcasto
 * Only the emails listed here have admin privileges
 */

// Admin emails - add more as needed
const ADMIN_EMAILS = [
  "apsingh.6423@gmail.com",
] as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[number];

/**
 * Check if an email is an admin
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email as AdminEmail);
}

/**
 * Get all admin emails
 */
export function getAdminEmails(): readonly AdminEmail[] {
  return ADMIN_EMAILS;
}

/**
 * Check if a user object is an admin
 */
export function isUserAdmin(user: { emailAddresses?: { emailAddress: string }[] } | null): boolean {
  if (!user?.emailAddresses) return false;
  return user.emailAddresses.some((e) => isAdmin(e.emailAddress));
}

/**
 * Get user's primary email
 */
export function getUserEmail(user: { emailAddresses?: { emailAddress: string }[] } | null): string | null {
  if (!user?.emailAddresses?.length) return null;
  return user.emailAddresses[0].emailAddress;
}
