import type {
  ApiClientConfig,
  RefreshBodyContext,
  RefreshRequestConfig,
  RequestConfig,
} from './types';

export const DEFAULT_REFRESH_ENDPOINT = 'auth/refresh';
export const DEFAULT_REFRESH_EXCLUDED_PREFIXES = ['auth/'];

export interface DefaultRefreshRequestOptions {
  endpoint?: string;
  excludedRetryPrefixes?: string[];
}

export function createDefaultRefreshRequest({
  endpoint = DEFAULT_REFRESH_ENDPOINT,
  excludedRetryPrefixes = DEFAULT_REFRESH_EXCLUDED_PREFIXES,
}: DefaultRefreshRequestOptions = {}): RefreshRequestConfig {
  return {
    endpoint,
    method: 'POST',
    buildBody: ({ refreshToken }: RefreshBodyContext) => (refreshToken ? { refreshToken } : {}),
    parseAccessToken: (data: unknown) => {
      if (data && typeof data === 'object' && 'accessToken' in data) {
        const token = (data as { accessToken: unknown }).accessToken;
        return typeof token === 'string' ? token : null;
      }
      return null;
    },
    excludedRetryPrefixes,
  };
}

export function buildRequestUrl(baseURL: string, endpoint: string): string {
  const base = baseURL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
}

export function getRequestHeaders(
  accessToken: string | null,
  options?: { multipart?: boolean; acceptLanguage?: string },
): HeadersInit {
  const headers: HeadersInit = {};
  if (!options?.multipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (options?.acceptLanguage) {
    headers['Accept-Language'] = options.acceptLanguage;
  }
  return headers;
}

export function getRequestOptions(
  config: RequestConfig,
  token: string | null,
  acceptLanguage?: string,
): RequestInit {
  const init: RequestInit = {
    method: config.method,
    headers: getRequestHeaders(token, {
      multipart: config.multipart,
      acceptLanguage,
    }),
    body: config.multipart
      ? (config.body as BodyInit)
      : config.body != null
        ? JSON.stringify(config.body)
        : undefined,
  };
  if (config.credentials) {
    init.credentials = config.credentials;
  }
  return init;
}

/** Auth errors where the refresh cookie/token is actually unusable. */
export function isFatalRefreshFailureStatus(status: number): boolean {
  return status === 400 || status === 401 || status === 403 || status === 404;
}

function isTransientRefreshStatus(status: number): boolean {
  return status === 0 || status === 429 || status === 502 || status === 503 || status === 504;
}

const REFRESH_TRANSIENT_ATTEMPTS = 3;
const REFRESH_TRANSIENT_DELAY_MS = 50;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function performAccessTokenRefresh(params: {
  baseURL: string;
  getRefreshToken: () => string | null;
  request: RefreshRequestConfig;
  useCookieCredentials: boolean;
  setAccessToken: (token: string) => void;
  onFailure: () => void;
  acceptLanguage?: string;
}): Promise<string> {
  const refreshToken = params.useCookieCredentials ? null : params.getRefreshToken();
  if (!params.useCookieCredentials && !refreshToken) {
    // Missing JS token is not proof the session is dead (hydration may still
    // install an HttpOnly marker). Do not log the user out.
    throw { error: new Error('missing refresh token'), status: 401 };
  }

  const bodyContext: RefreshBodyContext = {
    refreshToken,
    useCookieCredentials: params.useCookieCredentials,
  };

  const requestConfig: RequestConfig = {
    endpoint: params.request.endpoint,
    method: params.request.method,
    body: params.request.buildBody(bodyContext),
    credentials: params.useCookieCredentials ? 'include' : params.request.credentials,
  };

  let lastStatus = 0;
  for (let attempt = 1; attempt <= REFRESH_TRANSIENT_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(
        buildRequestUrl(params.baseURL, requestConfig.endpoint),
        getRequestOptions(requestConfig, null, params.acceptLanguage),
      );
    } catch {
      lastStatus = 0;
      if (attempt < REFRESH_TRANSIENT_ATTEMPTS) {
        await wait(REFRESH_TRANSIENT_DELAY_MS * attempt);
        continue;
      }
      throw { error: new Error('refresh network error'), status: 0 };
    }

    const responseText = await response.text();

    let data: unknown = null;
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        lastStatus = 0;
        if (attempt < REFRESH_TRANSIENT_ATTEMPTS) {
          await wait(REFRESH_TRANSIENT_DELAY_MS * attempt);
          continue;
        }
        throw { error: new Error('invalid refresh response'), status: 0 };
      }
    }

    const accessToken = params.request.parseAccessToken(data);
    if (response.ok && accessToken) {
      params.setAccessToken(accessToken);
      return accessToken;
    }

    lastStatus = response.status || 0;
    if (isTransientRefreshStatus(lastStatus) && attempt < REFRESH_TRANSIENT_ATTEMPTS) {
      await wait(REFRESH_TRANSIENT_DELAY_MS * attempt);
      continue;
    }

    if (isFatalRefreshFailureStatus(lastStatus)) {
      params.onFailure();
    }
    throw {
      error: new Error('failed to refresh access token'),
      status: lastStatus,
    };
  }

  throw { error: new Error('failed to refresh access token'), status: lastStatus };
}

/** One in-flight refresh per page — parallel 401 retries share the same promise. */
let refreshInFlight: Promise<string> | null = null;

export async function executeConfiguredRefresh(config: ApiClientConfig): Promise<string> {
  const refresh = config.refresh;
  if (!refresh) {
    throw new Error('refresh is not configured');
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  refresh.onStart?.();
  refreshInFlight = performAccessTokenRefresh({
    baseURL: config.baseURL,
    getRefreshToken: config.getRefreshToken,
    request: refresh.request,
    useCookieCredentials: refresh.cookieCredentialsEnabled(),
    setAccessToken: refresh.setAccessToken,
    onFailure: refresh.onFailure,
    acceptLanguage: config.getAcceptLanguage?.(),
  }).finally(() => {
    refreshInFlight = null;
    refresh.onEnd?.();
  });

  return refreshInFlight;
}
