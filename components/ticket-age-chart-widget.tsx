import { Card, CardHeader } from "./ui/card";

export function TicketAgeChartWidget() {
  return (
    <Card className="grid-cols-1">
      <CardHeader>
        <h1 className="text-lg">Open ticket ages</h1>
      </CardHeader>
    </Card>
  );
}
