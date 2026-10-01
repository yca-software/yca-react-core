import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { EventCalendarEvent } from './types';

export function startOfVisibleWeek(date: Date, weekStartsOnMonday: boolean): Date {
  return startOfWeek(date, { weekStartsOn: weekStartsOnMonday ? 1 : 0 });
}

export function endOfVisibleWeek(date: Date, weekStartsOnMonday: boolean): Date {
  return endOfWeek(date, { weekStartsOn: weekStartsOnMonday ? 1 : 0 });
}

/** Six-week month grid (42 days) starting from the week that contains month start. */
export function monthGridDays(anchor: Date, weekStartsOnMonday: boolean): Date[] {
  const start = startOfVisibleWeek(startOfMonth(anchor), weekStartsOnMonday);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function weekDays(anchor: Date, weekStartsOnMonday: boolean): Date[] {
  const start = startOfVisibleWeek(anchor, weekStartsOnMonday);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function eventInterval(event: EventCalendarEvent): { start: Date; end: Date } {
  const start = startOfDay(event.start);
  const end = event.end ? endOfDay(event.end) : endOfDay(event.start);
  return { start, end };
}

export function eventsOnDay(events: EventCalendarEvent[], day: Date): EventCalendarEvent[] {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  return events.filter((event) => {
    const { start, end } = eventInterval(event);
    return (
      isWithinInterval(dayStart, { start, end }) ||
      isWithinInterval(dayEnd, { start, end }) ||
      (start <= dayStart && end >= dayEnd)
    );
  });
}

export function weekdayLabels(weekStartsOnMonday: boolean, reference: Date = new Date()): string[] {
  const start = startOfVisibleWeek(reference, weekStartsOnMonday);
  return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EEE'));
}

export function shiftAnchor(anchor: Date, view: 'month' | 'week' | 'day', direction: -1 | 1): Date {
  if (view === 'month') return addMonths(anchor, direction);
  if (view === 'week') return addWeeks(anchor, direction);
  return addDays(anchor, direction);
}

export function titleForView(
  anchor: Date,
  view: 'month' | 'week' | 'day',
  weekStartsOnMonday: boolean,
): string {
  if (view === 'month') return format(anchor, 'MMMM yyyy');
  if (view === 'day') return format(anchor, 'EEEE, MMM d, yyyy');
  const start = startOfVisibleWeek(anchor, weekStartsOnMonday);
  const end = endOfVisibleWeek(anchor, weekStartsOnMonday);
  if (isSameMonth(start, end)) {
    return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
  }
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
}

export { endOfMonth, isSameDay, isSameMonth };
