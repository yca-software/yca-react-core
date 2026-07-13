import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import { flattenPaginatedItems, type PaginatedList } from '../lib/pagination';

export type AdminListPageResponse<T> = PaginatedList<T>;

export type AdminListSearchMode = 'instant' | 'submit';

export type UseAdminListPageOptions = {
  debounceMs?: number;
  /** `instant` debounces input into the query; `submit` applies search only via submitSearch/clearSearch. */
  searchMode?: AdminListSearchMode;
};

export function useAdminListPage<T>(
  useInfiniteQuery: (
    search: string,
  ) => UseInfiniteQueryResult<InfiniteData<AdminListPageResponse<T>>>,
  options?: UseAdminListPageOptions,
) {
  const debounceMs = options?.debounceMs ?? 300;
  const searchMode = options?.searchMode ?? 'instant';
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const loadMoreRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (searchMode === 'submit') return;
    const id = window.setTimeout(() => setDebouncedSearch(search), debounceMs);
    return () => window.clearTimeout(id);
  }, [search, debounceMs, searchMode]);

  const submitSearch = useCallback(() => {
    setDebouncedSearch(search);
  }, [search]);

  const clearSearch = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
  }, []);

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (searchMode === 'submit' && event.key === 'Enter') {
        event.preventDefault();
        submitSearch();
      }
    },
    [searchMode, submitSearch],
  );

  const query = useInfiniteQuery(debouncedSearch);
  const items = flattenPaginatedItems(query.data?.pages);

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { rootMargin: '100px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  return {
    search,
    setSearch,
    debouncedSearch,
    submitSearch,
    clearSearch,
    onSearchKeyDown: searchMode === 'submit' ? handleSearchKeyDown : undefined,
    searchMode,
    items,
    query,
    loadMoreRef,
  };
}
