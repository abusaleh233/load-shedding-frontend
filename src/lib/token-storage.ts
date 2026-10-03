/**
 * Single source of truth for reading/writing the access + refresh tokens.
 *
 * This is deliberately a plain module, not part of the Zustand auth store
 * (src/stores/auth-store.ts). api-client.ts needs to read/write tokens on
 * every request and on 401, and the auth store needs to call
 * auth.service.ts (login/refresh/logout) which itself calls api-client.ts.
 * If api-client.ts imported the Zustand store directly, that would be a
 * circular import (store -> service -> api-client -> store). Routing both
 * through this tiny, dependency-free module breaks the cycle.
 *
 * Tokens are persisted to localStorage so a page refresh doesn't force a
 * re-login, and mirrored in a module-level variable so reads inside the
 * same tab don't pay a synchronous localStorage hit on every request.
 */

const ACCESS_TOKEN_KEY = "lsp_access_token";
const REFRESH_TOKEN_KEY = "lsp_refresh_token";
const ROLE_COOKIE = "lsp_role";
const SESSION_COOKIE = "lsp_session";

let accessTokenCache: string | null = null;
let refreshTokenCache: string | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * middleware.ts runs at the edge, before any page renders, and has no
 * access to localStorage (that only exists in the browser's JS runtime).
 * So alongside the real tokens in localStorage, we set two small,
 * non-sensitive cookies purely so middleware can make a fast routing
 * decision (is there a session at all? which role?) without needing the
 * actual JWTs. This is a UX convenience, NOT the security boundary — the
 * backend independently re-checks the real access token and role on every
 * request via its own auth + RBAC middleware, so a forged cookie can get
 * someone to the wrong-looking page shell, never to real data.
 */
function setRoutingCookies(role: string) {
  if (!isBrowser()) return;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearRoutingCookies() {
  if (!isBrowser()) return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}

export function getAccessToken(): string | null {
  if (accessTokenCache !== null) return accessTokenCache;
  if (!isBrowser()) return null;
  accessTokenCache = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return accessTokenCache;
}

export function getRefreshToken(): string | null {
  if (refreshTokenCache !== null) return refreshTokenCache;
  if (!isBrowser()) return null;
  refreshTokenCache = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  return refreshTokenCache;
}

export function setTokens(accessToken: string, refreshToken: string, role: string): void {
  accessTokenCache = accessToken;
  refreshTokenCache = refreshToken;
  if (isBrowser()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setRoutingCookies(role);
  }
}

/** Updates only the access token — used after a successful silent refresh. */
export function setAccessToken(accessToken: string): void {
  accessTokenCache = accessToken;
  if (isBrowser()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
}

export function clearTokens(): void {
  accessTokenCache = null;
  refreshTokenCache = null;
  if (isBrowser()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearRoutingCookies();
  }
}
