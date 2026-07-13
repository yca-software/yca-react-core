import type { Meta, StoryObj } from '@storybook/react';
import { CtaBanner } from '.';

const meta = {
  title: 'Marketing/CtaBanner',
  component: CtaBanner,
  parameters: {
    docs: {
      description: {
        component:
          'Full-width call-to-action: ambient background + frosted inner panel + hero-style buttons.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CtaBanner>;

export default meta;
type Story = StoryObj<typeof CtaBanner>;

export const Default: Story = {
  render: () => (
    <CtaBanner
      variant="gradient"
      title="Launch your next site this week"
      description="Start from the template, swap copy, and publish in minutes."
      primaryAction={{ label: 'Get started', href: '#' }}
      secondaryAction={{ label: 'See examples', href: '#' }}
    />
  ),
};

export const Gradient: Story = {
  render: () => (
    <CtaBanner
      variant="gradient"
      title="Ready to ship your next launch page?"
      description="Start from the template, swap copy, and publish in minutes."
      primaryAction={{ label: 'Start now', href: '#' }}
      secondaryAction={{ label: 'Talk to us', href: '#' }}
    />
  ),
};

export const Solid: Story = {
  render: () => (
    <CtaBanner
      variant="solid"
      title="Join the waitlist"
      description="We’ll notify you when new blocks drop."
      primaryAction={{ label: 'Subscribe', href: '#' }}
      secondaryAction={{ label: 'No thanks', href: '#' }}
    />
  ),
};
