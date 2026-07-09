import { ArrowUpRight, Check } from "lucide-react";
import { caughtUpText, cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";

type TicketWidgetTypes = "oldest" | "checkup";

interface TicketWidgetProps {
  ticketAge?: number;
  ticketId?: number;
  ticketTitle?: string | null;
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

export function TicketWidget({
  ticketAge,
  ticketId,
  ticketTitle,
  ticketWidgetType,
}: TicketWidgetProps) {
  console.log(ticketAge);
  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg">{TicketWidgetData[ticketWidgetType].title}</h1>
      </CardHeader>
      {ticketId ? (
        <>
          <CardContent className="flex flex-col items-left gap-2">
            <h1
              className={cn(
                "text-4xl font-bold",
                (ticketAge || 0) / 60 / 24 > 6
                  ? "text-destructive"
                  : "text-primary",
              )}
            >
              {((ticketAge || 0) / 60 / 24).toFixed(1)}d
            </h1>
            <p className="text-muted-foreground">slow response · #{ticketId}</p>
            <p className="text-lg">{ticketTitle}</p>
          </CardContent>
          <CardAction className="w-full px-4">
            <Button className="w-full text-md" size="lg">
              VIEW TICKET
              <ArrowUpRight size={16} />
            </Button>
          </CardAction>
        </>
      ) : (
        <CardContent className="flex flex-col items-center gap-4 justify-center my-auto">
          <div className="rounded-full bg-primary text-primary-foreground size-12 flex items-center justify-center">
            <Check size={38} />
          </div>
          <h1 className="font-medium text-card-foreground text-lg">
            {caughtUpText()}
          </h1>
        </CardContent>
      )}
    </Card>
  );
}
