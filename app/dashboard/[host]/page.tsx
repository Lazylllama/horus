"use client";

import { ArrowUpRight } from "lucide-motion";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { HelperLeaderboardWidget } from "@/components/helper-leaderboard";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { nephthysHosts } from "@/lib/nephthys";
import { cn, greet } from "@/lib/utils";
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
  const [ticketsData, setTicketsData] = useState<TicketType[]>([]);
  const [statsData, setStatsData] = useState<StatsType>();

  useEffect(() => {
    async function fetchTickets() {
      if (!selectedHost) return;

      const ticketsResponse = fetch(
        `/api/tickets?host=${selectedHost}&status=open,in_progress`,
      );

      const ticketsResponseData = await (await ticketsResponse).json();

      if (
        !Array.isArray(ticketsResponseData.value) &&
        !Array.isArray(ticketsResponseData)
      ) {
        console.error("Invalid tickets data:", ticketsResponseData);
        return;
      }

      setTicketsData(ticketsResponseData.value || ticketsResponseData);
    }

    async function fetchStats() {
      if (!selectedHost) return;

      // TODO: Optional cachet enrichment to improve load speeds cause this shit takes fucking ages
      const statsResponse = fetch(
        `/api/stats?host=${selectedHost}&cachetEnriched=${true}`,
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
    window.open(
      `https://hackclub.enterprise.slack.com/archives/${channelId}`,
      "_blank",
    );
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
          {session?.user ? (
            <PageDescription>
              {userStats.assigned} assigned to you · {userStats.unclaimed}{" "}
              unclaimed in the queue · {userStats.inProgress} in progress.
            </PageDescription>
          ) : (
            <PageDescription>
              Sign in to track your assigned tickets and more!
            </PageDescription>
          )}

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
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 py-2 px-6">
          <Card className="">
            <CardContent className="flex flex-col items-left gap-2">
              <p className="text-xs">LEADERBOARD RANK</p>
              <h1 className="text-4xl font-bold">#1</h1>
              <p className="text-xs">of 67 helpers</p>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent className="flex flex-col items-left gap-2">
              <p className="text-xs">LEADERBOARD RANK</p>
              <h1 className="text-4xl font-bold">#1</h1>
              <p className="text-xs">of 67 helpers</p>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent className="flex flex-col items-left gap-2">
              <p className="text-xs">LEADERBOARD RANK</p>
              <h1 className="text-4xl font-bold">#1</h1>
              <p className="text-xs">of 67 helpers</p>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent className="flex flex-col items-left gap-2">
              <p className="text-xs">LEADERBOARD RANK</p>
              <h1 className="text-4xl font-bold">
                #
                {statsData
                  ? statsData?.all_time.helpers_leaderboard.findIndex(
                      (h) => h.slack_id === session?.user?.slack_id,
                    ) + 1
                  : "?"}
              </h1>
              <p className="text-xs">
                of {statsData?.all_time.helpers_leaderboard.length} helpers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2 px-6">
          <div className="col-span-2 flex flex-col gap-4">
            {session?.user && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <h1 className="text-lg">Assigned to you</h1>
                    <p className="text-muted-foreground font-sans">
                      Something here
                    </p>
                  </div>
                  <Badge variant="default">{userStats.assigned} Tickets</Badge>
                </CardHeader>
              </Card>
            )}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <h1 className="text-lg">Unassigned queue</h1>
                  <p className="text-muted-foreground font-sans">
                    Something here
                  </p>
                </div>
                <Badge
                  variant={userStats.unclaimed > 30 ? "destructive" : "default"}
                >
                  {userStats.unclaimed} Tickets
                </Badge>
              </CardHeader>
            </Card>
          </div>
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <h1 className="text-lg">Oldest unanswered</h1>
              </CardHeader>
              <CardContent className="flex flex-col items-left gap-2">
                <h1
                  className={cn(
                    "text-4xl font-bold",
                    (statsData?.all_time.oldest_unanswered_ticket
                      ?.age_minutes || 0) /
                      60 /
                      24 >
                      6
                      ? "text-destructive"
                      : "text-primary",
                  )}
                >
                  {(
                    (statsData?.all_time.oldest_unanswered_ticket
                      ?.age_minutes || 0) /
                    60 /
                    24
                  ).toFixed(1)}
                  d
                </h1>
                <p className="text-muted-foreground">
                  slow response · #
                  {statsData?.all_time.oldest_unanswered_ticket?.id}
                </p>
                <p className="text-lg">stardance isnt dancing</p>
              </CardContent>
              <CardAction className="w-full px-4">
                <Button className="w-full text-md" size="lg">
                  VIEW TICKET
                  <ArrowUpRight size={16} />
                </Button>
              </CardAction>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2 px-6">
          <Card className="grid-cols-1">
            <CardHeader>
              <h1 className="text-lg">Open ticket ages</h1>
            </CardHeader>
          </Card>
          <Card className="grid-cols-1">
            <CardHeader>
              <h1 className="text-lg">Status breakdown</h1>
            </CardHeader>
          </Card>
          <HelperLeaderboardWidget
            helperData={statsData?.all_time?.helpers_leaderboard || []}
          />
        </div>
      </PageWrapper>
    </>
  );
}
