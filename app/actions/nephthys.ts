"use server";

import {
  getStats,
  getTickets,
  type NephthysTicketFilter,
} from "@/lib/nephthys";

export async function fetchNephthysStats(input: {
  nephthysHost: string;
  cachetEnriched?: boolean;
}) {
  try {
    const stats = await getStats(
      input.nephthysHost,
      input.cachetEnriched === true,
    );
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
}) {
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
