import {
  type Grid,
  useClientDataSource,
} from "@1771technologies/lytenyte-core";
import type { CellRendererParams } from "@1771technologies/lytenyte-core/types";
import { ArrowUpRight, MailWarning } from "lucide-react";
import { LyteNyte } from "@/components/lytenyte-core";
import { cn, relativeTime, SlackMessageLink } from "@/lib/utils";
import type { Ticket } from "@/types/nephthys";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

type Spec = Grid.GridSpec<Ticket>;

const minute = 60,
  hour = minute * 60,
  day = hour * 24,
  week = day * 7;

function OpenRandomTicket(tickets: Ticket[], slackChannel: string) {
  const randomIndex = Math.floor(Math.random() * tickets.length);
  const ticketLink = SlackMessageLink(
    slackChannel,
    tickets[randomIndex].message_ts,
  );

  window.open(ticketLink, "_blank");
}

function TicketTable({
  tickets,
  slackChannel,
}: {
  tickets: Ticket[];
  slackChannel: string;
}) {
  const ticketsData = useClientDataSource<Ticket>({
    data: tickets,
  });

  const ticketsHeader: Grid.Column<Spec>[] = [
    { id: "id", name: "ID", width: 40, cellRenderer: IDCellRenderer },
    {
      id: "title",
      name: "Title",
      width: 420,
      cellRenderer: ({ api, row }) => {
        if (!api.rowIsLeaf(row) || !row.data) return;
        return (
          <a
            href={SlackMessageLink(slackChannel, row.data.message_ts)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {row.data.title}
          </a>
        );
      },
    },
    {
      id: "status",
      name: "Status",
      width: 125,
      cellRenderer: StatusCellRenderer,
    },
    {
      id: "opened_by",
      name: "Opened By",
      width: 250,
      cellRenderer: UserCellRenderer,
    },
    {
      id: "created_at",
      name: "Created",
      width:   (tickets.length < 12 ? 163 : 150), // Fits perfect in max width (needs fix for longer lists)
      cellRenderer: DateCellRenderer,
    },
  ];
  return <LyteNyte columns={ticketsHeader} rowSource={ticketsData} />;
}

export function AssignedTicketsWidget({
  tickets,
  slackId,
  slackChannel,
}: {
  tickets: Ticket[];
  slackId: string;
  slackChannel: string;
}) {
  const assignedTickets = tickets.filter(
    (ticket) => ticket.assigned_to?.slack_id === slackId,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-lg">Assigned to you</h1>
          <p className="text-muted-foreground font-sans">Something here</p>
        </div>
        <Badge variant="default">{assignedTickets.length} Tickets</Badge>
      </CardHeader>
      <CardContent className="h-125">
        <TicketTable tickets={assignedTickets} slackChannel={slackChannel} />
      </CardContent>
    </Card>
  );
}

export function UnassignedTicketsWidget({
  tickets,
  slackChannel,
}: {
  tickets: Ticket[];
  slackChannel: string;
}) {
  const unassignedTickets = tickets.filter((ticket) => !ticket.assigned_to);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-lg">Unassigned queue</h1>
          <Button
            className={"mt-2"}
            onClick={() => OpenRandomTicket(unassignedTickets, slackChannel)}
            variant={"outline"}
          >
            Open random
            <ArrowUpRight />
          </Button>
        </div>
        <Badge
          variant={unassignedTickets.length > 50 ? "destructive" : "default"}
        >
          {unassignedTickets.length} Tickets
        </Badge>
      </CardHeader>
      <CardContent className="h-125">
        <TicketTable tickets={unassignedTickets} slackChannel={slackChannel} />
      </CardContent>
    </Card>
  );
}

function IDCellRenderer({ api, row }: CellRendererParams<Spec>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  return `#${row.data.id}`;
}

function StatusCellRenderer({ api, row }: CellRendererParams<Spec>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const statusMap = {
    IN_PROGRESS: {
      text: "In Progress",
      variant: "default",
    },
    OPEN: {
      text: "Waiting",
      variant: "orange",
    },
    CLOSED: {
      text: "Closed",
      variant: "destructive",
    },
  } as const;

  const status = statusMap[row.data.status as keyof typeof statusMap];

  return (
    <Badge variant={status?.variant || "default"}>
      {status?.text || row.data.status}
    </Badge>
  );
}

function UserCellRenderer({ api, row }: CellRendererParams<Spec>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  return (
    <span className="flex flex-row justify-center items-center gap-2">
      <Avatar size={"sm"}>
        <AvatarImage
          src={`https://cachet.hackclub.com/users/${row.data.opened_by?.slack_id}/r`}
        />
        <AvatarFallback>
          {row.data.opened_by?.username?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      {row.data.opened_by?.username}
    </span>
  );
}

function DateCellRenderer({ api, row }: CellRendererParams<Spec>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const date = new Date(row.data.created_at);
  const delta = Math.round((Date.now() - +date) / 1000);
  const since = relativeTime(delta);

  return (
    <span
      className={cn(
        delta < 2 * day
          ? "text-primary"
          : delta > week
            ? "text-destructive"
            : "text-orange-400",
        "flex flex-row justify-center items-center gap-1",
      )}
    >
      {delta > week && <MailWarning size={16} className="text-destructive" />}
      {since}
    </span>
  );
}
