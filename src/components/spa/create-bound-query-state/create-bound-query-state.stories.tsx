import type { Meta, StoryObj } from '@storybook/react';
import { createBoundQueryState } from '.';

const BoundQueryState = createBoundQueryState(() => ({
  formatError: () => 'Bound error message',
  loadingLabel: 'Loading...',
  retryLabel: 'Retry',
}));

const meta = {
  title: 'SPA/CreateBoundQueryState',
  parameters: {
    docs: {
      description: { component: 'Factory for SPA-local i18n/error bindings around QueryState.' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const BoundError: Story = {
  render: () => (
    <BoundQueryState isLoading={false} isError error={new Error('boom')}>
      <div>Loaded</div>
    </BoundQueryState>
  ),
};
