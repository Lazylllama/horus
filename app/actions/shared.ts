import { db } from "@/db";

/**
 * Look for users in the whole database, not just the current org.
 * @param query any string to look for in slack_id, name and optionally email
 * @param searchEmail wether to look in email field, only for super admin due to sensitivity
 * @returns list with id, name and slack_id of users
 */
export async function searchGlobalUsers(query: string, searchEmail: boolean) {
  if (query.trim().length < 2) return [];
  const q = `%${query}%`;
  return db.query.user.findMany({
    where: {
      OR: searchEmail
        ? [
            { name: { ilike: q } },
            { email: { ilike: q } },
            { slack_id: { ilike: q } },
          ]
        : [{ name: { ilike: q } }, { slack_id: { ilike: q } }],
    },
    columns: { id: true, name: true, slack_id: true },
    limit: 10,
  });
}
