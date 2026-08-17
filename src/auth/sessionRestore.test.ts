import { describe, expect, it } from 'vitest';
import {
  HTTP_ONLY_REFRESH_MARKER,
  isInvalidSessionStatus,
  resolveApiRefreshToken,
} from './sessionRestore';

describe('resolveApiRefreshToken', () => {
  it('returns the readable cookie when not HttpOnly', () => {
    expect(
      resolveApiRefreshToken({
        httpOnly: false,
        sessionRestoreFailed: false,
        readRefreshCookie: () => 'refresh-cookie',
        cookieRefreshAllowed: false,
      }),
    ).toBe('refresh-cookie');
  });

  it('returns the HttpOnly marker when a cookie refresh is allowed', () => {
    expect(
      resolveApiRefreshToken({
        httpOnly: true,
        sessionRestoreFailed: false,
        readRefreshCookie: () => null,
        cookieRefreshAllowed: true,
      }),
    ).toBe(HTTP_ONLY_REFRESH_MARKER);
  });

  it('returns null after a failed restore or when blind refresh is forbidden', () => {
    expect(
      resolveApiRefreshToken({
        httpOnly: true,
        sessionRestoreFailed: true,
        readRefreshCookie: () => null,
        cookieRefreshAllowed: true,
      }),
    ).toBeNull();
    expect(
      resolveApiRefreshToken({
        httpOnly: true,
        sessionRestoreFailed: false,
        readRefreshCookie: () => null,
        cookieRefreshAllowed: false,
      }),
    ).toBeNull();
  });
});

describe('isInvalidSessionStatus', () => {
  it('treats 404 as a dead account and not 401 (refresh instead)', () => {
    expect(isInvalidSessionStatus(404)).toBe(true);
    expect(isInvalidSessionStatus(401)).toBe(false);
    expect(isInvalidSessionStatus(403)).toBe(false);
    expect(isInvalidSessionStatus(502)).toBe(false);
    expect(isInvalidSessionStatus(undefined)).toBe(false);
  });
});
