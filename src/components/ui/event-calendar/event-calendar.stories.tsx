import type { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';

import { EventCalendar } from '.';

const sampleEvents = [
  {
    id: '1',
    title: 'Team offsite',
    start: new Date(),
    end: addDays(new Date(), 1),
    allDay: true,
  },
  {
    id: '2',
    title: 'Public holiday',
    start: addDays(new Date(), 3),
    color: '#0d9488',
  },
  {
    id: '3',
    title: 'Casey PTO',
    start: addDays(new Date(), 5),
    end: addDays(new Date(), 7),
  },
];

const meta = {
  title: 'UI/EventCalendar',
  component: EventCalendar,
  parameters: {
    docs: {
      description: {
        component:
          'Month / week / day event calendar for app surfaces (distinct from the form day-picker Calendar).',
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof EventCalendar>;

export const Month: Story = {
  args: {
    events: sampleEvents,
    defaultView: 'month',
  },
};

export const Week: Story = {
  args: {
    events: sampleEvents,
    defaultView: 'week',
  },
};
