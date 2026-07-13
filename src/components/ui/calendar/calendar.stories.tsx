import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '.';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Calendar primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: { mode: 'single' },
};
