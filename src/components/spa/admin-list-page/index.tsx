import { Loader2, Search, X } from 'lucide-react';

import type { AdminListSearchMode } from '../../../hooks/useAdminListPage';
import { cn } from '../../../lib/utils';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui';
import { PageLoader } from '../page-loader';

export type { AdminListSearchMode };

export interface AdminListPageColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  /** Column class for alignment/width */
  className?: string;
}

export interface AdminListPageProps<T> {
  title: string;
  description: string;
  /** Optional actions (e.g. "Create" button) rendered next to the page title. */
  headerActions?: React.ReactNode;
  /** Card header title (e.g. "All Users") */
  cardTitle: string;
  searchPlaceholder: string;
  emptyMessage: string;
  columns: AdminListPageColumn<T>[];
  items: T[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLTableRowElement | null>;
  search: string;
  onSearchChange: (value: string) => void;
  onRowClick: (item: T) => void;
  getRowKey: (item: T) => string;
  /** Accessible label for the loading spinner (app i18n). */
  loadingAriaLabel?: string;
  /** `instant` updates query on debounced typing; `submit` requires Search/Clear actions. */
  searchMode?: AdminListSearchMode;
  /** Label for the Search button when `searchMode` is `submit`. */
  searchButtonLabel?: string;
  /** Label for the Clear button when `searchMode` is `submit`. */
  clearButtonLabel?: string;
  /** Called when the user clicks Search or presses Enter in submit mode. */
  onSearchSubmit?: () => void;
  /** Called when the user clicks Clear in submit mode. */
  onSearchClear?: () => void;
  /** Enter-key handler for submit mode (typically from `useAdminListPage().onSearchKeyDown`). */
  onSearchKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

/**
 * Reusable admin list page: search + card + table + infinite scroll.
 */
export function AdminListPage<T>({
  title,
  description,
  headerActions,
  cardTitle,
  searchPlaceholder,
  emptyMessage,
  columns,
  items,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  search,
  onSearchChange,
  onRowClick,
  getRowKey,
  loadingAriaLabel = 'Loading...',
  searchMode = 'instant',
  searchButtonLabel = 'Search',
  clearButtonLabel = 'Clear',
  onSearchSubmit,
  onSearchClear,
  onSearchKeyDown,
}: AdminListPageProps<T>) {
  const safeItems = items.filter((item): item is T => item != null && typeof item === 'object');
  const isSubmitMode = searchMode === 'submit';
  const hasSearchText = search.trim().length > 0;

  const handleSearchInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (isSubmitMode && event.key === 'Enter') {
      event.preventDefault();
      onSearchSubmit?.();
    }
    onSearchKeyDown?.(event);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        {headerActions}
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="space-y-2">
            <CardTitle>{cardTitle}</CardTitle>
            {!isSubmitMode ? <CardDescription>{searchPlaceholder}</CardDescription> : null}
          </div>
          {isSubmitMode ? (
            <div
              className={cn(
                'flex h-9 w-full min-w-0 max-w-full overflow-hidden rounded-md border border-input bg-background shadow-xs sm:max-w-sm',
                'transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
              )}
            >
              <div className="relative flex min-w-0 flex-1 items-center">
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  className={cn(
                    'h-9 rounded-none rounded-l-md border-0 bg-transparent px-3 shadow-none',
                    'focus-visible:border-transparent focus-visible:ring-0',
                    hasSearchText && 'pr-9',
                  )}
                  aria-label={searchPlaceholder}
                />
                {hasSearchText ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onSearchClear}
                    aria-label={clearButtonLabel}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </Button>
                ) : null}
              </div>
              <Button
                type="button"
                variant="default"
                onClick={onSearchSubmit}
                aria-label={searchButtonLabel}
                className={cn(
                  'h-full w-10 shrink-0 rounded-none rounded-r-md border-0 border-l border-primary-foreground/15 px-0 shadow-none',
                  'hover:bg-primary/90 active:bg-primary/95',
                  'shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--primary-foreground)_20%,transparent)]',
                )}
              >
                <Search className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          ) : (
            <div className="relative max-w-full sm:max-w-sm">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                aria-label={searchPlaceholder}
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PageLoader loadingLabel={loadingAriaLabel} />
          ) : safeItems.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
          ) : (
            <div className="-mx-4 overflow-x-auto sm:mx-0">
              <Table className="min-w-[400px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {columns.map((col) => (
                      <TableHead key={col.key} className={col.className}>
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeItems.map((item, index) => (
                    <TableRow
                      key={getRowKey(item) || `row-${index}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => onRowClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(item);
                        }
                      }}
                      className="cursor-pointer hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(col.className ?? 'text-muted-foreground')}
                        >
                          {col.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {hasNextPage && (
                    <TableRow ref={loadMoreRef}>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-muted-foreground"
                      >
                        {isFetchingNextPage ? (
                          <Loader2 className="inline-block h-5 w-5 animate-spin" aria-hidden />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
