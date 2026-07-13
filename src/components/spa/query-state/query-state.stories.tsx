import type { Meta, StoryObj } from '@storybook/react';
import { QueryState } from '.';

const meta = {
  title: 'SPA/QueryState',
  component: QueryState,
  parameters: {
    docs: { description: { component: 'Loading/error shell for TanStack Query results.' } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QueryState>;

export default meta;
type Story = StoryObj<typeof QueryState>;

export const Loading: Story = {
  args: { isLoading: true, loadingLabel: 'Loading data...', children: <div>Content</div> },
};

export const ErrorState: Story = {
  args: {
    isLoading: false,
    isError: true,
    error: new Error('fail'),
    formatError: () => 'Could not load this resource.',
    retryLabel: 'Try again',
    children: <div>Content</div>,
  },
};

export const Success: Story = {
  args: { isLoading: false, children: <p className="p-4">Loaded successfully.</p> },
};
