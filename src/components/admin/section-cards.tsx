// Adapted from the shadcn dashboard-01 block. All numbers are real counts from the database.

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/enquiries";

export function SectionCards({ stats }: { stats: DashboardData["stats"] }) {
  const change = stats.prev30 > 0 ? Math.round(((stats.last30 - stats.prev30) / stats.prev30) * 100) : null;
  const up = change !== null && change >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-tint/60 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Awaiting reply</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stats.open}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Enquiries marked New</div>
          <div className="text-muted-foreground">Reply, then mark them Contacted</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Last 30 days</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stats.last30}</CardTitle>
          {change !== null ? (
            <CardAction>
              <Badge variant="outline">
                {up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                {up ? "+" : ""}
                {change}%
              </Badge>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">{stats.prev30} in the 30 days before</div>
          <div className="text-muted-foreground">New enquiries received</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Most requested</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">{stats.topNeed?.need ?? "None yet"}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            {stats.topNeed ? `${stats.topNeed.count} enquiries` : "No enquiries"} in the last 90 days
          </div>
          <div className="text-muted-foreground">From the &quot;What do you need?&quot; field</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total stored</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stats.total}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">All enquiries on record</div>
          <div className="text-muted-foreground">Deleted automatically after 12 months</div>
        </CardFooter>
      </Card>
    </div>
  );
}
