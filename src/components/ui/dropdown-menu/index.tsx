import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';

import { surfaceOverlay } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';

/** About 5-6 options visible, then scroll; still shrinks when the viewport is short. */
export const dropdownMenuSelectOptionsMaxHeightClassName =
  'max-h-[min(var(--radix-dropdown-menu-content-available-height),13rem)]';

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  /**
   * When false, render inline instead of portaling to document.body so wheel scroll works
   * inside modal Sheet/Dialog scroll locks (e.g. Select in FormDrawer).
   * @default true
   */
  portalled?: boolean;
};

function DropdownMenuContent({
  className,
  sideOffset = 4,
  portalled = true,
  ...props
}: DropdownMenuContentProps) {
  const content = (
    <DropdownMenuPrimitive.Content
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      className={cn(
        surfaceOverlay,
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto p-1',
        className,
      )}
      {...props}
    />
  );

  if (!portalled) {
    return content;
  }

  return <DropdownMenuPrimitive.Portal>{content}</DropdownMenuPrimitive.Portal>;
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
