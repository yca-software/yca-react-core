import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenuItem } from '../dropdown-menu';
import { DropdownScrollableList } from '.';

const meta = {
  title: 'UI/DropdownScrollableList',
  component: DropdownScrollableList,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware DropdownScrollableList primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownScrollableList>;

export default meta;
type Story = StoryObj<typeof DropdownScrollableList>;

const items = Array.from({ length: 20 }, (_, index) => `Option ${index + 1}`);

export const Default: Story = {
  render: () => (
    <div className="w-64 rounded-md border bg-popover p-1 shadow-md">
      <DropdownScrollableList grow={false} scrollAreaClassName="max-h-48 overflow-y-auto">
        {items.map((label) => (
          <DropdownMenuItem key={label}>{label}</DropdownMenuItem>
        ))}
      </DropdownScrollableList>
    </div>
  ),
};
