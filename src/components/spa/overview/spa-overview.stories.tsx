import type { Meta, StoryObj } from '@storybook/react';
import { Pencil } from 'lucide-react';
import { createRef } from 'react';
import { MemoryRouter } from 'react-router';
import { TooltipProvider } from '../../ui/tooltip';
import {
  AdminDetailPage,
  AdminListPage,
  DetailFieldList,
  EntityRow,
  PageLoader,
  QueryState,
  RouteSuspense,
} from '..';

const meta = {
  title: 'SPA/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Catalog of SPA kit components exported from `@yca-software/yca-react-core/spa`. Each block has its own story under **SPA/**.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllComponents: Story = {
  render: () => (
    <MemoryRouter>
      <TooltipProvider>
        <div className="space-y-12 p-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Loaders & query</h2>
            <PageLoader loadingLabel="Loading section..." />
            <QueryState isLoading={false}>
              <p className="text-sm text-muted-foreground">Query success content</p>
            </QueryState>
            <RouteSuspense>
              <p className="text-sm">RouteSuspense child</p>
            </RouteSuspense>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Detail & entity</h2>
            <DetailFieldList
              fields={[
                { label: 'Name', value: 'Alex Kim' },
                { label: 'Email', value: 'alex@example.com' },
              ]}
            />
            <EntityRow icon={Pencil} title="Admin role" description="Full access" />
          </section>
          <section>
            <AdminListPage
              title="Users"
              description="Sample list"
              cardTitle="All users"
              searchPlaceholder="Search"
              emptyMessage="No users"
              columns={[
                { key: 'name', header: 'Name', render: (item: { name: string }) => item.name },
              ]}
              items={[{ name: 'Sam Lee' }]}
              isLoading={false}
              hasNextPage={false}
              isFetchingNextPage={false}
              loadMoreRef={createRef()}
              search=""
              onSearchChange={() => {}}
              onRowClick={() => {}}
              getRowKey={() => '1'}
            />
          </section>
          <section>
            <AdminDetailPage
              backHref="/"
              backLabel="Back"
              isLoading={false}
              notFoundMessage=""
              forbiddenMessage=""
              loadErrorMessage=""
            >
              <p>Detail body</p>
            </AdminDetailPage>
          </section>
        </div>
      </TooltipProvider>
    </MemoryRouter>
  ),
};
