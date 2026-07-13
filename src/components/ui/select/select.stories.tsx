import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from '.';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Select primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('draft');
    return (
      <Select
        value={value}
        onValueChange={setValue}
        options={options}
        placeholder="Status"
        className="w-64"
      />
    );
  },
};
