"use client";

import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/layout/role-guard";
import { ScheduleForm } from "@/components/schedules/schedule-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewSchedulePage() {
  const router = useRouter();

  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR"]}>
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold">New schedule</h2>
          <p className="text-sm text-muted-foreground">Plan a load-shedding window for an area.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Schedule details</CardTitle>
            <CardDescription>Overlapping windows for the same area are rejected automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleForm onCreated={() => router.push("/operator/schedules")} />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
