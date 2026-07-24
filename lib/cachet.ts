import type { CachetUser } from "@/types/cachet";

const CACHET_HOST = process.env.CACHET_HOST ?? "https://cachet.hackclub.com";

export async function getCachetUser(
  slackId: string,
): Promise<CachetUser | null> {
  const response = await fetch(`${CACHET_HOST}/users/${slackId}`, {
    headers: { accept: "application/json" },
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) return null;

  const user = (await response.json()) as CachetUser;
  return user;
}
