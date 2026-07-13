/**
 * Shared Tailwind class fragments for UI surfaces.
 * Tune the default look via theme tokens; override per-component with `className`.
 */

/** Text inputs, selects, textareas — border, radius, transition. */
export const controlBase =
  'rounded-lg border border-border/50 bg-muted/30 shadow-[var(--shadow-surface)] transition-[color,box-shadow,background-color]';

/** Shared focus ring for interactive controls. */
export const controlFocus =
  'outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]';

/** Invalid state ring for form controls. */
export const controlInvalid =
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/35';

/** Card and static elevated panels. */
export const surfaceCard =
  'rounded-xl border border-border/45 bg-card text-card-foreground shadow-[var(--shadow-surface)]';

/** Muted inset fill (used inside controlBase; available standalone). */
export const surfaceInset = 'bg-muted/30';

/** Dialogs, popovers, dropdown panels. */
export const surfaceOverlay =
  'rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-[var(--shadow-elevated)]';
