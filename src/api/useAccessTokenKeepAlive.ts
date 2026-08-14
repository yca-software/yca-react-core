import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useApiClientConfig } from './ApiClientContext';
import { executeConfiguredRefresh } from './request';

/** Typical access JWT TTL is 15m — refresh ahead of expiry. */
const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;
const REFRESH_SKEW_MS = 2 * 60 * 1000;

export function accessTokenNeedsRefresh(
  token: string | null,
  nowMs: number = Date.now(),
  skewMs: number = REFRESH_SKEW_MS,
): boolean {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (typeof exp !== 'number') return true;
    return exp * 1000 <= nowMs + skewMs;
  } catch {
    return true;
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
 * - Interval while the tab is foregrounded (browsers throttle background timers)
 * - Immediate refresh when the tab becomes visible / focused after expiry
 */
export function useAccessTokenKeepAlive(options: UseAccessTokenKeepAliveOptions): void {
  const apiConfig = useApiClientConfig();
  const { enabled, getAccessToken } = options;

  useEffect(() => {
    if (!enabled || !apiConfig.refresh) {
      return;
    }

    const refreshIfNeeded = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      if (!accessTokenNeedsRefresh(getAccessToken())) {
        return;
      }
      void executeConfiguredRefresh(apiConfig).catch(() => {
        // Hard auth failures clear via onRefreshFailure; 429/5xx stay intact.
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshIfNeeded();
      }
    };

    refreshIfNeeded();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', refreshIfNeeded);
    window.addEventListener('pageshow', refreshIfNeeded);
    const id = window.setInterval(refreshIfNeeded, KEEP_ALIVE_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', refreshIfNeeded);
      window.removeEventListener('pageshow', refreshIfNeeded);
      window.clearInterval(id);
    };
  }, [apiConfig, enabled, getAccessToken]);
}
