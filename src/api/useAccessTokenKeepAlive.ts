import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useApiClientConfig } from './ApiClientContext';
import { executeConfiguredRefresh } from './request';

/** Typical access JWT TTL is 15m — refresh ahead of expiry. */
const REFRESH_SKEW_MS = 2 * 60 * 1000;
/** Cap so we re-check often enough if the JWT has no exp. */
const KEEP_ALIVE_MAX_DELAY_MS = 4 * 60 * 1000;

export function accessTokenNeedsRefresh(
  token: string | null,
  nowMs: number = Date.now(),
  skewMs: number = REFRESH_SKEW_MS,
): boolean {
  return msUntilAccessRefresh(token, nowMs, skewMs) === 0;
}

/** Milliseconds until the access JWT should be refreshed (0 = now). */
export function msUntilAccessRefresh(
  token: string | null,
  nowMs: number = Date.now(),
  skewMs: number = REFRESH_SKEW_MS,
): number {
  if (!token) return 0;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (typeof exp !== 'number') return 0;
    return Math.max(0, exp * 1000 - skewMs - nowMs);
  } catch {
    return 0;
  }
}

export type UseAccessTokenKeepAliveOptions = {
  /** When false, no timers or listeners are registered. */
  enabled: boolean;
  /** Same accessor the API client uses (cookie and/or in-memory). */
  getAccessToken: () => string | null;
};

/**
 * Keeps the access token fresh while a session exists.
 * - Timeout scheduled from JWT exp (capped at 4 minutes)
 * - Also refreshes on visibility / focus / pageshow after expiry
 */
export function useAccessTokenKeepAlive(options: UseAccessTokenKeepAliveOptions): void {
  const apiConfig = useApiClientConfig();
  const { enabled, getAccessToken } = options;

  useEffect(() => {
    if (!enabled || !apiConfig.refresh) {
      return;
    }

    const refreshIfNeeded = () => {
      if (!accessTokenNeedsRefresh(getAccessToken())) {
        return;
      }
      void executeConfiguredRefresh(apiConfig).catch(() => {
        // Hard auth failures clear via onRefreshFailure only while the tab is visible.
      });
    };

    let timeoutId = 0;
    const schedule = () => {
      window.clearTimeout(timeoutId);
      const until = msUntilAccessRefresh(getAccessToken());
      const delay =
        until === 0 ? KEEP_ALIVE_MAX_DELAY_MS : Math.min(until, KEEP_ALIVE_MAX_DELAY_MS);
      timeoutId = window.setTimeout(() => {
        refreshIfNeeded();
        schedule();
      }, delay);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshIfNeeded();
        schedule();
      }
    };

    refreshIfNeeded();
    schedule();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', refreshIfNeeded);
    window.addEventListener('pageshow', refreshIfNeeded);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', refreshIfNeeded);
      window.removeEventListener('pageshow', refreshIfNeeded);
      window.clearTimeout(timeoutId);
    };
  }, [apiConfig, enabled, getAccessToken]);
}
