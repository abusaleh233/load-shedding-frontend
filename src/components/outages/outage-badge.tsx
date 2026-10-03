import { Badge } from "@/components/ui/badge";
import type { OutageLogStatus, PriorityLevel } from "@/types/api";

const STATUS_VARIANT: Record<OutageLogStatus, "warning" | "secondary" | "success"> = {
  REPORTED: "warning",
  IN_PROGRESS: "secondary",
  RESOLVED: "success",
};

const STATUS_LABEL: Record<OutageLogStatus, string> = {
  REPORTED: "Reported",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export function OutageStatusBadge({ status }: { status: OutageLogStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

const PRIORITY_VARIANT: Record<PriorityLevel, "outline" | "secondary" | "warning" | "destructive"> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "warning",
  CRITICAL: "destructive",
};

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  return <Badge variant={PRIORITY_VARIANT[priority]}>{priority}</Badge>;
}
