import { describe, expect, it, vi } from 'vitest';
import {
  createDefaultRefreshRequest,
  executeConfiguredRefresh,
  performAccessTokenRefresh,
} from './request';

describe('performAccessTokenRefresh', () => {
  it('stores and returns access token on success', async () => {
    const setAccessToken = vi.fn();
    const onFailure = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ accessToken: 'new-access' }), { status: 200 }),
        ),
    );

    const token = await performAccessTokenRefresh({
      baseURL: 'http://test/api/v1',
      getRefreshToken: () => 'refresh-token',
      request: createDefaultRefreshRequest(),
      useCookieCredentials: false,
      setAccessToken,
      onFailure,
    });

    expect(token).toBe('new-access');
    expect(setAccessToken).toHaveBeenCalledWith('new-access');
    expect(onFailure).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('does not call onFailure when refresh token is missing', async () => {
    const onFailure = vi.fn();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    await expect(
      performAccessTokenRefresh({
        baseURL: 'http://test/api/v1',
        getRefreshToken: () => null,
        request: createDefaultRefreshRequest(),
        useCookieCredentials: false,
        setAccessToken: vi.fn(),
        onFailure,
      }),
    ).rejects.toMatchObject({ status: 401 });

    expect(onFailure).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('uses cookie credentials when enabled', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ accessToken: 'cookie-token' }), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchSpy);

    await performAccessTokenRefresh({
      baseURL: 'http://test/api/v1',
      getRefreshToken: () => null,
      request: createDefaultRefreshRequest(),
      useCookieCredentials: true,
      setAccessToken: vi.fn(),
      onFailure: vi.fn(),
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://test/api/v1/auth/refresh',
      expect.objectContaining({ credentials: 'include' }),
    );
    vi.unstubAllGlobals();
  });

  it('does not call onFailure on invalid JSON (treat as transient)', async () => {
    vi.useFakeTimers();
    const onFailure = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(new Response('not-json', { status: 200 }))),
    );

    const pending = expect(
      performAccessTokenRefresh({
        baseURL: 'http://test/api/v1',
        getRefreshToken: () => 'refresh',
        request: createDefaultRefreshRequest(),
        useCookieCredentials: false,
        setAccessToken: vi.fn(),
        onFailure,
      }),
    ).rejects.toMatchObject({ status: 0 });
    await vi.runAllTimersAsync();
    await pending;

    expect(onFailure).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('does not call onFailure when fetch throws (background/network)', async () => {
    vi.useFakeTimers();
    const onFailure = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const pending = expect(
      performAccessTokenRefresh({
        baseURL: 'http://test/api/v1',
        getRefreshToken: () => 'refresh',
        request: createDefaultRefreshRequest(),
        useCookieCredentials: true,
        setAccessToken: vi.fn(),
        onFailure,
      }),
    ).rejects.toMatchObject({ status: 0 });
    await vi.runAllTimersAsync();
    await pending;

    expect(onFailure).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('applies custom excluded retry prefixes', () => {
    const request = createDefaultRefreshRequest({
      excludedRetryPrefixes: ['session/', 'auth/'],
    });

    expect(request.excludedRetryPrefixes).toEqual(['session/', 'auth/']);
  });

  it('uses a custom refresh endpoint from request config', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ accessToken: 'custom' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);

    await performAccessTokenRefresh({
      baseURL: 'http://test/api/v1',
      getRefreshToken: () => 'refresh-token',
      request: createDefaultRefreshRequest({ endpoint: 'session/renew' }),
      useCookieCredentials: false,
      setAccessToken: vi.fn(),
      onFailure: vi.fn(),
    });

    expect(fetchSpy).toHaveBeenCalledWith('http://test/api/v1/session/renew', expect.any(Object));
    vi.unstubAllGlobals();
  });

  it('retries a 502 refresh then succeeds without onFailure', async () => {
    vi.useFakeTimers();
    const onFailure = vi.fn();
    const setAccessToken = vi.fn();
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ errorCode: 'BadGateway' }), { status: 502 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'after-blip' }), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchSpy);

    const pending = performAccessTokenRefresh({
      baseURL: 'http://test/api/v1',
      getRefreshToken: () => 'refresh',
      request: createDefaultRefreshRequest(),
      useCookieCredentials: true,
      setAccessToken,
      onFailure,
    });
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toBe('after-blip');
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(onFailure).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('does not call onFailure on 429 (rate limit)', async () => {
    vi.useFakeTimers();
    const onFailure = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(() =>
          Promise.resolve(
            new Response(JSON.stringify({ errorCode: 'TooManyRequests' }), { status: 429 }),
          ),
        ),
    );

    const pending = expect(
      performAccessTokenRefresh({
        baseURL: 'http://test/api/v1',
        getRefreshToken: () => 'refresh',
        request: createDefaultRefreshRequest(),
        useCookieCredentials: false,
        setAccessToken: vi.fn(),
        onFailure,
      }),
    ).rejects.toMatchObject({ status: 429 });
    await vi.runAllTimersAsync();
    await pending;

    expect(onFailure).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('calls onFailure on 401 when the tab is visible', async () => {
    const onFailure = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));

    await expect(
      performAccessTokenRefresh({
        baseURL: 'http://test/api/v1',
        getRefreshToken: () => 'refresh',
        request: createDefaultRefreshRequest(),
        useCookieCredentials: false,
        setAccessToken: vi.fn(),
        onFailure,
      }),
    ).rejects.toMatchObject({ status: 401 });

    expect(onFailure).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('does not call onFailure on 401 when the tab is hidden', async () => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    const onFailure = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));

    await expect(
      performAccessTokenRefresh({
        baseURL: 'http://test/api/v1',
        getRefreshToken: () => 'refresh',
        request: createDefaultRefreshRequest(),
        useCookieCredentials: false,
        setAccessToken: vi.fn(),
        onFailure,
      }),
    ).rejects.toMatchObject({ status: 401 });

    expect(onFailure).not.toHaveBeenCalled();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    vi.unstubAllGlobals();
  });
});

describe('executeConfiguredRefresh', () => {
  it('uses one injected native refresh without exposing a refresh token to fetch', async () => {
    let resolveNative!: (value: { accessToken: string; expiresAt: string }) => void;
    const executor = vi.fn(
      () =>
        new Promise<{ accessToken: string; expiresAt: string }>((resolve) => {
          resolveNative = resolve;
        }),
    );
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const setAccessToken = vi.fn();
    const config = {
      baseURL: 'https://office.example/api/v1',
      getAccessToken: () => null,
      getRefreshToken: () => null,
      refresh: {
        request: createDefaultRefreshRequest(),
        executor,
        cookieCredentialsEnabled: () => false,
        setAccessToken,
        onFailure: vi.fn(),
      },
    };
    const first = executeConfiguredRefresh(config);
    const second = executeConfiguredRefresh(config);
    await Promise.resolve();
    expect(executor).toHaveBeenCalledOnce();
    resolveNative({
      accessToken: 'native-access',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });
    await expect(Promise.all([first, second])).resolves.toEqual(['native-access', 'native-access']);
    expect(setAccessToken).toHaveBeenCalledExactlyOnceWith('native-access');
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('dedupes concurrent refresh calls into one HTTP request', async () => {
    let resolveFetch!: (value: Response) => void;
    const fetchSpy = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchSpy);

    const setAccessToken = vi.fn();
    const config = {
      baseURL: 'http://test/api/v1',
      getAccessToken: () => null,
      getRefreshToken: () => 'refresh',
      refresh: {
        request: createDefaultRefreshRequest(),
        cookieCredentialsEnabled: () => false,
        setAccessToken,
        onFailure: vi.fn(),
      },
    };

    const p1 = executeConfiguredRefresh(config);
    const p2 = executeConfiguredRefresh(config);
    expect(fetchSpy).toHaveBeenCalledOnce();

    resolveFetch(new Response(JSON.stringify({ accessToken: 'shared' }), { status: 200 }));
    await expect(Promise.all([p1, p2])).resolves.toEqual(['shared', 'shared']);
    expect(setAccessToken).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('rejects an expired native access response before installing it', async () => {
    const setAccessToken = vi.fn();
    const config = {
      baseURL: 'https://office.example/api/v1',
      getAccessToken: () => null,
      getRefreshToken: () => null,
      refresh: {
        request: createDefaultRefreshRequest(),
        executor: async () => ({ accessToken: 'stale', expiresAt: new Date(0).toISOString() }),
        cookieCredentialsEnabled: () => false,
        setAccessToken,
        onFailure: vi.fn(),
      },
    };
    await expect(executeConfiguredRefresh(config)).rejects.toMatchObject({ status: 0 });
    expect(setAccessToken).not.toHaveBeenCalled();
  });
});
