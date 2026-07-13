import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdminListPage } from '.';

type Item = { id: string; name: string };

const columns = [
  {
    key: 'name',
    header: 'Name',
    render: (item: Item) => item.name,
  },
];

const baseProps = {
  title: 'Users',
  description: 'Manage users',
  cardTitle: 'All users',
  searchPlaceholder: 'Search users',
  emptyMessage: 'No users found',
  columns,
  items: [] as Item[],
  isLoading: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  loadMoreRef: createRef<HTMLTableRowElement>(),
  search: '',
  onSearchChange: vi.fn(),
  onRowClick: vi.fn(),
  getRowKey: (item: Item) => item.id,
};

describe('AdminListPage', () => {
  it('shows loading state', () => {
    render(<AdminListPage {...baseProps} isLoading loadingAriaLabel="Loading users" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading users')).toBeInTheDocument();
  });

  it('shows empty message when there are no items', () => {
    render(<AdminListPage {...baseProps} />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('renders rows and supports infinite scroll sentinel', () => {
    const loadMoreRef = createRef<HTMLTableRowElement>();
    render(
      <AdminListPage
        {...baseProps}
        items={[{ id: '1', name: 'Ada' }]}
        hasNextPage
        isFetchingNextPage
        loadMoreRef={loadMoreRef}
      />,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(loadMoreRef.current).not.toBeNull();
  });

  it('submits search on Enter in submit mode', async () => {
    const user = userEvent.setup();
    const onSearchSubmit = vi.fn();

    render(
      <AdminListPage
        {...baseProps}
        searchMode="submit"
        searchButtonLabel="Find"
        search="999"
        onSearchSubmit={onSearchSubmit}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Search users' });
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSearchSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders search and clear icon buttons in submit mode', async () => {
    const user = userEvent.setup();
    const onSearchSubmit = vi.fn();
    const onSearchClear = vi.fn();
    const onSearchChange = vi.fn();

    render(
      <AdminListPage
        {...baseProps}
        searchMode="submit"
        searchButtonLabel="Find"
        clearButtonLabel="Reset"
        search="draft"
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        onSearchClear={onSearchClear}
      />,
    );

    expect(screen.queryByText('Search users')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Find' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Find' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(onSearchClear).toHaveBeenCalledTimes(1);
  });

  it('hides clear icon button when search is empty in submit mode', () => {
    render(
      <AdminListPage
        {...baseProps}
        searchMode="submit"
        searchButtonLabel="Find"
        clearButtonLabel="Reset"
        search=""
      />,
    );

    expect(screen.getByRole('button', { name: 'Find' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();
  });
});
