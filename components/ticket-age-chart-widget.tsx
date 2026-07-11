import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import type { Ticket } from "@/types/nephthys";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

type TimeDurations =
  | "5 Minutes"
  | "1 Hour"
  | "12 Hours"
  | "24 Hours"
  | "4 Days"
  | "7 Days"
  | "More";

const chartConfig: Record<TimeDurations, { label: string; color: string }> = {
  "5 Minutes": {
    label: "Under 5 Minutes",
    color: "var(--color-primary-foreground)",
  },
  "1 Hour": {
    label: "Under 1 Hour",
    color: "var(--color-primary)",
  },
  "12 Hours": {
    label: "Under 12 Hours",
    color: "var(--color-primary)",
  },
  "24 Hours": {
    label: "Under 24 Hours",
    color: "var(--color-orange-400)",
  },
  "4 Days": {
    label: "Under 4 Days",
    color: "var(--color-orange-400)",
  },
  "7 Days": {
    label: "Under 7 Days",
    color: "var(--color-destructive)",
  },
  More: {
    label: "More",
    color: "var(--color-destructive)",
  },
};

export function TicketAgeChartWidget({
  closedTickets,
}: {
  closedTickets: Ticket[];
}) {
  const chartData: { name: TimeDurations; value: number; fill: string }[] = [
    { name: "5 Minutes", value: 0, fill: "var(--color-primary)" },
    { name: "1 Hour", value: 0, fill: "var(--color-primary)" },
    { name: "12 Hours", value: 0, fill: "var(--color-primary)" },
    { name: "24 Hours", value: 0, fill: "var(--color-orange-400)" },
    { name: "4 Days", value: 0, fill: "var(--color-orange-400)" },
    { name: "7 Days", value: 0, fill: "var(--color-destructive)" },
    { name: "More", value: 0, fill: "var(--color-destructive)" },
  ];

  // Calculate the age of each closed ticket and update the chart data
  closedTickets.forEach((ticket) => {
    if (!ticket.closed_at || !ticket.created_at) return;
    const ageInMinutes =
      (new Date(ticket.closed_at).getTime() -
        new Date(ticket.created_at).getTime()) /
      (1000 * 60);

    if (ageInMinutes <= 5) {
      chartData[0].value++;
    } else if (ageInMinutes <= 60) {
      chartData[1].value++;
    } else if (ageInMinutes <= 720) {
      chartData[2].value++;
    } else if (ageInMinutes <= 1440) {
      chartData[3].value++;
    } else if (ageInMinutes <= 5760) {
      chartData[4].value++;
    } else if (ageInMinutes <= 10080) {
      chartData[5].value++;
    } else {
      chartData[6].value++;
    }
  });

  return (
    <Card className="grid-cols-1">
      <CardHeader>
        <h1 className="text-lg">Time-to-resolution</h1>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 36,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={16}
              axisLine={false}
              tickFormatter={(value: string) =>
                value
                  .replace(" Minutes", "m")
                  .replace(" Hours", "h")
                  .replace(" Days", "d")
                  .replace(" Hour", "h")
              }
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="value" fill={`var()`} radius={4}>
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <CardDescription className="text-center mt-3">
          *Based on all tickets since start
        </CardDescription>
      </CardContent>
    </Card>
  );
}
