import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '.';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Popover primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">Popover content</PopoverContent>
    </Popover>
  ),
};
