import type {
  CachetEnrichedStats,
  Stats,
  Ticket,
  TicketTTR,
  TimeDurations,
} from "@/types/nephthys";
import { getCachetUser } from "./cachet";

type FetchOptions = {
  revalidate?: number;
};

export type NephthysTicketFilter = {
  status?: string;
  since?: string;
  after?: string;
  until?: string;
  before?: string;
};

// TODO: Allow spaces or something
export const nephthysHosts = [
  {
    name: "Stardance",
    host: "stardance.nephthys.hackclub.com",
    channel: "C0AP0NMSP3P",
  },
  {
    name: "Help",
    host: "help.nephthys.hackclub.com",
    channel: "C07TM4C0AQ5",
  },
  {
    name: "Nest",
    host: "nephthys.cyteon.dev",
    channel: "C097AL5AUH0",
  },
  {
    name: "Identity-Help",
    host: "identity.nephthys.hackclub.com",
    channel: "C092833JXKK",
  },
  {
    name: "Beest",
    host: "beest.nephthys.hackclub.com",
    channel: "C0AQ4T1CWH2",
  },
  {
    name: "Fallout",
    host: "fallout.nephthys.hackclub.com",
    channel: "C0ACJ290090",
  },
  {
    name: "HCAI",
    host: "hcai-nephthys.nirvaan.hackclub.app",
    channel: "C0BDLT68ENN",
  },
  // { name: "HCTG", host: "hctg.nephthys.hackclub.com" }, Borked?
];

export function GetNephthysHostFromName(name: string): string | null {
  return (
    nephthysHosts.find((h) => h.name.toLowerCase() === name.toLowerCase())
      ?.host || null
  );
}

export function GetNephthysNameFromHost(host: string): string | null {
  return (
    nephthysHosts.find((h) => h.host.toLowerCase() === host.toLowerCase())
      ?.name || null
  );
}

export function GetNephthysChannelFromName(name: string): string | null {
  return (
    nephthysHosts.find((h) => h.name.toLowerCase() === name.toLowerCase())
      ?.channel || null
  );
}

export async function fetchNephthys<T>(
  path: string,
  host: string | null,
  options: FetchOptions = {},
): Promise<T> {
  const response = await fetch(
    `https://${
      host?.includes(".") ? host : GetNephthysHostFromName(host || "")
    }${path}`,
    {
      headers: { accept: "application/json" },
      next: { revalidate: options.revalidate ?? 30 },
    },
  );

  if (!response.ok) {
    throw new Error(`Nephthys request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getStats(
  host: string | null,
): Promise<CachetEnrichedStats> {
  if (!host) {
    throw new Error("Missing required parameter: host");
  }

  const rawStats = await fetchNephthys<Stats>("/api/stats_v2", host, {
    revalidate: 30,
  });

  const enrichedStats = {
    ...rawStats,
    all_time: {
      ...rawStats.all_time,
      helpers_leaderboard: await Promise.all(
        rawStats.all_time.helpers_leaderboard.map(async (helper) => {
          const cachetUser = await getCachetUser(helper.slack_id);
          return {
            ...helper,
            imageUrl: cachetUser?.imageUrl,
            displayName: cachetUser?.displayName,
          };
        }),
      ),
    },
  };

  return enrichedStats as CachetEnrichedStats;
}

export async function getTickets(host: string, filter?: NephthysTicketFilter) {
  if (!host) {
    throw new Error("Missing required parameter: host");
  }

  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }
  if (!params.has("status")) params.set("status", "open");
  if (
    params.get("status") === "closed" &&
    !params.has("since") &&
    !params.has("after") &&
    !params.has("until") &&
    !params.has("before")
  ) {
    params.set("since", daysAgoIsoDate(30));
  }

  if (params.get("status")?.includes(",")) {
    const statuses = params.get("status")?.split(",") || [];

    const results = await Promise.all(
      statuses.map((status) => {
        const statusParams = new URLSearchParams(params);
        statusParams.set("status", status);
        return fetchNephthys<Ticket[]>(`/api/tickets?${statusParams}`, host, {
          revalidate: 30,
        });
      }),
    );

    return results;
  }

  const results = await fetchNephthys<Ticket[]>(
    `/api/tickets?${params}`,
    host,
    {
      revalidate: 30,
    },
  );

  return results;
}

export async function getTicketsTTR(host: string) {
  if (!host) {
    throw new Error("Missing required parameter: host");
  }

  const params = new URLSearchParams();
  params.set("status", "closed");
  params.set("since", daysAgoIsoDate(365)); // last 365 days

  const results = await fetchNephthys<Ticket[]>(
    `/api/tickets?${params}`,
    host,
    {
      revalidate: 30,
    },
  );

  const chartData: { name: TimeDurations; value: number; fill: string }[] = [
    { name: "5 Minutes", value: 0, fill: "var(--color-primary)" },
    { name: "1 Hour", value: 0, fill: "var(--color-primary)" },
    { name: "12 Hours", value: 0, fill: "var(--color-primary)" },
    { name: "24 Hours", value: 0, fill: "var(--color-orange-400)" },
    { name: "4 Days", value: 0, fill: "var(--color-orange-400)" },
    { name: "7 Days", value: 0, fill: "var(--color-destructive)" },
    { name: "More", value: 0, fill: "var(--color-destructive)" },
  ];

  //Calculate the age of each closed ticket and update the chart data
  results.forEach((ticket) => {
    if (!ticket.closed_at || !ticket.created_at) return;
    const ageInMinutes =
      (new Date(ticket.closed_at).getTime() -
        new Date(ticket.created_at).getTime()) /
      (1000 * 60);

    if (ageInMinutes <= 5) {
      chartData[0].value++;
    } else if (ageInMinutes <= 60) {
      chartData[1].value++;
    } else if (ageInMinutes <= 720) {
      chartData[2].value++;
    } else if (ageInMinutes <= 1440) {
      chartData[3].value++;
    } else if (ageInMinutes <= 5760) {
      chartData[4].value++;
    } else if (ageInMinutes <= 10080) {
      chartData[5].value++;
    } else {
      chartData[6].value++;
    }
  });
  return chartData as TicketTTR;
}

function daysAgoIsoDate(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}
