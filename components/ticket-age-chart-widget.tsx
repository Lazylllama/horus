"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import type { TicketTTR, TimeDurations } from "@/types/nephthys";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

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
  ticketsTTR,
}: {
  ticketsTTR?: TicketTTR | undefined;
}) {
  if (!ticketsTTR) {
    return (
      <Card className="grid-cols-1">
        <CardHeader>
          <h1 className="text-lg">Time-to-resolution</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No data available for Time-to-Resolution (TTR)
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="grid-cols-1">
      <CardHeader>
        <h1 className="text-lg">Time-to-resolution</h1>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={ticketsTTR}
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
