import type { Mailbox, MailboxResponse } from "@/types/marmalade";

type FetchOptions = {
  revalidate?: number;
};

export async function fetchMarmalade<T>(
  path: string,
  apiKey?: string,
  options: FetchOptions = {},
): Promise<T> {
  const response = await fetch(`${process.env.MARMALADE_BASE_URL}${path}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: options.revalidate ?? 5 },
  });

  if (!response.ok) {
    throw new Error(`Marmalade request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getMailboxes(apiKey: string): Promise<Mailbox[]> {
  const mailboxes = await fetchMarmalade<MailboxResponse>(
    "/mailboxes",
    apiKey,
    {
      revalidate: 5,
    },
  );

  return mailboxes.jellyMailbox.members.map((member) => ({
    marmaladeMailboxId: mailboxes.marmaladeMailbox.id.toString(),
    marmaladeUserId: member.marmalade.id,
    jellyMailboxId: mailboxes.jellyMailbox.jellyMailboxId,
    name: mailboxes.jellyMailbox.name,
    isDefault: mailboxes.jellyMailbox.isDefault,
    isArchived: mailboxes.jellyMailbox.isArchived,
    memberCount: mailboxes.jellyMailbox.memberCount,
  }));
}
