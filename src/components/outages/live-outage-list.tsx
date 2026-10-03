"use client";

import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, RadioTower } from "lucide-react";
import { useLiveOutages } from "@/hooks/use-live-outages";
import { OutageStatusBadge, PriorityBadge } from "@/components/outages/outage-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LiveOutageList() {
  const { data: outages, isLoading, isError } = useLiveOutages();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Couldn&apos;t load live outages. Retrying automatically every 30 seconds.
      </div>
    );
  }

  if (!outages || outages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border p-12 text-center">
        <RadioTower className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No active outages right now</p>
        <p className="text-sm text-muted-foreground">This list refreshes automatically every 30 seconds.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {outages.map((outage) => (
        <Card key={outage.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">{outage.area?.name ?? "Unknown area"}</CardTitle>
              <p className="font-data text-xs text-muted-foreground">
                {outage.area?.feederCode} · {outage.area?.substation?.name}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <PriorityBadge priority={outage.priority} />
              <OutageStatusBadge status={outage.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {outage.description && <p className="text-sm">{outage.description}</p>}
            <p className="font-data text-xs text-muted-foreground">
              {outage.type === "EMERGENCY" ? "Emergency" : "Scheduled"} · started{" "}
              {formatDistanceToNow(new Date(outage.startTime), { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
