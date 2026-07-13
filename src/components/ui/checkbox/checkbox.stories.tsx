import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '.';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Checkbox primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};
