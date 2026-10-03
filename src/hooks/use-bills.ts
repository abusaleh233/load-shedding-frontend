"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as billService from "@/services/bill.service";
import { extractErrorMessage } from "@/services/api-client";
import type { CreateBillInput, UpdateBillInput } from "@/services/bill.service";
import type { BillStatus } from "@/types/api";

/**
 * Same endpoint for everyone — the backend already scopes the result by
 * role (CONSUMER sees only their own bills, ADMIN/OPERATOR see everyone's),
 * so this one hook covers both "My Bills" and the operator/admin bills
 * management table.
 */
export function useBills(params?: { status?: BillStatus; userId?: string; areaId?: string }) {
  return useQuery({ queryKey: ["bills", "list", params], queryFn: () => billService.listBills(params) });
}

export function useCreateBill(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBillInput) => billService.createBill(input),
    onSuccess: () => {
      toast.success("Bill created");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateBill(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBillInput }) => billService.updateBill(id, input),
    onSuccess: () => {
      toast.success("Bill updated");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billService.deleteBill(id),
    onSuccess: () => {
      toast.success("Bill deleted");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function usePayBill() {
  return useMutation({
    mutationFn: (billId: string) => billService.createCheckoutSession(billId),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Stripe didn't return a checkout URL");
      }
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
