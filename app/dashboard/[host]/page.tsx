"use client";

import ErrorFallback from "@/app/error-boundary";
import { Footer } from "@/components/footer";
import { HelperLeaderboardWidget } from "@/components/helper-leaderboard";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { StatusChartWidget } from "@/components/status-chart-widget";
import { SurveyWidget } from "@/components/survey-widget";
import { PageDescriptionAuth, PageHeader } from "@/components/text-types";
import ThrowError from "@/components/throw-error";
import { TicketAgeChartWidget } from "@/components/ticket-age-chart-widget";
import {
  AssignedTicketsWidget,
  UnassignedTicketsWidget,
} from "@/components/ticket-table";
import { TicketWidget } from "@/components/ticket-widget";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  GetNephthysChannelFromName,
  GetNephthysHostFromName,
  nephthysHosts,
} from "@/lib/nephthys";
import { SlackChannelLink, greet } from "@/lib/utils";
import type {
  CachetEnrichedStats,
  Ticket as TicketType,
} from "@/types/nephthys";
import { ArrowUpRight } from "lucide-motion";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { use, useEffect, useMemo, useState } from "react";

export default function Dashboard({
  params,
}: {
  params: Promise<{ host: string }>;
}) {
  const router = useRouter();
  const { host: selectedHost } = use(params);
  const { data: session, isPending } = authClient.useSession();
  const [checkUpTicket, _setCheckUpTicket] = useState<TicketType | null>(null);
  const [ticketsData, setTicketsData] = useState<TicketType[]>([]);
  const [closedTickets, setClosedTickets] = useState<TicketType[]>([]);
  const [statsData, setStatsData] = useState<CachetEnrichedStats>();
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const oldestTicket = useMemo(() => {
    const openTickets = ticketsData.filter((t) => t.status === "OPEN");
    return openTickets.reduce((oldest, ticket) => {
      if (!oldest || ticket.created_at < oldest.created_at) {
        return ticket;
      }
      return oldest;
    }, null as TicketType | null);
  }, [ticketsData]);

  useEffect(() => {
    async function fetchTickets() {
      if (!selectedHost) return;

      try {
        const ticketsResponse = fetch(
          `/api/tickets?host=${selectedHost}&status=open,in_progress`,
        );

        const closedTicketsResponse = fetch(
          `/api/tickets?host=${selectedHost}&status=closed`,
        );

        const ticketsResponseData = (await (
          await ticketsResponse
        ).json()) as TicketType[];

        const closedTicketsResponseData = (await (
          await closedTicketsResponse
        ).json()) as TicketType[];

        if (!Array.isArray(ticketsResponseData)) {
          throw new Error("Invalid tickets data", {
            cause: ticketsResponseData,
          });
        }

        if (!Array.isArray(closedTicketsResponseData)) {
          throw new Error("Invalid tickets data:", {
            cause: closedTicketsResponseData,
          });
        }

        setTicketsData(ticketsResponseData);
        setClosedTickets(closedTicketsResponseData);
      } catch (err) {
        setFetchError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    async function fetchStats() {
      if (!selectedHost) return;

      try {
        // TODO: Optional cachet enrichment to improve load speeds cause this shit takes fucking ages
        const statsResponse = fetch(
          `/api/stats?host=${selectedHost}&cachetEnriched=${false}`,
        );

        const statsResponseData = (await (
          await statsResponse
        ).json()) as CachetEnrichedStats;

        setStatsData(statsResponseData);
      } catch (err) {
        setFetchError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    fetchTickets();
    fetchStats();
  }, [selectedHost]);

  const userStats = useMemo(() => {
    const stats = {
      assigned: 0,
      unclaimed: 0,
      inProgress: 0,
    };

    if (isPending || !session?.user?.slack_id) return stats;

    for (const ticket of ticketsData) {
      if (ticket.assigned_to?.slack_id === session.user.slack_id) {
        stats.assigned++;
      } else if (!ticket.assigned_to) {
        stats.unclaimed++;
      } else if (ticket.status === "IN_PROGRESS") {
        stats.inProgress++;
      }
    }

    return stats;
  }, [ticketsData, session?.user?.slack_id, isPending]);

  if (!GetNephthysHostFromName(selectedHost)) router.push("/");

  //? Make sure that preferences are applied
  if (
    posthog.has_opted_in_capturing() &&
    session?.preferences?.isOptedOutTracking
  )
    posthog.opt_out_capturing();
  else if (
    !posthog.has_opted_in_capturing() &&
    !session?.preferences?.isOptedOutTracking
  )
    posthog.opt_in_capturing();

  function openSlackChannel(channelId: string | null) {
    if (!channelId) return console.error("Channel ID is null?");
    window.open(SlackChannelLink(channelId), "");
  }

  function switchHost() {
    localStorage.removeItem("nephthysHost");
    router.push("/?ignorePreference=1");
  }

  return (
    <>
      <Navbar />
      <ErrorFallback title={"ERR"}>
        <ThrowError error={fetchError} />
        <PageWrapper variant="tight">
          <PageHeader
            title={greet(session?.user?.name)}
            breadcrumb={selectedHost}
            justifyBetween
          >
            <PageDescriptionAuth
              signedOutText="Sign in to see claimed tickets and more!"
              signedInText={`${userStats.assigned} assigned to you · ${userStats.unclaimed}
              unclaimed in the queue · ${userStats.inProgress} in progress.`}
            />
            <div className="flex flex-row gap-2">
              <Button size="lg" variant="outline" onClick={switchHost}>
                SWITCH CHANNEL
              </Button>
              <Button
                size="lg"
                variant="default"
                onClick={() =>
                  openSlackChannel(GetNephthysChannelFromName(selectedHost))
                }
              >
                OPEN CHANNEL
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </PageHeader>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-2 px-6 min-h-66">
            <TicketWidget
              slackChannel={GetNephthysChannelFromName(selectedHost)}
              ticket={oldestTicket}
              ticketWidgetType={"oldest"}
            />
            <TicketWidget
              slackChannel={GetNephthysChannelFromName(selectedHost)}
              ticket={checkUpTicket}
              ticketWidgetType={"checkup"}
            />
            <SurveyWidget />
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2 px-6">
            <div className="col-span-3 flex flex-col gap-4">
              {session?.user && (
                <AssignedTicketsWidget
                  slackId={session.user.slack_id}
                  tickets={ticketsData}
                  slackChannel={GetNephthysChannelFromName(selectedHost)}
                />
              )}
              <UnassignedTicketsWidget
                tickets={ticketsData}
                slackChannel={GetNephthysChannelFromName(selectedHost)}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2 px-6">
            <TicketAgeChartWidget closedTickets={closedTickets} />
            <StatusChartWidget
              openCount={statsData?.all_time?.tickets_open || 0}
              inProgressCount={statsData?.all_time?.tickets_in_progress || 0}
              closedCount={statsData?.all_time?.tickets_closed || 0}
            />
            <HelperLeaderboardWidget
              helperData={statsData?.all_time?.helpers_leaderboard || []}
            />
          </div>
        </PageWrapper>
      </ErrorFallback>
      <Footer />
    </>
  );
}
