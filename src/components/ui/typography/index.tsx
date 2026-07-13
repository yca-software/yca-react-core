import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../lib/utils';

const headingVariants = cva('font-semibold tracking-tight text-foreground', {
  variants: {
    level: {
      h1: 'text-3xl font-bold',
      h2: 'text-2xl',
      h3: 'text-xl',
      h4: 'text-lg',
    },
  },
  defaultVariants: {
    level: 'h1',
  },
});

const paragraphVariants = cva('text-muted-foreground leading-relaxed', {
  variants: {
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** Semantic heading level when it differs from visual `level`. */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

/** Page and section headings using theme foreground color. */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, as, ...props }, ref) => {
    const Component =
      as || (level === 'h1' ? 'h1' : level === 'h2' ? 'h2' : level === 'h3' ? 'h3' : 'h4');
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level: level || as }), className)}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

/** Body copy with muted foreground by default. */
const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size, ...props }, ref) => {
    return <p ref={ref} className={cn(paragraphVariants({ size }), className)} {...props} />;
  },
);
Paragraph.displayName = 'Paragraph';

/** Convenience wrapper for level-3 headings. */
const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Heading ref={ref} level="h3" as="h3" className={className} {...props} />
  ),
);
H3.displayName = 'H3';

export { H3, Heading, headingVariants, Paragraph, paragraphVariants };
