import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, PaginatedResponse, Payment } from "@/types/api";

export async function getPaymentHistory(params?: { page?: number; limit?: number }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Payment, "payments">>>(
    "/payments/history",
    { params: { limit: 50, ...params } }
  );
  return unwrapData(response);
}

export async function getAllPayments(params?: { page?: number; limit?: number }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<Payment, "payments">>>("/payments", {
    params,
  });
  return unwrapData(response);
}
