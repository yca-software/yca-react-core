import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type AdminListPageResponse, useAdminListPage } from './useAdminListPage';

type Item = { id: string };

function createMockQuery(
  search: string,
): UseInfiniteQueryResult<InfiniteData<AdminListPageResponse<Item>>> {
  return {
    data: {
      pages: [{ items: [{ id: search || 'default' }], hasNext: false }],
      pageParams: [undefined],
    },
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
  } as unknown as UseInfiniteQueryResult<InfiniteData<AdminListPageResponse<Item>>>;
}

describe('useAdminListPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('debounces search in instant mode', () => {
    vi.useFakeTimers();
    const useInfiniteQuery = vi.fn(createMockQuery);
    const { result } = renderHook(() => useAdminListPage(useInfiniteQuery, { debounceMs: 300 }));

    act(() => {
      result.current.setSearch('ada');
    });

    expect(useInfiniteQuery).toHaveBeenLastCalledWith('');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(useInfiniteQuery).toHaveBeenLastCalledWith('ada');
    vi.useRealTimers();
  });

  it('does not apply search on typing in submit mode', () => {
    const useInfiniteQuery = vi.fn(createMockQuery);
    const { result } = renderHook(() =>
      useAdminListPage(useInfiniteQuery, { searchMode: 'submit' }),
    );

    act(() => {
      result.current.setSearch('ada');
    });

    expect(useInfiniteQuery).toHaveBeenLastCalledWith('');
    expect(result.current.debouncedSearch).toBe('');

    act(() => {
      result.current.submitSearch();
    });

    expect(result.current.debouncedSearch).toBe('ada');
    expect(useInfiniteQuery).toHaveBeenLastCalledWith('ada');
  });

  it('clearSearch resets draft and applied search in submit mode', () => {
    const useInfiniteQuery = vi.fn(createMockQuery);
    const { result } = renderHook(() =>
      useAdminListPage(useInfiniteQuery, { searchMode: 'submit' }),
    );

    act(() => {
      result.current.setSearch('ada');
    });

    act(() => {
      result.current.submitSearch();
    });

    expect(result.current.debouncedSearch).toBe('ada');

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.search).toBe('');
    expect(result.current.debouncedSearch).toBe('');
    expect(useInfiniteQuery).toHaveBeenLastCalledWith('');
  });

  it('provides onSearchKeyDown that submits on Enter in submit mode', () => {
    const useInfiniteQuery = vi.fn(createMockQuery);
    const { result } = renderHook(() =>
      useAdminListPage(useInfiniteQuery, { searchMode: 'submit' }),
    );

    act(() => {
      result.current.setSearch('bob');
    });

    act(() => {
      result.current.onSearchKeyDown?.({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.onSearchKeyDown).toBeDefined();
    expect(result.current.debouncedSearch).toBe('bob');
  });

  it('does not provide onSearchKeyDown in instant mode', () => {
    const useInfiniteQuery = vi.fn(createMockQuery);
    const { result } = renderHook(() => useAdminListPage(useInfiniteQuery));

    expect(result.current.onSearchKeyDown).toBeUndefined();
  });
});
