import type { Meta, StoryObj } from '@storybook/react';
import { createRef } from 'react';
import { AdminListPage } from '.';

type Item = { id: string; name: string };

const meta = {
  title: 'SPA/AdminListPage',
  component: AdminListPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { component: 'Admin list: search, card, table, infinite scroll sentinel.' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminListPage>;

export default meta;
type Story = StoryObj<typeof AdminListPage>;

const columns = [{ key: 'name', header: 'Name', render: (item: Item) => item.name }];

export const WithData: Story = {
  render: () => (
    <AdminListPage<Item>
      title="Users"
      description="Manage organization users"
      cardTitle="All users"
      searchPlaceholder="Search users"
      emptyMessage="No users found"
      columns={columns}
      items={[
        { id: '1', name: 'Alex Kim' },
        { id: '2', name: 'Sam Lee' },
      ]}
      isLoading={false}
      hasNextPage={false}
      isFetchingNextPage={false}
      loadMoreRef={createRef()}
      search=""
      onSearchChange={() => {}}
      onRowClick={() => {}}
      getRowKey={(item) => item.id}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <AdminListPage<Item>
      title="Users"
      description="Manage organization users"
      cardTitle="All users"
      searchPlaceholder="Search users"
      emptyMessage="No users found"
      columns={columns}
      items={[]}
      isLoading
      loadingAriaLabel="Loading users"
      hasNextPage={false}
      isFetchingNextPage={false}
      loadMoreRef={createRef()}
      search=""
      onSearchChange={() => {}}
      onRowClick={() => {}}
      getRowKey={(item) => item.id}
    />
  ),
};
