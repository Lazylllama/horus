export type InstanceApiData = {
  instanceId: string;
  organizationId: string;
  name: string;
  resolvedTickets: number;
  openTickets: number;
  inProgressTickets: number;
  slug: string;
  imageUrl: string | null;
  slackChannel: string | null;
  nephthysHostname: string | null;
  deprecated: boolean;
};

export type RedisInstanceStats = Record<
  string, // instanceId
  { openTickets: number; resolvedTickets: number; inProgressTickets: number }
>;
