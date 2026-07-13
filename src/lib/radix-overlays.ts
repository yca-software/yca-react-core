/**
 * Returns true when the event target is inside a Radix portaled overlay
 * (dropdown, popover, select listbox, datepicker calendar, etc.).
 * Used to prevent Sheet/Dialog dismiss on outside clicks into those layers.
 */
export function isRadixPortaledOverlay(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  return (
    target.closest('[data-radix-popper-content-wrapper]') !== null ||
    target.closest('[data-slot="dropdown-menu"]') !== null ||
    target.closest('[data-slot="dropdown-menu-content"]') !== null ||
    target.closest('[data-slot="dropdown-menu-item"]') !== null ||
    target.closest('[data-slot="popover"]') !== null ||
    target.closest('[data-slot="popover-content"]') !== null ||
    target.closest('[data-slot="calendar"]') !== null ||
    target.closest('[role="listbox"]') !== null ||
    target.closest('[role="menu"]') !== null
  );
}

/** Prevents Sheet/Dialog dismiss when focus or pointer lands on a portaled overlay. */
export function preventDismissOnPortaledOverlay(event: Event) {
  if (isRadixPortaledOverlay(event.target)) {
    event.preventDefault();
  }
}
