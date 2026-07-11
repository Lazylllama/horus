"use client";

import { ArrowUpRight } from "lucide-motion";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/footer";
import { HelperLeaderboardWidget } from "@/components/helper-leaderboard";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { StatusChartWidget } from "@/components/status-chart-widget";
import { SurveyWidget } from "@/components/survey-widget";
import { PageDescriptionAuth, PageHeader } from "@/components/text-types";
import { TicketAgeChartWidget } from "@/components/ticket-age-chart-widget";
import {
  AssignedTicketsWidget,
  UnassignedTicketsWidget,
} from "@/components/ticket-table";
import { TicketWidget } from "@/components/ticket-widget";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { nephthysHosts } from "@/lib/nephthys";
import { greet, SlackChannelLink } from "@/lib/utils";
import type {
  CachetEnrichedStats,
  Ticket as TicketType,
} from "@/types/nephthys";

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

  const oldestTicket = useMemo(() => {
    const openTickets = ticketsData.filter((t) => t.status === "OPEN");
    return openTickets.reduce(
      (oldest, ticket) => {
        if (!oldest || ticket.created_at < oldest.created_at) {
          return ticket;
        }
        return oldest;
      },
      null as TicketType | null,
    );
  }, [ticketsData]);

  useEffect(() => {
    async function fetchTickets() {
      if (!selectedHost) return;

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
        console.error("Invalid tickets data:", ticketsResponseData);
        return;
      }

      if (!Array.isArray(closedTicketsResponseData)) {
        console.error(
          "Invalid closed tickets data:",
          closedTicketsResponseData,
        );
        return;
      }

      setTicketsData(ticketsResponseData);
      setClosedTickets(closedTicketsResponseData);
    }

    async function fetchStats() {
      if (!selectedHost) return;

      // TODO: Optional cachet enrichment to improve load speeds cause this shit takes fucking ages
      const statsResponse = fetch(
        `/api/stats?host=${selectedHost}&cachetEnriched=${false}`,
      );

      const statsResponseData = (await (
        await statsResponse
      ).json()) as CachetEnrichedStats;

      setStatsData(statsResponseData);
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

  if (
    !nephthysHosts.some(
      (h) => h.name.toLowerCase() === selectedHost.toLowerCase(),
    )
  ) {
    console.error("Invalid host:", selectedHost);
    router.push("/");
  }

  function openSlackChannel(channelId: string) {
    window.open(SlackChannelLink(channelId), "");
  }

  function switchHost() {
    localStorage.removeItem("nephthysHost");
    router.push("/");
  }

  return (
    <>
      <Navbar selectedHost={selectedHost} />
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
                openSlackChannel(
                  nephthysHosts.find(
                    (h) => h.name.toLowerCase() === selectedHost.toLowerCase(),
                  )?.channel || "#",
                )
              }
            >
              OPEN CHANNEL
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </PageHeader>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-2 px-6 min-h-66">
          <TicketWidget
            slackChannel={
              nephthysHosts.find(
                (h) => h.name.toLowerCase() === selectedHost.toLowerCase(),
              )?.channel || "#"
            }
            ticket={oldestTicket}
            ticketWidgetType={"oldest"}
          />
          <TicketWidget
            slackChannel={
              nephthysHosts.find(
                (h) => h.name.toLowerCase() === selectedHost.toLowerCase(),
              )?.channel || "#"
            }
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
                slackChannel={
                  nephthysHosts.find(
                    (h) => h.name.toLowerCase() === selectedHost.toLowerCase(),
                  )?.channel || "#"
                }
              />
            )}
            <UnassignedTicketsWidget
              tickets={ticketsData}
              slackChannel={
                nephthysHosts.find(
                  (h) => h.name.toLowerCase() === selectedHost.toLowerCase(),
                )?.channel || "#"
              }
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2 px-6">
          <TicketAgeChartWidget closedTickets={closedTickets} />
          <StatusChartWidget
            openCount={statsData?.all_time.tickets_open || 0}
            inProgressCount={statsData?.all_time.tickets_in_progress || 0}
            closedCount={statsData?.all_time.tickets_closed || 0}
          />
          <HelperLeaderboardWidget
            helperData={statsData?.all_time?.helpers_leaderboard || []}
          />
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}
