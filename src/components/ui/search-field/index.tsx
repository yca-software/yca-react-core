import { Search, X } from 'lucide-react';
import type * as React from 'react';

import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { Input } from '../input';

export type SearchFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  /** Clears draft/applied search. Shown only when value is non-empty. */
  onClear?: () => void;
  placeholder?: string;
  /** Accessible label for the text field (defaults to placeholder). */
  'aria-label'?: string;
  searchButtonLabel?: string;
  clearButtonLabel?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
};

/**
 * Joined search control: text field + optional clear (X) + primary magnifier submit.
 */
export function SearchField({
  value,
  onValueChange,
  onSubmit,
  onClear,
  placeholder,
  'aria-label': ariaLabel,
  searchButtonLabel = 'Search',
  clearButtonLabel = 'Clear',
  className,
  inputClassName,
  disabled,
  id,
  name,
  autoComplete = 'off',
}: SearchFieldProps) {
  const hasText = value.trim().length > 0;

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        'flex h-9 w-full min-w-0 overflow-hidden rounded-md border border-input bg-background shadow-xs',
        'transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
        disabled && 'opacity-60',
        className,
      )}
    >
      <div className="relative flex min-w-0 flex-1 items-center">
        <Input
          id={id}
          name={name}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'h-9 rounded-none rounded-l-md border-0 bg-transparent px-3 shadow-none',
            'focus-visible:border-transparent focus-visible:ring-0',
            hasText && onClear && 'pr-9',
            inputClassName,
          )}
          aria-label={ariaLabel ?? placeholder}
        />
        {hasText && onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={onClear}
            aria-label={clearButtonLabel}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>
      <Button
        type="button"
        variant="default"
        disabled={disabled}
        onClick={onSubmit}
        aria-label={searchButtonLabel}
        className={cn(
          'h-full w-10 shrink-0 rounded-none rounded-r-md border-0 border-l border-primary-foreground/15 px-0 shadow-none',
          'hover:bg-primary/90 active:bg-primary/95',
          'shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--primary-foreground)_20%,transparent)]',
        )}
      >
        <Search className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}
