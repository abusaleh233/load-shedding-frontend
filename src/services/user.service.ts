import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, PaginatedResponse, Role, User } from "@/types/api";

export async function listUsers(params?: { page?: number; limit?: number; role?: string }) {
  const response = await apiClient.get<ApiSuccessResponse<PaginatedResponse<User, "users">>>("/users", { params });
  return unwrapData(response);
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}

/** PATCH /users/me — the caller's own profile, any authenticated role.
 *  (GET /users/me already exists as authService.getMe() — reused by the
 *  profile page rather than duplicated here.) */
export async function updateMyProfile(input: UpdateProfileInput): Promise<User> {
  const response = await apiClient.patch<ApiSuccessResponse<User>>("/users/me", input);
  return unwrapData(response);
}

export async function updateUserRole(userId: string, role: Role): Promise<User> {
  const response = await apiClient.patch<ApiSuccessResponse<User>>(`/users/${userId}/role`, { role });
  return unwrapData(response);
}

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}
