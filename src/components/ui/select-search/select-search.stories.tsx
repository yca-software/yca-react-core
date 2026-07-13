import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { filterSelectOptions, isSelectSearchable, SEARCHABLE_SELECT_MIN_OPTIONS } from '.';

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
  { value: 'delta', label: 'Delta' },
  { value: 'epsilon', label: 'Epsilon' },
  { value: 'zeta', label: 'Zeta' },
  { value: 'eta', label: 'Eta' },
  { value: 'theta', label: 'Theta' },
  { value: 'iota', label: 'Iota' },
];

const meta = {
  title: 'UI/SelectSearch',
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware SelectSearch primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const FilterDemo: Story = {
  render: () => {
    const [query, setQuery] = useState('et');
    const filtered = filterSelectOptions(options, query);
    return (
      <div className="w-80 space-y-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Query</span>
          <input
            className="rounded-md border px-3 py-2"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <p>
          Search enabled for {options.length} options:{' '}
          <strong>{isSelectSearchable(options.length) ? 'yes' : 'no'}</strong> (threshold{' '}
          {SEARCHABLE_SELECT_MIN_OPTIONS})
        </p>
        <ul className="list-disc pl-5">
          {filtered.map((option) => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </div>
    );
  },
};
