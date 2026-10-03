import { apiClient, unwrapData } from "./api-client";
import type { ApiSuccessResponse, AuthResponse, User } from "@/types/api";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth.schema";

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/login", input);
  return unwrapData(response);
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/register", input);
  return unwrapData(response);
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/google", { idToken });
  return unwrapData(response);
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", { refreshToken });
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiSuccessResponse<User>>("/users/me");
  return unwrapData(response);
}
