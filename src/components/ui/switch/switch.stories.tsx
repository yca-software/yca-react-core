import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '.';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Switch primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};
