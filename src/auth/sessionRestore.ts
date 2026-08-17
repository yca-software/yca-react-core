/** Placeholder when the refresh token lives in an HttpOnly cookie (not readable by JS). */
export const HTTP_ONLY_REFRESH_MARKER = '__http_only_cookie__';

/**
 * Refresh token the API client should act on.
 *
 * HttpOnly: JS cannot see the cookie. Return a marker so 401 retries can POST
 * `/auth/refresh` with credentials, unless restore already failed or the caller
 * forbids a blind refresh (public sign-in with no access cookie / session).
 */
export function resolveApiRefreshToken(input: {
  httpOnly: boolean;
  sessionRestoreFailed: boolean;
  readRefreshCookie: () => string | null;
  /** False on public auth routes when there is no access cookie and no in-memory session. */
  cookieRefreshAllowed: boolean;
}): string | null {
  if (!input.httpOnly) {
    return input.readRefreshCookie();
  }
  if (input.sessionRestoreFailed || !input.cookieRefreshAllowed) {
    return null;
  }
  return HTTP_ONLY_REFRESH_MARKER;
}

/**
 * GET /users/me statuses that mean the account is gone — not a deploy blip.
 * HTTP 401 must not log the SPA out: the API client refreshes the access JWT.
 */
export function isInvalidSessionStatus(status: number | undefined): boolean {
  return status === 404;
}
