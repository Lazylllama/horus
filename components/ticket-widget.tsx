import { ArrowUpRight, Check, MessageCircleWarning } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { caughtUpText, cn } from "@/lib/utils";
import type { Ticket } from "@/types/nephthys";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";

type TicketWidgetTypes = "oldest" | "checkup";

interface TicketWidgetProps {
  ticket?: Ticket | null;
  ticketWidgetType: TicketWidgetTypes;
}

const TicketWidgetData: Record<TicketWidgetTypes, { title: string }> = {
  oldest: {
    title: "Oldest Unanswered",
  },
  checkup: {
    title: "Ticket Check Up",
  },
};

export function TicketWidget({ ticket, ticketWidgetType }: TicketWidgetProps) {
  const { data: session } = authClient.useSession();
  const ticketAge =
    (Date.now() - new Date(ticket?.created_at || "").getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    <Card className="min-h-72">
      <CardHeader>
        <h1 className="text-lg">{TicketWidgetData[ticketWidgetType].title}</h1>
      </CardHeader>
      {ticket?.id ? (
        <>
          <CardContent className="flex flex-col items-left gap-2">
            <h1
              className={cn(
                "text-4xl font-bold",
                (ticketAge || 0) > 6 ? "text-destructive" : "text-primary",
              )}
            >
              {(ticketAge || 0).toFixed(1)}d
            </h1>
            <p className="text-muted-foreground">
              slow response · #{ticket?.id}
            </p>
            <p className="text-lg">{ticket?.title}</p>
          </CardContent>
          <CardAction className="w-full px-4 mt-auto">
            <Button className="w-full text-md" size="lg">
              VIEW TICKET
              <ArrowUpRight size={16} />
            </Button>
          </CardAction>
        </>
      ) : (
        <CardContent className="flex flex-col items-center gap-4 justify-center my-auto">
          <div
            className={cn(
              "rounded-full size-12 flex items-center justify-center",
              !session?.user && ticketWidgetType === "checkup"
                ? "bg-destructive/30 text-destructive"
                : "bg-primary/30 text-primary",
            )}
          >
            {!session?.user && ticketWidgetType === "checkup" ? (
              <MessageCircleWarning size={28} />
            ) : (
              <Check size={36} />
            )}
          </div>
          <h1 className="font-medium text-card-foreground text-lg">
            {!session?.user && ticketWidgetType === "checkup"
              ? "Sign in to use this!"
              : caughtUpText()}
          </h1>
        </CardContent>
      )}
    </Card>
  );
}
