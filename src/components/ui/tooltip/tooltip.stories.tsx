import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Tooltip } from '.';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Tooltip primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Helpful hint">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};
