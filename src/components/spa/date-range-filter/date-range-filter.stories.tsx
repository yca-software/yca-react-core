import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DateRangeFilter } from '.';

const t = (key: string) => key.split(':').pop() ?? key;

const meta = {
  title: 'SPA/DateRangeFilter',
  component: DateRangeFilter,
  parameters: {
    docs: {
      description: {
        component: 'Labeled DateRangePicker wrapper for list toolbars and filter panels.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangeFilter>;

export default meta;
type Story = StoryObj<typeof DateRangeFilter>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRange | undefined>();
    return (
      <DateRangeFilter
        label="Date range"
        hint="Filter results by activity date"
        value={value}
        onChange={setValue}
        onApply={setValue}
        t={t}
      />
    );
  },
};

export const Panel: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRange | undefined>();
    return (
      <DateRangeFilter
        label="Date range"
        hint="Filter results by activity date"
        value={value}
        onChange={setValue}
        onApply={setValue}
        t={t}
      />
    );
  },
};

export const Inline: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRange | undefined>();
    return (
      <DateRangeFilter
        variant="inline"
        label="Dates"
        value={value}
        onChange={setValue}
        onApply={setValue}
        t={t}
      />
    );
  },
};

export const Toolbar: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRange | undefined>();
    return (
      <DateRangeFilter
        variant="toolbar"
        label="Range"
        value={value}
        onChange={setValue}
        onApply={setValue}
        t={t}
      />
    );
  },
};
