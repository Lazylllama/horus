import { headers } from "next/headers";
import { Suspense } from "react";
import { GetNephthysHostnameFromSlug } from "@/app/actions/instance";
import {
  fetchNephthysStats,
  fetchNephthysTickets,
  fetchNephthysTicketsTTR,
} from "@/app/actions/nephthys";
import ErrorFallback from "@/app/error-boundary";
import DashboardHeader from "@/components/dashboard-header";
import { Footer } from "@/components/footer";
import { HelperLeaderboardWidget } from "@/components/helper-leaderboard";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PosthogPrefsLoader } from "@/components/posthog-prefs-loader";
import { StatusChartWidget } from "@/components/status-chart-widget";
import { SurveyWidget } from "@/components/survey-widget";
import { PageDescriptionAuth } from "@/components/text-types";
import { TicketAgeChartWidget } from "@/components/ticket-age-chart-widget";
import {
  AssignedTicketsWidget,
  UnassignedTicketsWidget,
} from "@/components/ticket-table";
import { TicketWidget } from "@/components/ticket-widget";
import { auth } from "@/lib/auth";
import type { Ticket as TicketType } from "@/types/nephthys";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ host: string }>;
}) {
  return (
    <>
      <Navbar />
      <PosthogPrefsLoader />
      <ErrorFallback title={"ERR"}>
        <PageWrapper variant="tight">
          <Suspense>
            <DashboardHeader
              params={params}
              description={
                <Suspense>
                  <PageDescriptionAuth
                    signedOutText="Sign in to see claimed tickets and more!"
                    userStats={true}
                  />
                </Suspense>
              }
            />
          </Suspense>

          <Suspense fallback={<TicketsSectionFallback />}>
            <TicketsSection params={params} />
          </Suspense>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2">
            <Suspense
              fallback={
                <>
                  <TicketAgeChartWidget />
                  <StatusChartWidget />
                  <HelperLeaderboardWidget />
                </>
              }
            >
              <StatsSection params={params} />
            </Suspense>
          </div>
        </PageWrapper>
      </ErrorFallback>
      <Footer />
    </>
  );
}

async function TicketsSection({
  params,
}: {
  params: Promise<{ host: string }>;
}) {
  const { host: selectedHost } = await params;
  const { host: hostname, slackChannel } =
    await GetNephthysHostnameFromSlug(selectedHost);
  if (!hostname)
    throw new Error("Nephthys hostname not found for the selected host");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const tickets = await fetchNephthysTickets({
    nephthysHost: hostname,
    filter: {
      status: "OPEN,IN_PROGRESS",
    },
  });

  if ("error" in tickets) throw new Error(tickets.error);

  const userStats = { assigned: 0, unclaimed: 0, inProgress: 0 };
  const slackId = session?.user?.slack_id;

  for (const ticket of tickets) {
    if (ticket.assigned_to?.slack_id === slackId) userStats.assigned++;
    else if (!ticket.assigned_to) userStats.unclaimed++;
    else if (ticket.status === "IN_PROGRESS") userStats.inProgress++;
  }

  const oldestTicket = tickets.reduce(
    (oldest, ticket) => {
      if (!oldest || ticket.created_at < oldest.created_at) {
        return ticket;
      }
      return oldest;
    },
    null as TicketType | null,
  );

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-2 min-h-66">
        <TicketWidget
          slackChannel={slackChannel}
          ticket={oldestTicket}
          ticketWidgetType={"oldest"}
        />
        <TicketWidget
          slackChannel={slackChannel}
          ticket={null} // TODO: Implement this
          ticketWidgetType={"checkup"}
        />
        <SurveyWidget />
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2">
        <div className="col-span-3 flex flex-col gap-4">
          {session?.user && (
            <AssignedTicketsWidget
              slackId={slackId}
              tickets={tickets}
              slackChannel={slackChannel}
            />
          )}
          <UnassignedTicketsWidget
            tickets={tickets}
            slackChannel={slackChannel}
          />
        </div>
      </div>
    </>
  );
}

function TicketsSectionFallback() {
  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-2 min-h-66">
        <TicketWidget ticketWidgetType={"oldest"} isLoading />
        <TicketWidget ticketWidgetType={"checkup"} isLoading />
        <SurveyWidget />
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-2">
        <div className="col-span-3 flex flex-col gap-4">
          <AssignedTicketsWidget />
          <UnassignedTicketsWidget />
        </div>
      </div>
    </>
  );
}

async function StatsSection({ params }: { params: Promise<{ host: string }> }) {
  const { host: selectedHost } = await params;
  const { host: hostname } = await GetNephthysHostnameFromSlug(selectedHost);
  if (!hostname)
    throw new Error("Nephthys hostname not found for the selected host");

  const [ticketsTTR, stats] = await Promise.all([
    fetchNephthysTicketsTTR({
      nephthysHost: hostname,
    }),
    fetchNephthysStats({
      nephthysHost: hostname,
    }),
  ]);

  if ("error" in ticketsTTR) throw new Error(ticketsTTR.error);
  if ("error" in stats) throw new Error(stats.error);

  return (
    <>
      <TicketAgeChartWidget ticketsTTR={ticketsTTR} />
      <StatusChartWidget
        openCount={stats?.all_time?.tickets_open || 0}
        inProgressCount={stats?.all_time?.tickets_in_progress || 0}
        closedCount={stats?.all_time?.tickets_closed || 0}
      />
      <HelperLeaderboardWidget
        helperData={stats?.all_time?.helpers_leaderboard || []}
      />
    </>
  );
}
