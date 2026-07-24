import type { DateRangePickerTranslations, DefaultPresetId } from './types';

/** Viewports below this width use a full-screen picker (Tailwind `sm` is 640px). */
export const DATE_RANGE_MOBILE_MAX_PX = 640;
export const DATE_RANGE_MOBILE_MQ = `(max-width: ${DATE_RANGE_MOBILE_MAX_PX - 1}px)`;

/**
 * Two months + preset sidebar need ~900px+; below that mid widths (e.g. ~780px)
 * use a compact popover: one month and horizontal preset chips.
 */
export const DATE_RANGE_WIDE_MIN_PX = 1024;
export const DATE_RANGE_WIDE_MQ = `(min-width: ${DATE_RANGE_WIDE_MIN_PX}px)`;

export const DEFAULT_PRESET_IDS: { id: DefaultPresetId }[] = [
  { id: 'today' },
  { id: 'yesterday' },
  { id: 'last7' },
  { id: 'last14' },
  { id: 'last30' },
  { id: 'thisWeek' },
  { id: 'lastWeek' },
  { id: 'thisMonth' },
  { id: 'lastMonth' },
];

export const DEFAULT_PRESET_LABELS: Record<DefaultPresetId, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7: 'Last 7 days',
  last14: 'Last 14 days',
  last30: 'Last 30 days',
  thisWeek: 'This week',
  lastWeek: 'Last week',
  thisMonth: 'This month',
  lastMonth: 'Last month',
};

export const DEFAULT_TRANSLATIONS: Required<DateRangePickerTranslations> = {
  applyButton: 'Apply',
  cancelButton: 'Cancel',
  startLabel: 'Start',
  endLabel: 'End',
  placeholder: 'YYYY/MM/DD',
  ariaLabel: 'Date range',
  presetLabels: DEFAULT_PRESET_LABELS,
  presetsHeading: 'Quick ranges',
};
