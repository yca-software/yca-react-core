import type * as React from 'react';

import { controlBase, controlFocus, controlInvalid } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';

const numberInputClassName =
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

function shouldSelectAllNumberInputOnFocus(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '.') {
    return true;
  }
  const parsed = Number(trimmed);
  return !Number.isNaN(parsed) && parsed === 0;
}

/** Text field styled with theme tokens. See Storybook **UI/Input**. */
function Input({ className, type, onFocus, ...props }: React.ComponentProps<'input'>) {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (type === 'number' && shouldSelectAllNumberInputOnFocus(event.currentTarget.value)) {
      event.currentTarget.select();
    }
    onFocus?.(event);
  };

  return (
    <input
      type={type}
      onFocus={handleFocus}
      data-slot="input"
      className={cn(
        controlBase,
        controlFocus,
        controlInvalid,
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'h-9 w-full min-w-0 px-3 py-1 text-base md:text-sm',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100',
        'disabled:bg-muted/50 disabled:text-muted-foreground disabled:border-border/40',
        'dark:disabled:bg-muted/25',
        type === 'number' && numberInputClassName,
        className,
      )}
      {...props}
    />
  );
}

export { Input };
