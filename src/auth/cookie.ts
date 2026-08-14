import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import type { CookieNames } from '../constants/cookies';

export interface CookieConsent {
  analytics: boolean;
  timestamp: string;
}

export interface TokenCookieOptions {
  names: CookieNames;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const tokenCookieOptions = (options: TokenCookieOptions): Cookies.CookieAttributes => {
  const opts: Cookies.CookieAttributes = { path: '/' };
  if (options.domain) opts.domain = options.domain;
  if (options.secure) opts.secure = true;
  if (options.sameSite) opts.sameSite = options.sameSite;
  return opts;
};

/** Prefer a dated cookie over a session cookie — iOS drops session cookies when backgrounded. */
function accessTokenCookieExpires(token: string): Date {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (typeof exp === 'number' && exp * 1000 > Date.now()) {
      return new Date(exp * 1000);
    }
  } catch {
    // fall through
  }
  return new Date(Date.now() + 15 * 60 * 1000);
}

export function getAccessTokenFromCookies(names: CookieNames): string | null {
  return Cookies.get(names.accessToken) || null;
}

export function getRefreshTokenFromCookies(names: CookieNames): string | null {
  return Cookies.get(names.refreshToken) || null;
}

export function getCookieConsentFromCookies(names: CookieNames): CookieConsent | null {
  const consentStr = Cookies.get(names.cookieConsent);
  if (!consentStr) return null;
  try {
    return JSON.parse(consentStr) as CookieConsent;
  } catch {
    return null;
  }
}

export function removeAccessTokenCookie(options: TokenCookieOptions) {
  Cookies.remove(options.names.accessToken, tokenCookieOptions(options));
}

export function removeRefreshTokenCookie(options: TokenCookieOptions) {
  Cookies.remove(options.names.refreshToken, tokenCookieOptions(options));
}

export function removeCookieConsentCookie(names: CookieNames) {
  Cookies.remove(names.cookieConsent);
}

export function setCookieConsentCookie(
  names: CookieNames,
  timestamp: string,
  analytics: boolean,
  domain?: string,
) {
  const consent: CookieConsent = { analytics, timestamp };
  const cookieOptions: Cookies.CookieAttributes = {};
  if (domain) cookieOptions.domain = domain;
  Cookies.set(names.cookieConsent, JSON.stringify(consent), cookieOptions);
}

export function setAccessTokenCookie(token: string, options: TokenCookieOptions) {
  Cookies.set(options.names.accessToken, token, {
    ...tokenCookieOptions(options),
    expires: accessTokenCookieExpires(token),
  });
}

export function setRefreshTokenCookie(token: string, options: TokenCookieOptions) {
  Cookies.set(options.names.refreshToken, token, tokenCookieOptions(options));
}

export function setTokens(accessToken: string, refreshToken: string, options: TokenCookieOptions) {
  setAccessTokenCookie(accessToken, options);
  setRefreshTokenCookie(refreshToken, options);
}
