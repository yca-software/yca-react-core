import { Calendar as CalendarIcon } from 'lucide-react';
import { controlBase } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';
import { Input } from '../input';

export type DateRangePickerTriggerProps = {
  className?: string;
  inputText: string;
  effectivePlaceholder: string;
  isEmpty: boolean;
  ariaLabel: string;
  onOpen: () => void;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
};

/** Calendar icon + free-text range field that opens the picker. */
export function DateRangePickerTrigger({
  className,
  inputText,
  effectivePlaceholder,
  isEmpty,
  ariaLabel,
  onOpen,
  onInputChange,
  onInputFocus,
  onInputBlur,
}: DateRangePickerTriggerProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        controlBase,
        'flex w-full min-w-[17rem] max-w-full cursor-pointer items-center overflow-hidden focus-within:ring-[3px] focus-within:ring-ring/40',
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border-r border-border/40 bg-muted/25 text-muted-foreground">
        <CalendarIcon className="size-4" aria-hidden="true" />
      </span>
      <Input
        type="text"
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder={effectivePlaceholder}
        data-empty={isEmpty || undefined}
        className={cn(
          'h-10 min-w-0 flex-1 cursor-pointer rounded-none border-0 bg-transparent py-2 pl-3 pr-3 text-sm shadow-none focus-visible:ring-0 whitespace-nowrap',
          isEmpty && 'text-muted-foreground',
        )}
        title={!isEmpty ? inputText : undefined}
        aria-label={ariaLabel}
      />
    </div>
  );
}
