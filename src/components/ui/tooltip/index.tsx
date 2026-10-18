import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { surfaceOverlay } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /**
   * Delay (in ms) before the tooltip opens on hover.
   */
  delayDuration?: number;
  /**
   * Delay (in ms) before the tooltip closes after hover ends.
   * Keep long enough to move the pointer onto the bubble.
   */
  closeDelay?: number;
}

/**
 * Tooltip that stays open while the pointer is over the trigger or the content.
 * On touch / click, toggles open until tap-away or Escape.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  closeDelay = 280,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const stickyRef = React.useRef(false);

  const openTimeoutRef = React.useRef<number | null>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);

  const clearOpenTimeout = React.useCallback(() => {
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  }, []);

  const clearCloseTimeout = React.useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    if (stickyRef.current) return;
    clearOpenTimeout();
    clearCloseTimeout();
    if (closeDelay === 0) {
      setOpen(false);
      return;
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, closeDelay);
  }, [clearCloseTimeout, clearOpenTimeout, closeDelay]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        stickyRef.current = false;
        clearOpenTimeout();
        clearCloseTimeout();
        setOpen(false);
      }
    },
    [clearCloseTimeout, clearOpenTimeout],
  );

  const handlePointerEnter = React.useCallback(() => {
    clearCloseTimeout();
    clearOpenTimeout();
    openTimeoutRef.current = window.setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  }, [clearCloseTimeout, clearOpenTimeout, delayDuration]);

  const handlePointerLeave = React.useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  const handleTriggerClick = React.useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      // Touch / click: toggle sticky open so mobile can read the content.
      if (e.detail === 0) return;
      clearOpenTimeout();
      clearCloseTimeout();
      stickyRef.current = !open;
      setOpen((prev) => !prev);
    },
    [clearCloseTimeout, clearOpenTimeout, open],
  );

  React.useEffect(
    () => () => {
      clearOpenTimeout();
      clearCloseTimeout();
    },
    [clearCloseTimeout, clearOpenTimeout],
  );

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <TooltipPrimitive.Trigger
        asChild
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleTriggerClick}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={6}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={cn(
            surfaceOverlay,
            'z-110 max-w-xs px-3 py-2 text-sm outline-none',
            'animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
