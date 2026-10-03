"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllPayments, getPaymentHistory } from "@/services/payment.service";

export function usePaymentHistory(params?: { page?: number; limit?: number }) {
  return useQuery({ queryKey: ["payments", "history", params], queryFn: () => getPaymentHistory(params) });
}

export function useAllPayments(params?: { page?: number; limit?: number }) {
  return useQuery({ queryKey: ["payments", "all", params], queryFn: () => getAllPayments(params) });
}
