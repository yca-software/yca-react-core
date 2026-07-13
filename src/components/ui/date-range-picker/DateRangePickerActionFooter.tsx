import { cn } from '../../../lib/utils';
import { Button } from '../button';

export type DateRangePickerActionFooterProps = {
  visible: boolean;
  isMobileLayout: boolean;
  cancelLabel: string;
  applyLabel: string;
  onCancel: () => void;
  onApply: () => void;
  className?: string;
};

/** Cancel / apply actions for apply-flow and mobile layouts. */
export function DateRangePickerActionFooter({
  visible,
  isMobileLayout,
  cancelLabel,
  applyLabel,
  onCancel,
  onApply,
  className,
}: DateRangePickerActionFooterProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex w-full items-center justify-end gap-2 border-t border-border/50 bg-muted/15 px-4 py-3',
        isMobileLayout &&
          'mt-auto shrink-0 bg-background pb-[max(1rem,env(safe-area-inset-bottom))] pt-4',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(isMobileLayout && 'min-h-10 flex-1 sm:min-h-9 sm:flex-initial')}
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        className={cn(isMobileLayout && 'min-h-10 flex-1 sm:min-h-9 sm:flex-initial')}
        onClick={onApply}
      >
        {applyLabel}
      </Button>
    </div>
  );
}
