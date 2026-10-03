"use client";

import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useReportOutage } from "@/hooks/use-outages";
import { useAreas } from "@/hooks/use-areas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import type { CreateOutageInput } from "@/services/outage.service";
import type { OutageType, PriorityLevel } from "@/types/api";

const PRIORITIES: PriorityLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface OutageFormProps {
  onDone: () => void;
  /** CONSUMER can only ever report EMERGENCY — the backend 403s on SCHEDULED for that role. */
  restrictToEmergency?: boolean;
}

export function OutageForm({ onDone, restrictToEmergency = false }: OutageFormProps) {
  const { data: areasData, isLoading: areasLoading } = useAreas();
  const reportMutation = useReportOutage(onDone);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateOutageInput>({
    defaultValues: { type: "EMERGENCY", priority: "MEDIUM" },
  });

  const onSubmit = (data: CreateOutageInput) => reportMutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="areaId">Area</Label>
        <Controller
          name="areaId"
          control={control}
          rules={{ required: "Please select an area" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={areasLoading}>
              <SelectTrigger id="areaId">
                <SelectValue placeholder={areasLoading ? "Loading areas…" : "Select an area"} />
              </SelectTrigger>
              <SelectContent>
                {areasData?.areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name} ({area.feederCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.areaId && <p className="text-xs text-destructive">{errors.areaId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          {restrictToEmergency ? (
            <Select value="EMERGENCY" disabled>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMERGENCY">Emergency</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(v as OutageType)} value={field.value}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(v as PriorityLevel)} value={field.value}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" placeholder="What's happening?" {...register("description")} />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={reportMutation.isPending}>
          {reportMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Report outage
        </Button>
      </DialogFooter>
    </form>
  );
}
