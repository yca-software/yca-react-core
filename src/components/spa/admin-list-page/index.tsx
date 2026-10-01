import { Loader2, Search } from 'lucide-react';

import type { AdminListSearchMode } from '../../../hooks/useAdminListPage';
import { cn } from '../../../lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  SearchField,
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

export type AdminListSelectionMode = 'none' | 'multiple';

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
  /** Optional row multi-select (default none). */
  selectionMode?: AdminListSelectionMode;
  selectedKeys?: Set<string>;
  onSelectedKeysChange?: (keys: Set<string>) => void;
  /** Rendered in the card header when selectionMode is multiple and keys are selected. */
  bulkActions?: React.ReactNode;
  /** Accessible label for the selection checkbox column. */
  selectionLabel?: string;
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
  selectionMode = 'none',
  selectedKeys,
  onSelectedKeysChange,
  bulkActions,
  selectionLabel = 'Select',
}: AdminListPageProps<T>) {
  const safeItems = items.filter((item): item is T => item != null && typeof item === 'object');
  const isSubmitMode = searchMode === 'submit';
  const selectionEnabled = selectionMode === 'multiple' && onSelectedKeysChange != null;
  const selected = selectedKeys ?? new Set<string>();
  const visibleKeys = safeItems.map((item) => getRowKey(item)).filter(Boolean);
  const selectedVisibleCount = visibleKeys.filter((key) => selected.has(key)).length;
  const allVisibleSelected = visibleKeys.length > 0 && selectedVisibleCount === visibleKeys.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;
  const columnCount = columns.length + (selectionEnabled ? 1 : 0);

  const toggleKey = (key: string, checked: boolean) => {
    if (!onSelectedKeysChange) return;
    const next = new Set(selected);
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    onSelectedKeysChange(next);
  };

  const toggleAllVisible = (checked: boolean) => {
    if (!onSelectedKeysChange) return;
    const next = new Set(selected);
    for (const key of visibleKeys) {
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
    }
    onSelectedKeysChange(next);
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
          {selectionEnabled && selected.size > 0 && bulkActions ? (
            <div className="flex flex-wrap items-center gap-2">{bulkActions}</div>
          ) : null}
          {isSubmitMode ? (
            <SearchField
              className="max-w-full sm:max-w-sm"
              value={search}
              onValueChange={onSearchChange}
              onSubmit={() => onSearchSubmit?.()}
              onClear={onSearchClear}
              placeholder={searchPlaceholder}
              searchButtonLabel={searchButtonLabel}
              clearButtonLabel={clearButtonLabel}
            />
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
                onKeyDown={onSearchKeyDown}
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
                    {selectionEnabled ? (
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            allVisibleSelected
                              ? true
                              : someVisibleSelected
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={(value) => toggleAllVisible(value === true)}
                          aria-label={selectionLabel}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableHead>
                    ) : null}
                    {columns.map((col) => (
                      <TableHead key={col.key} className={col.className}>
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeItems.map((item, index) => {
                    const rowKey = getRowKey(item) || `row-${index}`;
                    const isSelected = selected.has(rowKey);
                    return (
                      <TableRow
                        key={rowKey}
                        role="button"
                        tabIndex={0}
                        data-state={isSelected ? 'selected' : undefined}
                        onClick={() => onRowClick(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(item);
                          }
                        }}
                        className="cursor-pointer hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      >
                        {selectionEnabled ? (
                          <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(value) => toggleKey(rowKey, value === true)}
                              aria-label={`${selectionLabel} ${rowKey}`}
                            />
                          </TableCell>
                        ) : null}
                        {columns.map((col) => (
                          <TableCell
                            key={col.key}
                            className={cn(col.className ?? 'text-muted-foreground')}
                          >
                            {col.render(item)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                  {hasNextPage && (
                    <TableRow ref={loadMoreRef}>
                      <TableCell
                        colSpan={columnCount}
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
