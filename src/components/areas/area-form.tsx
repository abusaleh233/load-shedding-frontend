"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createAreaSchema, updateAreaSchema } from "@/lib/validators/area.schema";
import { useCreateArea, useUpdateArea } from "@/hooks/use-areas";
import { useSubstations } from "@/hooks/use-substations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import type { Area } from "@/types/api";

interface AreaFormValues {
  name: string;
  feederCode?: string;
  substationId: string;
}

export function AreaForm({ area, onDone }: { area?: Area; onDone: () => void }) {
  const isEdit = !!area;
  const { data: substationsData, isLoading: substationsLoading } = useSubstations();
  const createMutation = useCreateArea(onDone);
  const updateMutation = useUpdateArea(onDone);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AreaFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver((isEdit ? updateAreaSchema : createAreaSchema) as any),
    defaultValues: area ? { name: area.name, substationId: area.substationId } : undefined,
  });

  const onSubmit = (data: AreaFormValues) => {
    if (isEdit) {
      updateMutation.mutate({ id: area.id, input: data });
    } else {
      createMutation.mutate({ ...data, feederCode: data.feederCode ?? "" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Gulshan Feeder Zone" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="feederCode">Feeder code</Label>
          <Input id="feederCode" placeholder="FDR-GLSN-01" {...register("feederCode")} />
          {errors.feederCode && <p className="text-xs text-destructive">{errors.feederCode.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="substationId">Substation</Label>
        <Controller
          name="substationId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={substationsLoading}>
              <SelectTrigger id="substationId">
                <SelectValue placeholder={substationsLoading ? "Loading…" : "Select a substation"} />
              </SelectTrigger>
              <SelectContent>
                {substationsData?.substations.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.substationId && <p className="text-xs text-destructive">{errors.substationId.message}</p>}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create area"}
        </Button>
      </DialogFooter>
    </form>
  );
}
