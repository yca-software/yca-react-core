import type { Locale } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { surfaceCard } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';
import { Calendar } from '../calendar';
import { Input } from '../input';

export type DateRangePickerFieldsCalendarProps = {
  calendarMonths: number;
  draft: DateRange | undefined;
  displayedMonth: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (next: DateRange | undefined, triggerDate: Date) => void;
  disabledMatchers: import('react-day-picker').Matcher[];
  locale?: Locale;
  startInputId: string;
  endInputId: string;
  startLabel: string;
  endLabel: string;
  startInputText: string;
  endInputText: string;
  effectivePlaceholder: string;
  onStartInputChange: (value: string) => void;
  onEndInputChange: (value: string) => void;
  onCommitStart: () => void;
  onCommitEnd: () => void;
};

/** Start/end date inputs and range calendar. */
export function DateRangePickerFieldsCalendar({
  calendarMonths,
  draft,
  displayedMonth,
  onMonthChange,
  onSelect,
  disabledMatchers,
  locale,
  startInputId,
  endInputId,
  startLabel,
  endLabel,
  startInputText,
  endInputText,
  effectivePlaceholder,
  onStartInputChange,
  onEndInputChange,
  onCommitStart,
  onCommitEnd,
}: DateRangePickerFieldsCalendarProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          'grid w-full grid-cols-1 gap-3 rounded-xl border border-border/45 bg-muted/20 p-3 sm:grid-cols-2',
          calendarMonths === 2 ? 'max-w-none' : 'max-w-md',
        )}
      >
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={startInputId} className="text-xs font-medium text-muted-foreground">
            {startLabel}
          </label>
          <Input
            id={startInputId}
            type="text"
            value={startInputText}
            onChange={(e) => onStartInputChange(e.target.value)}
            onBlur={onCommitStart}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onCommitStart();
              }
            }}
            placeholder={effectivePlaceholder}
            className="h-9 font-mono text-sm tabular-nums"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={endInputId} className="text-xs font-medium text-muted-foreground">
            {endLabel}
          </label>
          <Input
            id={endInputId}
            type="text"
            value={endInputText}
            onChange={(e) => onEndInputChange(e.target.value)}
            onBlur={onCommitEnd}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onCommitEnd();
              }
            }}
            placeholder={effectivePlaceholder}
            className="h-9 font-mono text-sm tabular-nums"
          />
        </div>
      </div>
      <div className={cn(surfaceCard, 'flex w-full justify-center p-1')}>
        <Calendar
          mode="range"
          numberOfMonths={calendarMonths}
          month={displayedMonth}
          onMonthChange={onMonthChange}
          selected={draft}
          onSelect={onSelect}
          disabled={disabledMatchers}
          locale={locale}
          className={cn(calendarMonths === 2 && 'p-2')}
        />
      </div>
    </div>
  );
}
