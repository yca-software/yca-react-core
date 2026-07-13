import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '.';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Badge primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Badge' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
};
