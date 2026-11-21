"use client";

// Adapted from the shadcn dashboard-01 block (chart-area-interactive), fed with real daily counts.
// Bars instead of a smoothed area: daily counts are small whole numbers, and curves misread them.

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { DashboardData } from "@/lib/enquiries";

const chartConfig = {
  enquiries: { label: "Enquiries", color: "var(--chart-1)" },
} satisfies ChartConfig;

const ranges = [
  { value: "90", label: "Last 3 months" },
  { value: "30", label: "Last 30 days" },
  { value: "7", label: "Last 7 days" },
] as const;

const fmt = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export function EnquiriesChart({ daily }: { daily: DashboardData["daily"] }) {
  const [range, setRange] = React.useState<string>("30");
  const data = daily.slice(-Number(range));
  const total = data.reduce((sum, d) => sum + d.enquiries, 0);
  const label = ranges.find((r) => r.value === range)!.label.toLowerCase();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Enquiries over time</CardTitle>
        <CardDescription>
          {total} in the {label}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[range]}
            onValueChange={(value) => setRange(value[0] ?? range)}
            variant="outline"
            size="sm"
            aria-label="Time range"
            className="*:data-[slot=toggle-group-item]:px-3!"
          >
            {ranges.map((r) => (
              <ToggleGroupItem key={r.value} value={r.value}>
                <span className="hidden @[640px]/card:inline">{r.label}</span>
                <span className="@[640px]/card:hidden">{r.value}d</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={data} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={fmt} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent labelFormatter={(v) => fmt(String(v))} indicator="dot" />} />
            <Bar dataKey="enquiries" fill="var(--color-enquiries)" radius={[2, 2, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
