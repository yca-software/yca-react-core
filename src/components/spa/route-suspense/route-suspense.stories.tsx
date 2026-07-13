import type { Meta, StoryObj } from '@storybook/react';
import { lazy } from 'react';
import { RouteSuspense } from '.';

const LazyChild = lazy(() =>
  Promise.resolve({ default: () => <p className="p-8">Lazy content loaded</p> }),
);

const meta = {
  title: 'SPA/RouteSuspense',
  component: RouteSuspense,
  parameters: {
    docs: {
      description: {
        component: 'Suspense boundary for lazy route modules with shared loading UX.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteSuspense>;

export default meta;
type Story = StoryObj<typeof RouteSuspense>;

export const Default: Story = {
  render: () => (
    <RouteSuspense loadingLabel="Loading page...">
      <LazyChild />
    </RouteSuspense>
  ),
};
