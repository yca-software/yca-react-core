import type { Meta, StoryObj } from '@storybook/react';
import { Newsletter } from '.';

const meta = {
  title: 'Marketing/Newsletter',
  component: Newsletter,
  parameters: {
    docs: {
      description: {
        component:
          'Email capture block with elevated surface; works with external form endpoints or `children`.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Newsletter>;

export default meta;
type Story = StoryObj<typeof Newsletter>;

export const Default: Story = {
  render: () => (
    <Newsletter
      title="Stay in the loop"
      description="Monthly notes on product, design, and launch tactics—no spam."
      placeholder="you@company.com"
      buttonLabel="Subscribe"
      formAction="https://example.com/subscribe"
    />
  ),
};

export const WithAction: Story = {
  render: () => (
    <Newsletter
      title="Stay in the loop"
      description="Monthly notes on product, design, and launch tactics—no spam."
      formAction="https://example.com/subscribe"
      formMethod="post"
    />
  ),
};

export const Placeholder: Story = {
  render: () => (
    <Newsletter
      title="Newsletter"
      description="Wire your endpoint via formAction or custom children."
    />
  ),
};
