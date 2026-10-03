"use client";

import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useCreateBill, useUpdateBill } from "@/hooks/use-bills";
import { useAreas } from "@/hooks/use-areas";
import { useUsers } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import type { Bill } from "@/types/api";

interface BillFormValues {
  userId: string;
  areaId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  unitsConsumedKWh: number;
  amountDue: number; // entered in major units (e.g. dollars); converted to cents on submit
  currency: string;
  dueDate: string;
}

function toDateInputValue(iso: string) {
  return iso.slice(0, 10); // "2026-08-01T00:00:00.000Z" -> "2026-08-01"
}

export function BillForm({ bill, onDone }: { bill?: Bill; onDone: () => void }) {
  const isEdit = !!bill;
  const { data: areasData, isLoading: areasLoading } = useAreas();
  const { data: usersData, isLoading: usersLoading } = useUsers({ role: "CONSUMER" });
  const createMutation = useCreateBill(onDone);
  const updateMutation = useUpdateBill(onDone);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BillFormValues>({
    defaultValues: bill
      ? {
          userId: bill.userId,
          areaId: bill.areaId,
          billingPeriodStart: toDateInputValue(bill.billingPeriodStart),
          billingPeriodEnd: toDateInputValue(bill.billingPeriodEnd),
          unitsConsumedKWh: bill.unitsConsumedKWh,
          amountDue: bill.amountDue / 100,
          currency: bill.currency,
          dueDate: toDateInputValue(bill.dueDate),
        }
      : { currency: "usd" },
  });

  const onSubmit = (data: BillFormValues) => {
    if (isEdit) {
      updateMutation.mutate({
        id: bill.id,
        input: { amountDue: Math.round(data.amountDue * 100), dueDate: new Date(data.dueDate).toISOString() },
      });
      return;
    }
    createMutation.mutate({
      userId: data.userId,
      areaId: data.areaId,
      billingPeriodStart: new Date(data.billingPeriodStart).toISOString(),
      billingPeriodEnd: new Date(data.billingPeriodEnd).toISOString(),
      unitsConsumedKWh: Number(data.unitsConsumedKWh),
      amountDue: Math.round(data.amountDue * 100),
      currency: data.currency,
      dueDate: new Date(data.dueDate).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isEdit && (
        <>
          <div className="space-y-2">
            <Label htmlFor="userId">Consumer</Label>
            <Controller
              name="userId"
              control={control}
              rules={{ required: "Please select a consumer" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={usersLoading}>
                  <SelectTrigger id="userId">
                    <SelectValue placeholder={usersLoading ? "Loading…" : "Select a consumer"} />
                  </SelectTrigger>
                  <SelectContent>
                    {usersData?.users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaId">Area</Label>
            <Controller
              name="areaId"
              control={control}
              rules={{ required: "Please select an area" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={areasLoading}>
                  <SelectTrigger id="areaId">
                    <SelectValue placeholder={areasLoading ? "Loading…" : "Select an area"} />
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
              <Label htmlFor="billingPeriodStart">Period start</Label>
              <Input id="billingPeriodStart" type="date" {...register("billingPeriodStart", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingPeriodEnd">Period end</Label>
              <Input id="billingPeriodEnd" type="date" {...register("billingPeriodEnd", { required: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitsConsumedKWh">Units consumed (kWh)</Label>
            <Input
              id="unitsConsumedKWh"
              type="number"
              step="0.01"
              placeholder="250"
              {...register("unitsConsumedKWh", { valueAsNumber: true, required: true })}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amountDue">Amount due</Label>
          <Input
            id="amountDue"
            type="number"
            step="0.01"
            placeholder="1500.00"
            {...register("amountDue", { valueAsNumber: true, required: true })}
          />
          {errors.amountDue && <p className="text-xs text-destructive">Amount is required</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          {isEdit ? (
            <Input id="currency" value={bill.currency.toUpperCase()} disabled />
          ) : (
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="bdt">BDT</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input id="dueDate" type="date" {...register("dueDate", { required: true })} />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create bill"}
        </Button>
      </DialogFooter>
    </form>
  );
}
