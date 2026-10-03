"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createScheduleSchema, type CreateScheduleInput } from "@/lib/validators/schedule.schema";
import { useCreateSchedule } from "@/hooks/use-schedules";
import { useAreas } from "@/hooks/use-areas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ScheduleForm({ onCreated }: { onCreated?: () => void }) {
  const { data: areasData, isLoading: areasLoading } = useAreas();
  const createSchedule = useCreateSchedule(onCreated);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateScheduleInput>({ resolver: zodResolver(createScheduleSchema) });

  const onSubmit = (data: CreateScheduleInput) => {
    createSchedule.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="areaId">Area</Label>
        <Controller
          name="areaId"
          control={control}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start time</Label>
          <Input id="startTime" type="datetime-local" {...register("startTime")} />
          {errors.startTime && <p className="text-xs text-destructive">{errors.startTime.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End time</Label>
          <Input id="endTime" type="datetime-local" {...register("endTime")} />
          {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" placeholder="Routine transformer maintenance" {...register("reason")} />
        {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
      </div>

      <Button type="submit" disabled={createSchedule.isPending}>
        {createSchedule.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Create schedule
      </Button>

      <p className="text-xs text-muted-foreground">
        If this overlaps an existing, non-cancelled schedule for the same area, the server will reject it with a
        conflict — the exact clashing time window shows up as an error above.
      </p>
    </form>
  );
}
