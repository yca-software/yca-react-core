import * as React from 'react';

import { controlBase, controlFocus, controlInvalid } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';

/** Multi-line text field. See Storybook **UI/Textarea**. */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        controlBase,
        controlFocus,
        controlInvalid,
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'flex min-h-[96px] w-full min-w-0 px-3 py-2 text-base md:text-sm',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
