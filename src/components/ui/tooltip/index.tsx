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

function prefersCoarsePointer(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function isPointerOver(el: HTMLElement | null, x: number, y: number): boolean {
  if (!el || typeof document.elementFromPoint !== 'function') return false;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const under = document.elementFromPoint(x, y);
  return Boolean(under && (under === el || el.contains(under)));
}

/**
 * Hover-driven tooltip. Never opens from focus. Never opens when UI mounts
 * under an existing cursor — hover is armed only after the pointer leaves the
 * trigger, or moves while clearly outside it (checked via elementFromPoint
 * after the trigger is laid out).
 *
 * Touch / coarse pointers tap to toggle.
 *
 * For chrome that appears with drawers/dialogs (title info), prefer click
 * (FormDrawer `info` uses a Popover) — hover races with slide-under-cursor.
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
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const stickyRef = React.useRef(false);
  const hoveringRef = React.useRef(false);
  const openRef = React.useRef(false);
  /** False until leave, or a post-layout move while outside the trigger. */
  const hoverArmedRef = React.useRef(false);
  /** Trigger has painted; safe to trust elementFromPoint. */
  const layoutReadyRef = React.useRef(false);
  const lastPointerRef = React.useRef({ x: Number.NaN, y: Number.NaN });

  const openTimeoutRef = React.useRef<number | null>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    openRef.current = open;
  }, [open]);

  React.useLayoutEffect(() => {
    hoverArmedRef.current = false;
    stickyRef.current = false;
    hoveringRef.current = false;
    layoutReadyRef.current = false;
    setOpen(false);

    const markReady = () => {
      layoutReadyRef.current = true;
      const el = triggerRef.current;
      const { x, y } = lastPointerRef.current;
      if (isPointerOver(el, x, y)) {
        hoverArmedRef.current = false;
        return;
      }
      hoverArmedRef.current = true;
    };

    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(markReady);
    });

    const onPointerMove = (event: PointerEvent) => {
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      if (!layoutReadyRef.current) return;
      if (isPointerOver(triggerRef.current, event.clientX, event.clientY)) return;
      hoverArmedRef.current = true;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

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
    if (stickyRef.current || hoveringRef.current) return;
    clearOpenTimeout();
    clearCloseTimeout();
    if (closeDelay === 0) {
      setOpen(false);
      return;
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      if (stickyRef.current || hoveringRef.current) return;
      setOpen(false);
    }, closeDelay);
  }, [clearCloseTimeout, clearOpenTimeout, closeDelay]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) {
        if (!hoveringRef.current && !stickyRef.current) return;
        setOpen(true);
        return;
      }
      if (stickyRef.current) {
        stickyRef.current = false;
        hoveringRef.current = false;
        clearOpenTimeout();
        clearCloseTimeout();
        setOpen(false);
        return;
      }
      scheduleClose();
    },
    [clearCloseTimeout, clearOpenTimeout, scheduleClose],
  );

  const handlePointerEnter = React.useCallback(() => {
    if (!hoverArmedRef.current) return;
    hoveringRef.current = true;
    clearCloseTimeout();
    clearOpenTimeout();
    if (openRef.current || delayDuration <= 0) {
      setOpen(true);
      return;
    }
    openTimeoutRef.current = window.setTimeout(() => {
      if (!hoveringRef.current || !hoverArmedRef.current) return;
      setOpen(true);
    }, delayDuration);
  }, [clearCloseTimeout, clearOpenTimeout, delayDuration]);

  const handlePointerLeave = React.useCallback(() => {
    hoverArmedRef.current = true;
    hoveringRef.current = false;
    scheduleClose();
  }, [scheduleClose]);

  const blockRadixFocusOpen = React.useCallback((e: React.FocusEvent) => {
    e.preventDefault();
  }, []);

  const blockRadixPointerMoveOpen = React.useCallback((e: React.PointerEvent) => {
    e.preventDefault();
  }, []);

  const handleTriggerClick = React.useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      if (!prefersCoarsePointer()) {
        e.preventDefault();
        return;
      }
      clearOpenTimeout();
      clearCloseTimeout();
      const next = !open;
      stickyRef.current = next;
      hoveringRef.current = next;
      hoverArmedRef.current = true;
      setOpen(next);
      e.preventDefault();
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
        ref={triggerRef}
        asChild
        onFocus={blockRadixFocusOpen}
        onPointerMove={blockRadixPointerMoveOpen}
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
