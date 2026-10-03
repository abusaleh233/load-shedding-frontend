import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from "@/lib/token-storage";
import type { ApiErrorResponse, ApiSuccessResponse, AuthTokens } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

/**
 * Main API client. Every service function in src/services/*.service.ts
 * goes through this instance — never call axios directly from a component
 * or hook, or the interceptors below (token attach + auto-refresh) get
 * silently bypassed.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * A second, interceptor-free instance used ONLY for the refresh-token call
 * itself. If the main `apiClient` instance made that call, its own
 * response interceptor would see a 401 (an expired/invalid refresh token)
 * and try to refresh again — an infinite loop. Keeping this bare avoids
 * that entirely, rather than special-casing the URL inside one interceptor.
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Request interceptor: attach the access token to every outgoing request.
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor: on a 401, attempt exactly one silent refresh, then
// retry the original request. Concurrent requests that 401 while a refresh
// is already in flight queue up and wait for that single refresh to finish,
// instead of each firing its own POST /auth/refresh.
// ---------------------------------------------------------------------------

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

function resolveQueue(token: string) {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
}

function rejectQueue(error: unknown) {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
}

/** Redirect to login outside of React Router context (this file isn't a component). */
function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

interface RetriableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    // Not a 401, already retried once, or the 401 came from an auth
    // endpoint itself (e.g. wrong password on login) — nothing to refresh,
    // just propagate the error as-is.
    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // A refresh is already in flight (triggered by a different request that
    // 401'd first) — queue this request instead of starting a second
    // POST /auth/refresh in parallel.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await refreshClient.post<ApiSuccessResponse<AuthTokens>>("/auth/refresh", {
        refreshToken,
      });

      const newAccessToken = data.data.accessToken;
      setAccessToken(newAccessToken);
      resolveQueue(newAccessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh token itself is invalid/expired — no way to recover
      // silently. Clear everything and send the user back to login.
      rejectQueue(refreshError);
      clearTokens();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Every backend response is wrapped in { success, message, data } (success)
 * or { success, message, errors } (error) — see error.middleware.ts /
 * response.ts on the backend. This helper unwraps `data` and normalizes
 * errors into a single string so callers don't repeat that logic.
 */
export function unwrapData<T>(response: { data: ApiSuccessResponse<T> }): T {
  return response.data.data;
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? error.message ?? "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
