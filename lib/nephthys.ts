import type { Stats, Ticket, TicketResponse } from "@/types/nephthys";
import { getCachetUser } from "./cachet";

type FetchOptions = {
  revalidate?: number;
};

export const nephthysHosts = [
  {
    name: "Stardance",
    host: "https://stardance.nephthys.hackclub.com",
    channel: "C0AP0NMSP3P",
  },
  {
    name: "Help",
    host: "https://help.nephthys.hackclub.com",
    channel: "C07TM4C0AQ5",
  },
  {
    name: "Nest",
    host: "https://nephthys.cyteon.dev",
    channel: "C097AL5AUH0",
  },
  {
    name: "Identity-Help",
    host: "https://identity.nephthys.hackclub.com",
    channel: "C092833JXKK",
  },
  {
    name: "Beest",
    host: "https://beest.nephthys.hackclub.com",
    channel: "C0AQ4T1CWH2",
  },
  {
    name: "Fallout",
    host: "https://fallout.nephthys.hackclub.com",
    channel: "C0ACJ290090",
  },
  // { name: "HCTG", host: "https://hctg.nephthys.hackclub.com" }, Borked?
];

export async function fetchNephthys<T>(
  path: string,
  host: string | null,
  options: FetchOptions = {},
): Promise<T> {
  if (
    !host ||
    !Object.values(nephthysHosts).some((h) => h.host.toLowerCase() === host)
  ) {
    throw new Error(`Invalid Nephthys host: ${host}`);
  }

  const response = await fetch(`${host}${path}`, {
    headers: { accept: "application/json" },
    next: { revalidate: options.revalidate ?? 30 },
  });

  if (!response.ok) {
    throw new Error(`Nephthys request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getStats(host: string | null, cachetEnrich = false) {
  if (!host) {
    throw new Error("Missing required parameter: host");
  }

  if (!host?.includes("https://")) {
    host =
      nephthysHosts.find((h) => h.name.toLowerCase() === host?.toLowerCase())
        ?.host || "";
  }

  if (!cachetEnrich)
    return fetchNephthys<Stats>("/api/stats_v2", host, { revalidate: 30 });

  const rawStats = await fetchNephthys<Stats>("/api/stats_v2", host, {
    revalidate: 30,
  });

  const enrichedStats = {
    ...rawStats,
    all_time: {
      ...rawStats.all_time,
      helpers_leaderboard: await Promise.all(
        rawStats.all_time.helpers_leaderboard.map(async (helper) => ({
          ...helper,
          imageUrl: (await getCachetUser(helper.slack_id))?.imageUrl,
          displayName: (await getCachetUser(helper.slack_id))?.displayName,
        })),
      ),
    },
  };
  console.log(enrichedStats);
  return enrichedStats;
}

export async function getTickets(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  if (!params.has("host")) {
    throw new Error("Missing required parameter: host");
  }

  let host = params.get("host");

  if (!host?.includes("https://")) {
    host =
      nephthysHosts.find((h) => h.name.toLowerCase() === host?.toLowerCase())
        ?.host || "";
  }

  console.log("Fetching tickets for host:", host);

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
        return fetchNephthys<TicketResponse | Ticket[]>(
          `/api/tickets?${statusParams}`,
          host,
          {
            revalidate: 30,
          },
        );
      }),
    );

    return results.flatMap((result) =>
      Array.isArray(result) ? result : result.value,
    );
  }

  return fetchNephthys<TicketResponse | Ticket[]>(
    `/api/tickets?${params}`,
    host,
    {
      revalidate: 30,
    },
  );
}

function daysAgoIsoDate(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}
