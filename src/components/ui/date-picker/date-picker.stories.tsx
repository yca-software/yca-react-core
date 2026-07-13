import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from '.';

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware DatePicker primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();
    return (
      <DatePicker value={value} onChange={setValue} placeholder="Pick a date" className="w-64" />
    );
  },
};
