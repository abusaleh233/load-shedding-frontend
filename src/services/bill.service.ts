import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, Bill, BillStatus, PaginatedResponse } from "@/types/api";

export async function listBills(params?: {
  page?: number;
  limit?: number;
  status?: BillStatus;
  userId?: string;
  areaId?: string;
}) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Bill, "bills">>>("/bills", {
    params: { limit: 50, ...params },
  });
  return unwrapData(response);
}

export async function getBillById(id: string): Promise<Bill> {
  const response = await apiClient.get<ApiSuccessResponse<Bill>>(`/bills/${id}`);
  return unwrapData(response);
}

export interface CreateBillInput {
  userId: string;
  areaId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  unitsConsumedKWh: number;
  amountDue: number;
  currency: string;
  dueDate: string;
}

export async function createBill(input: CreateBillInput): Promise<Bill> {
  const response = await apiClient.post<ApiSuccessResponse<Bill>>("/bills", input);
  return unwrapData(response);
}

export interface UpdateBillInput {
  amountDue?: number;
  dueDate?: string;
  status?: Extract<BillStatus, "OVERDUE" | "CANCELLED">;
}

export async function updateBill(id: string, input: UpdateBillInput): Promise<Bill> {
  const response = await apiClient.patch<ApiSuccessResponse<Bill>>(`/bills/${id}`, input);
  return unwrapData(response);
}

export async function deleteBill(id: string): Promise<void> {
  await apiClient.delete(`/bills/${id}`);
}

export async function createCheckoutSession(billId: string) {
  const response = await apiClient.post<ApiSuccessResponse<{ checkoutUrl: string | null }>>(
    "/payments/create-checkout-session",
    { billId }
  );
  return unwrapData(response);
}
