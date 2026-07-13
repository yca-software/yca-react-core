import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiSelect } from '.';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Delta' },
];

const meta = {
  title: 'UI/MultiSelect',
  component: MultiSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware MultiSelect primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <MultiSelect
        value={value}
        onValueChange={setValue}
        options={options}
        className="w-72"
        translations={{ triggerLabel: 'Select items' }}
      />
    );
  },
};
