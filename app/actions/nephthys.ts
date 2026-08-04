"use server";

import { cacheLife } from "next/cache";
import {
  getStats,
  getTickets,
  getTicketsTTR,
  type NephthysTicketFilter,
} from "@/lib/nephthys";
import type { ErrorResponse } from "@/types/error";
import type { CachetEnrichedStats, Ticket, TicketTTR } from "@/types/nephthys";

export async function fetchNephthysStats(
  nephthysHost: string,
): Promise<CachetEnrichedStats | ErrorResponse> {
  "use cache";
  cacheLife("minutes");
  try {
    const stats = await getStats(nephthysHost);
    return stats;
  } catch (error) {
    return {
      error: "InternalError",
      message:
        error instanceof Error
          ? error.message
          : "Gettings nephthys stats failed",
    };
  }
}

export async function fetchNephthysTickets(
  nephthysHost: string,
  filter?: NephthysTicketFilter,
  skipCache = false,
): Promise<ErrorResponse | Ticket[]> {
  try {
    const tickets = await getTickets(nephthysHost, filter, skipCache);
    return tickets;
  } catch (error) {
    return {
      error: "InternalError",
      message:
        error instanceof Error
          ? error.message
          : "Gettings nephthys tickets failed",
    };
  }
}

export async function fetchNephthysTicketsTTR(
  nephthysHost: string,
): Promise<ErrorResponse | TicketTTR> {
  "use cache";
  cacheLife("minutes");
  try {
    const ticketsTTR = await getTicketsTTR(nephthysHost);
    return ticketsTTR;
  } catch (error) {
    return {
      error: "InternalError",
      message:
        error instanceof Error
          ? error.message
          : "Gettings nephthys tickets TTR failed",
    };
  }
}
