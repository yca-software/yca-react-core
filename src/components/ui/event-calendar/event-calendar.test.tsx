import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { eventsOnDay, monthGridDays, titleForView } from './date-utils';

describe('event-calendar date-utils', () => {
  it('builds a 42-day month grid', () => {
    const days = monthGridDays(new Date(2026, 6, 15), true);
    expect(days).toHaveLength(42);
  });

  it('finds events overlapping a day', () => {
    const start = new Date(2026, 6, 10);
    const events = [
      { id: 'a', title: 'A', start, end: addDays(start, 2) },
      { id: 'b', title: 'B', start: addDays(start, 5) },
    ];
    expect(eventsOnDay(events, addDays(start, 1)).map((e) => e.id)).toEqual(['a']);
    expect(eventsOnDay(events, addDays(start, 5)).map((e) => e.id)).toEqual(['b']);
  });

  it('titles month view', () => {
    expect(titleForView(new Date(2026, 6, 1), 'month', true)).toMatch(/July 2026/);
  });
});
