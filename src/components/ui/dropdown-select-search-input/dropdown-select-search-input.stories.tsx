import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DropdownSelectSearchInput } from '.';

const meta = {
  title: 'UI/DropdownSelectSearchInput',
  component: DropdownSelectSearchInput,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware DropdownSelectSearchInput primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownSelectSearchInput>;

export default meta;
type Story = StoryObj<typeof DropdownSelectSearchInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64 rounded-md border bg-popover shadow-md">
        <DropdownSelectSearchInput value={value} onChange={setValue} placeholder="Search options" />
      </div>
    );
  },
};
