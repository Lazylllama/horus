import {
  type Grid,
  useClientDataSource,
} from "@1771technologies/lytenyte-core";
import type { CellRendererParams } from "@1771technologies/lytenyte-core/types";
import { LyteNyte } from "@/components/lytenyte-core";
import { relativeTime, SlackMessageLink } from "@/lib/utils";
import type { Ticket } from "@/types/nephthys";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";

type Spec = Grid.GridSpec<Ticket>;

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

  const assignedTicketsHeader: Grid.Column<Spec>[] = [
    { id: "id", name: "ID", width: 40, cellRenderer: IDCellRenderer },
    {
      id: "title",
      name: "Title",
      width: 400,
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
      width: 100,
      cellRenderer: StatusCellRenderer,
    },
    { id: "opened_by", name: "Opened By", cellRenderer: UserCellRenderer },
    {
      id: "created_at",
      name: "Created",
      width: 150,
      cellRenderer: DateCellRenderer,
    },
  ];
  return <LyteNyte columns={assignedTicketsHeader} rowSource={ticketsData} />;
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
          <p className="text-muted-foreground font-sans">Something here</p>
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

  return <span>{row.data.opened_by?.username}</span>;
}

function DateCellRenderer({ api, row }: CellRendererParams<Spec>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const date = new Date(row.data.created_at);
  const delta = Math.round((Date.now() - +date) / 1000);
  const since = relativeTime(delta);
  return <span>{since}</span>;
}
