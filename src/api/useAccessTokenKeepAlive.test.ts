import { describe, expect, it } from 'vitest';
import { accessTokenNeedsRefresh } from './useAccessTokenKeepAlive';

function jwtWithExp(expSeconds: number): string {
  const header = btoa(JSON.stringify({ alg: 'none' })).replace(/=+$/, '');
  const payload = btoa(JSON.stringify({ exp: expSeconds })).replace(/=+$/, '');
  return `${header}.${payload}.sig`;
}

describe('accessTokenNeedsRefresh', () => {
  it('returns true when token is missing', () => {
    expect(accessTokenNeedsRefresh(null)).toBe(true);
    expect(accessTokenNeedsRefresh('')).toBe(true);
  });

  it('returns true when exp is within skew window', () => {
    const now = 1_700_000_000_000;
    const token = jwtWithExp(Math.floor((now + 60_000) / 1000));
    expect(accessTokenNeedsRefresh(token, now, 120_000)).toBe(true);
  });

  it('returns false when exp is beyond skew window', () => {
    const now = 1_700_000_000_000;
    const token = jwtWithExp(Math.floor((now + 10 * 60_000) / 1000));
    expect(accessTokenNeedsRefresh(token, now, 120_000)).toBe(false);
  });

  it('returns true for invalid tokens', () => {
    expect(accessTokenNeedsRefresh('not-a-jwt')).toBe(true);
  });
});
