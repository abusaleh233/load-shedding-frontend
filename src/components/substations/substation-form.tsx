"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createSubstationSchema, updateSubstationSchema } from "@/lib/validators/substation.schema";
import { useCreateSubstation, useUpdateSubstation } from "@/hooks/use-substations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import type { Substation } from "@/types/api";

const STATUS_OPTIONS = ["ACTIVE", "MAINTENANCE", "DECOMMISSIONED"] as const;


interface SubstationFormValues {
  name: string;
  code?: string;
  location: string;
  capacityMW: number;
  status?: (typeof STATUS_OPTIONS)[number];
}

export function SubstationForm({ substation, onDone }: { substation?: Substation; onDone: () => void }) {
  const isEdit = !!substation;
  const createMutation = useCreateSubstation(onDone);
  const updateMutation = useUpdateSubstation(onDone);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubstationFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver((isEdit ? updateSubstationSchema : createSubstationSchema) as any),
    defaultValues: substation
      ? {
          name: substation.name,
          location: substation.location,
          capacityMW: substation.capacityMW,
          status: substation.status,
        }
      : { status: "ACTIVE" },
  });

  const onSubmit = (data: SubstationFormValues) => {
    if (isEdit) {
      updateMutation.mutate({ id: substation.id, input: data });
    } else {
      createMutation.mutate({ ...data, code: data.code ?? "" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Dhaka Central Substation" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" placeholder="SS-DHK-001" {...register("code")} />
          {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="Dhaka, Bangladesh" {...register("location")} />
        {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacityMW">Capacity (MW)</Label>
          <Input
            id="capacityMW"
            type="number"
            step="0.1"
            placeholder="150.5"
            {...register("capacityMW", { valueAsNumber: true })}
          />
          {errors.capacityMW && <p className="text-xs text-destructive">{errors.capacityMW.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create substation"}
        </Button>
      </DialogFooter>
    </form>
  );
}
