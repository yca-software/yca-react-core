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

export const WithAddMoreLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `showSelectedTags` is on and `translations.addMoreLabel` is set, the trigger switches to that label after the first selection. Omitting `addMoreLabel` keeps legacy `triggerLabel` behavior.',
      },
    },
  },
  render: () => {
    const [value, setValue] = useState<string[]>(['a']);
    return (
      <MultiSelect
        value={value}
        onValueChange={setValue}
        options={options}
        className="w-72"
        showSelectedTags
        translations={{
          triggerLabel: 'All items',
          addMoreLabel: 'Add more…',
        }}
      />
    );
  },
};
