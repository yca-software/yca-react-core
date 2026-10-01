import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { surfaceCard } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';
import { Button } from '../button';

import {
  eventsOnDay,
  isSameDay,
  isSameMonth,
  monthGridDays,
  shiftAnchor,
  titleForView,
  weekDays,
  weekdayLabels,
} from './date-utils';
import type { EventCalendarEvent, EventCalendarProps, EventCalendarView } from './types';

const MAX_MONTH_CHIPS = 3;

function useControlledDate(
  value: Date | undefined,
  defaultValue: Date | undefined,
  onChange?: (date: Date) => void,
) {
  const [internal, setInternal] = React.useState(defaultValue ?? new Date());
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const set = React.useCallback(
    (next: Date) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set] as const;
}

function useControlledView(
  value: EventCalendarView | undefined,
  defaultValue: EventCalendarView,
  onChange?: (view: EventCalendarView) => void,
) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const set = React.useCallback(
    (next: EventCalendarView) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set] as const;
}

function EventChip({
  event,
  dense,
  onClick,
}: {
  event: EventCalendarEvent;
  dense?: boolean;
  onClick?: (event: EventCalendarEvent) => void;
}) {
  return (
    <button
      type="button"
      data-slot="event-calendar-chip"
      className={cn(
        'w-full truncate rounded-md px-1.5 text-left text-[0.7rem] font-medium leading-5',
        'bg-primary/15 text-primary hover:bg-primary/25',
        dense && 'leading-4 text-[0.65rem]',
        event.colorClassName,
      )}
      style={event.color ? { backgroundColor: `${event.color}22`, color: event.color } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
    >
      {event.title}
    </button>
  );
}

/**
 * Month / week / day event calendar shell for app surfaces (time-off, holidays, meetings).
 * Distinct from the day-picker {@link Calendar} used in forms.
 *
 * Storybook: UI/EventCalendar
 */
function EventCalendar({
  events,
  value,
  defaultValue,
  view: viewProp,
  defaultView = 'month',
  onValueChange,
  onViewChange,
  onEventClick,
  onSlotClick,
  className,
  weekStartsOnMonday = true,
  labels,
}: EventCalendarProps) {
  const [safeAnchor, setAnchor] = useControlledDate(value, defaultValue, onValueChange);
  const [safeView, setViewSafe] = useControlledView(viewProp, defaultView, onViewChange);
  const weekdays = React.useMemo(
    () => weekdayLabels(weekStartsOnMonday, safeAnchor),
    [weekStartsOnMonday, safeAnchor],
  );

  const go = (direction: -1 | 1) => setAnchor(shiftAnchor(safeAnchor, safeView, direction));

  return (
    <div
      data-slot="event-calendar"
      className={cn(surfaceCard, 'flex flex-col gap-3 p-3 sm:p-4', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Previous"
            onClick={() => go(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Next"
            onClick={() => go(1)}
          >
            <ChevronRight />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setAnchor(new Date())}>
            {labels?.today ?? 'Today'}
          </Button>
          <h2 className="ml-1 text-sm font-semibold sm:text-base">
            {titleForView(safeAnchor, safeView, weekStartsOnMonday)}
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/50 p-0.5">
          {(['month', 'week', 'day'] as const).map((v) => (
            <Button
              key={v}
              type="button"
              size="sm"
              variant={safeView === v ? 'secondary' : 'ghost'}
              onClick={() => setViewSafe(v)}
            >
              {labels?.[v] ?? v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {safeView === 'month' && (
        <MonthGrid
          anchor={safeAnchor}
          events={events}
          weekStartsOnMonday={weekStartsOnMonday}
          weekdays={weekdays}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      )}
      {safeView === 'week' && (
        <WeekGrid
          anchor={safeAnchor}
          events={events}
          weekStartsOnMonday={weekStartsOnMonday}
          weekdays={weekdays}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      )}
      {safeView === 'day' && (
        <DayPane
          anchor={safeAnchor}
          events={events}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      )}
    </div>
  );
}

function MonthGrid({
  anchor,
  events,
  weekStartsOnMonday,
  weekdays,
  onEventClick,
  onSlotClick,
}: {
  anchor: Date;
  events: EventCalendarEvent[];
  weekStartsOnMonday: boolean;
  weekdays: string[];
  onEventClick?: (event: EventCalendarEvent) => void;
  onSlotClick?: (date: Date) => void;
}) {
  const days = monthGridDays(anchor, weekStartsOnMonday);
  const today = new Date();

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-7 gap-px">
        {weekdays.map((label) => (
          <div
            key={label}
            className="px-1 py-1 text-center text-[0.7rem] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px rounded-lg border border-border/40 bg-border/40 overflow-hidden">
        {days.map((day) => {
          const dayEvents = eventsOnDay(events, day);
          const inMonth = isSameMonth(day, anchor);
          const isToday = isSameDay(day, today);
          const overflow = dayEvents.length - MAX_MONTH_CHIPS;
          return (
            <button
              key={day.toISOString()}
              type="button"
              data-slot="event-calendar-day"
              className={cn(
                'flex min-h-[5.5rem] flex-col gap-0.5 bg-card p-1 text-left align-top',
                'hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                !inMonth && 'bg-muted/20 text-muted-foreground',
              )}
              onClick={() => onSlotClick?.(day)}
            >
              <span
                className={cn(
                  'inline-flex size-6 items-center justify-center rounded-md text-xs',
                  isToday && 'bg-primary text-primary-foreground font-semibold',
                )}
              >
                {format(day, 'd')}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, MAX_MONTH_CHIPS).map((event) => (
                  <EventChip key={event.id} event={event} dense onClick={onEventClick} />
                ))}
                {overflow > 0 && (
                  <span className="px-1 text-[0.65rem] text-muted-foreground">+{overflow}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  anchor,
  events,
  weekStartsOnMonday,
  weekdays,
  onEventClick,
  onSlotClick,
}: {
  anchor: Date;
  events: EventCalendarEvent[];
  weekStartsOnMonday: boolean;
  weekdays: string[];
  onEventClick?: (event: EventCalendarEvent) => void;
  onSlotClick?: (date: Date) => void;
}) {
  const days = weekDays(anchor, weekStartsOnMonday);
  const today = new Date();

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
      {days.map((day, i) => {
        const dayEvents = eventsOnDay(events, day);
        return (
          <button
            key={day.toISOString()}
            type="button"
            className={cn(
              'flex min-h-[10rem] flex-col gap-1 rounded-lg border border-border/40 bg-card p-2 text-left',
              'hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSameDay(day, today) && 'ring-1 ring-primary/40',
            )}
            onClick={() => onSlotClick?.(day)}
          >
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-[0.7rem] text-muted-foreground">{weekdays[i]}</span>
              <span className="text-sm font-medium">{format(day, 'd')}</span>
            </div>
            <div className="flex flex-col gap-1">
              {dayEvents.map((event) => (
                <EventChip key={event.id} event={event} onClick={onEventClick} />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DayPane({
  anchor,
  events,
  onEventClick,
  onSlotClick,
}: {
  anchor: Date;
  events: EventCalendarEvent[];
  onEventClick?: (event: EventCalendarEvent) => void;
  onSlotClick?: (date: Date) => void;
}) {
  const dayEvents = eventsOnDay(events, anchor);
  return (
    <button
      type="button"
      className={cn(
        'flex min-h-[16rem] flex-col gap-2 rounded-lg border border-border/40 bg-card p-3 text-left',
        'hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      onClick={() => onSlotClick?.(anchor)}
    >
      <p className="text-sm text-muted-foreground">{format(anchor, 'EEEE, MMMM d')}</p>
      {dayEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events</p>
      ) : (
        <div className="flex flex-col gap-2">
          {dayEvents.map((event) => (
            <EventChip key={event.id} event={event} onClick={onEventClick} />
          ))}
        </div>
      )}
    </button>
  );
}

export type { EventCalendarEvent, EventCalendarProps, EventCalendarView };
export { EventCalendar };
