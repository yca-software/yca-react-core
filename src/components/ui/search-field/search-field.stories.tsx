import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchField } from '.';

const meta = {
  title: 'UI/SearchField',
  component: SearchField,
  parameters: {
    docs: {
      description: {
        component:
          'Joined search input with optional clear (X) and a primary magnifier submit button.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [applied, setApplied] = useState('');
    return (
      <div className="w-80 space-y-2">
        <SearchField
          value={value}
          onValueChange={setValue}
          onSubmit={() => setApplied(value.trim())}
          onClear={() => {
            setValue('');
            setApplied('');
          }}
          placeholder="Search by name or code..."
          searchButtonLabel="Search"
          clearButtonLabel="Clear"
        />
        <p className="text-xs text-muted-foreground">Applied: {applied || '—'}</p>
      </div>
    );
  },
};
