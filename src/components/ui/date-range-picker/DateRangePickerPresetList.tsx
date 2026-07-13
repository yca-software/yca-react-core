import type { DateRange } from 'react-day-picker';

import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { rangesMatch } from './parseDateRange';
import type { PresetListItem } from './types';

export type DateRangePickerPresetListProps = {
  presets: PresetListItem[];
  draft: DateRange | undefined;
  layout: 'mobile-row' | 'sidebar';
  presetsHeading?: string;
  onPreset: (getRange: () => DateRange) => void;
};

/** Preset chips (mobile) or sidebar list (desktop). */
export function DateRangePickerPresetList({
  presets,
  draft,
  layout,
  presetsHeading,
  onPreset,
}: DateRangePickerPresetListProps) {
  if (presets.length === 0) return null;

  if (layout === 'mobile-row') {
    return (
      <div className="shrink-0 border-b border-border/50 bg-muted/20 px-2 py-2">
        <div className="flex gap-1 overflow-x-auto overscroll-x-contain px-1 py-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
          {presets.map((preset) => {
            const active = rangesMatch(draft, preset.getRange());
            return (
              <Button
                key={preset.id}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-9 shrink-0 whitespace-nowrap rounded-lg px-2.5 text-sm font-normal',
                  active && 'bg-accent font-medium text-accent-foreground',
                )}
                onClick={() => onPreset(preset.getRange)}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[11.5rem] shrink-0 border-r border-border/50 bg-muted/20">
      <div className="flex max-h-[min(420px,70vh)] flex-col gap-0.5 overflow-y-auto p-2 [scrollbar-width:thin]">
        {presetsHeading ? (
          <p className="px-2 pb-1 pt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {presetsHeading}
          </p>
        ) : null}
        {presets.map((preset) => {
          const active = rangesMatch(draft, preset.getRange());
          return (
            <Button
              key={preset.id}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 w-full shrink-0 justify-start rounded-lg px-2.5 text-left text-sm font-normal',
                active && 'bg-accent font-medium text-accent-foreground',
              )}
              onClick={() => onPreset(preset.getRange)}
            >
              {preset.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
