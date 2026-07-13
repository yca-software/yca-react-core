import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { controlFocus, controlInvalid } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium',
    'transition-all cursor-pointer shrink-0',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    controlFocus,
    controlInvalid,
  ],
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-surface)] hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[var(--shadow-surface)] hover:bg-destructive/90 focus-visible:ring-destructive/25 dark:bg-destructive/75',
        outline:
          'border border-border/50 bg-background shadow-[var(--shadow-surface)] hover:bg-accent hover:text-accent-foreground dark:bg-muted/20',
        secondary:
          'bg-secondary text-secondary-foreground shadow-[var(--shadow-surface)] hover:bg-secondary/85',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render as a child element (e.g. `<a>`) while keeping button styles. */
    asChild?: boolean;
  };

/** Primary action control. See Storybook **UI/Button** for variants. */
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
