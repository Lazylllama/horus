"use client";

import { ArrowUpRight } from "lucide-motion";
import { useRouter } from "next/navigation";
import { createContext, use, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { nephthysHosts, type Ticket } from "@/lib/nephthys";
import { cn, greet } from "@/lib/utils";

export const NavbarContext = createContext(nephthysHosts[0].host);

export default function Dashboard({
  params,
}: {
  params: Promise<{ host: string }>;
}) {
  const router = useRouter();
  const { host: selectedHost } = use(params);
  const { data: session, isPending } = authClient.useSession();
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      if (!selectedHost) return;

      const openTicketsResponse = fetch(
        `/api/tickets?host=${selectedHost}&status=open,in_progress`,
      );

      const ticketsData = await (await openTicketsResponse).json();

      if (!Array.isArray(ticketsData.value) && !Array.isArray(ticketsData)) {
        console.error("Invalid tickets data:", ticketsData.value);
        return;
      }

      setTicketsData(ticketsData.value || ticketsData);
    }
    fetchTickets();
  }, [selectedHost]);

  const userStats = useMemo(() => {
    const stats = {
      assigned: 0,
      unclaimed: 0,
      inProgress: 0,
    };

    if (isPending || !session?.user?.slack_id) return stats;

    for (const ticket of ticketsData) {
      if (ticket.assigned_to) console.log(ticket.assigned_to);
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
    console.log("Invalid host:", selectedHost);
    router.push("/");
  }

  function switchHost() {
    localStorage.removeItem("nephthysHost");
    router.push("/");
  }

  return (
    <NavbarContext.Provider value={selectedHost}>
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
            <Button size="lg" variant="default">
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
              <h1 className="text-4xl font-bold">#1</h1>
              <p className="text-xs">of 67 helpers</p>
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
                    // 6 > 2 ? "text-destructive" : "text-primary",
                    "text-destructive",
                  )}
                >
                  6d
                </h1>
                <p className="text-muted-foreground">slow response · #420</p>
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
          <Card className="grid-cols-1">
            <CardHeader>
              <h1 className="text-lg">Helper leaderboard</h1>
            </CardHeader>
            <CardContent className="flex flex-col items-left gap-2">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                  <p className="text-muted-foreground">1</p>
                  <Avatar>
                    <AvatarImage
                      className="rounded-sm"
                      src="https://avatars.slack-edge.com/2026-06-01/11252913030068_6e0960f84c3ce8e76cae_512.png"
                    />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <p>Simon K</p>
                    <div className="bg-muted w-full h-1">
                      <div
                        className="bg-primary h-1"
                        style={{ width: `${(420 / 420) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">420</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                  <p className="text-muted-foreground">2</p>
                  <Avatar>
                    <AvatarImage
                      className="rounded-sm"
                      src="https://avatars.slack-edge.com/2025-12-09/10077925689238_2149e0ba18d7110e7a3f_512.png"
                    />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <p>Carlson</p>
                    <div className="bg-muted w-full h-1">
                      <div
                        className="bg-primary h-1"
                        style={{ width: `${(280 / 420) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">280</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                  <p className="text-muted-foreground">3</p>
                  <Avatar>
                    <AvatarImage
                      className="rounded-sm"
                      src="https://avatars.slack-edge.com/2026-06-30/11478740980326_bfa75d4922a7c9ea5a91_512.png"
                    />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <p>spj</p>
                    <div className="bg-muted w-full h-1">
                      <div
                        className="bg-primary h-1"
                        style={{ width: `${(135 / 420) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">135</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </NavbarContext.Provider>
  );
}
