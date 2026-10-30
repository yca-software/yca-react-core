import { Info } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../../lib/utils';
import { InsideModalScrollLockProvider } from '../inside-modal-scroll-lock';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../sheet';

export interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  /**
   * @deprecated Prefer `info` (tooltip). Do not use for obvious UI chrome
   * (“search/sort/open…”) — only real documentation belongs in `info`.
   */
  description?: React.ReactNode;
  /**
   * Proper docs / instructions for the title. Opens on **click** only —
   * hover tooltips race with drawer slide-under-cursor and cannot be made safe.
   */
  info?: React.ReactNode;
  children: React.ReactNode;
  /** Max width class - applied to SheetContent via contentClassName preferred */
  className?: string;
  /** Sheet content class for overflow/scrolling / width */
  contentClassName?: string;
}

/**
 * A drawer shell for forms. Provides consistent Sheet + Header layout.
 * The form content (including SheetFooter) is provided by children.
 * Mobile-friendly: full width on small screens, max-width on larger.
 */
export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  info,
  children,
  className,
  contentClassName,
}: FormDrawerProps) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [infoOpen, setInfoOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) setInfoOpen(false);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-slot="form-drawer-content"
        // Focus an inert body node — never the title info control.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          bodyRef.current?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className={cn(
          'flex flex-col gap-4 w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg overflow-hidden',
          contentClassName,
        )}
      >
        <SheetHeader className="flex-shrink-0 gap-2 pb-2">
          <SheetTitle className="flex items-center gap-1.5 text-base sm:text-lg">
            <span className="min-w-0">{title}</span>
            {info ? (
              <Popover open={infoOpen} onOpenChange={setInfoOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex shrink-0 cursor-help rounded-sm p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="More info"
                    aria-expanded={infoOpen}
                  >
                    <Info className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  className="z-[120] max-w-xs p-3 text-sm leading-snug"
                >
                  {info}
                </PopoverContent>
              </Popover>
            ) : null}
          </SheetTitle>
          {description ? (
            <SheetDescription className="text-sm">{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <InsideModalScrollLockProvider>
          <div
            ref={bodyRef}
            tabIndex={-1}
            className={cn(
              // Inset so focus rings / box-shadow on full-width inputs are not clipped by overflow-y-auto
              'flex flex-col flex-1 min-h-0 gap-4 overflow-y-auto px-2 py-1 outline-none',
              className,
            )}
          >
            {children}
          </div>
        </InsideModalScrollLockProvider>
      </SheetContent>
    </Sheet>
  );
}
