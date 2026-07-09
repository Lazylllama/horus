import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

export function StatusChartWidget({
  openCount,
  inProgressCount,
  closedCount,
}: {
  openCount: number;
  inProgressCount: number;
  closedCount: number;
}) {
  const chartConfig = {
    value: {
      label: "Tickets",
    },
    OPEN: {
      label: "Waiting",
      color: "var(--chart-1)",
    },
    IN_PROGRESS: {
      label: "In Progress",
      color: "var(--chart-2)",
    },
    CLOSED: {
      label: "Closed",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const chartData = [
    {
      status: "OPEN",
      value: openCount,
      fill: "var(--destructive)",
    },
    {
      status: "IN_PROGRESS",
      value: inProgressCount,
      fill: "var(--color-orange-400)",
    },
    {
      status: "CLOSED",
      value: closedCount,
      fill: "var(--primary)",
    },
  ];

  return (
    <Card className="grid-cols-1">
      <CardHeader>
        <h1 className="text-lg">Status breakdown</h1>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey={"value"}
              nameKey={"status"}
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-primary"
                      >
                        <tspan
                          className="fill-foreground text-2xl font-bold"
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          {chartData.reduce((sum, item) => sum + item.value, 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 20}
                          className="fill-muted-foreground"
                        >
                          Tickets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
