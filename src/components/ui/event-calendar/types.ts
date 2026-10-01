/** A single calendar event shown in {@link EventCalendar}. */
export interface EventCalendarEvent {
  id: string;
  title: string;
  /** Inclusive start (date or datetime). */
  start: Date;
  /** Exclusive end; defaults to end of start day for all-day display. */
  end?: Date;
  /** Optional accent — CSS color or theme token class via `colorClassName`. */
  color?: string;
  colorClassName?: string;
  allDay?: boolean;
}

export type EventCalendarView = 'month' | 'week' | 'day';

export interface EventCalendarProps {
  events: EventCalendarEvent[];
  /** Controlled visible date (any day within the visible range). */
  value?: Date;
  /** Uncontrolled initial date. */
  defaultValue?: Date;
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onValueChange?: (date: Date) => void;
  onViewChange?: (view: EventCalendarView) => void;
  onEventClick?: (event: EventCalendarEvent) => void;
  onSlotClick?: (date: Date) => void;
  className?: string;
  /** Week starts on Monday when true (default). */
  weekStartsOnMonday?: boolean;
  labels?: {
    today?: string;
    month?: string;
    week?: string;
    day?: string;
  };
}
