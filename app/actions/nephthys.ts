"use server";

import { cacheLife } from "next/cache";
import {
  getStats,
  getTickets,
  getTicketsTTR,
  type NephthysTicketFilter,
} from "@/lib/nephthys";
import type { CachetEnrichedStats, Ticket, TicketTTR } from "@/types/nephthys";

export async function fetchNephthysStats(input: {
  nephthysHost: string;
}): Promise<{ error: string } | CachetEnrichedStats> {
  "use cache";
  cacheLife("minutes");
  try {
    const stats = await getStats(input.nephthysHost);
    return stats;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gettings nephthys stats failed",
    };
  }
}

export async function fetchNephthysTickets(input: {
  nephthysHost: string;
  filter?: NephthysTicketFilter;
}): Promise<{ error: string } | Ticket[]> {
  try {
    const tickets = await getTickets(input.nephthysHost, input.filter);
    return tickets;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gettings nephthys tickets failed",
    };
  }
}

export async function fetchNephthysTicketsTTR(input: {
  nephthysHost: string;
}): Promise<{ error: string } | TicketTTR> {
  "use cache";
  cacheLife("minutes");
  try {
    const ticketsTTR = await getTicketsTTR(input.nephthysHost);
    return ticketsTTR;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gettings nephthys tickets TTR failed",
    };
  }
}
