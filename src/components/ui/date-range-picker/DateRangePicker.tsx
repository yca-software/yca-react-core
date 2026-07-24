import { format } from 'date-fns';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { surfaceOverlay } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { DEFAULT_PRESET_IDS, DEFAULT_PRESET_LABELS, DEFAULT_TRANSLATIONS } from './constants';
import { DateRangePickerActionFooter } from './DateRangePickerActionFooter';
import { DateRangePickerFieldsCalendar } from './DateRangePickerFieldsCalendar';
import { DateRangePickerPresetList } from './DateRangePickerPresetList';
import { DateRangePickerTrigger } from './DateRangePickerTrigger';
import {
  DISPLAY_FORMAT,
  formatRangeLabel,
  INPUT_FORMAT,
  normalizeDate,
  parseDate,
  parseInputToRange,
} from './parseDateRange';
import type { DateRangePickerProps } from './types';
import { getPresetRange } from './useDateRangePresets';
import { useIsDatePickerMobileLayout, useIsWideDatePickerLayout } from './useMediaQuery';

/** Range picker with presets, mobile dialog, and optional apply flow. Storybook: **UI/DateRangePicker**. */
export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
  showPresets = true,
  presets: customPresets,
  translations,
  locale,
  onApply,
  isDateDisabled,
  className,
}: DateRangePickerProps) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };
  const effectivePlaceholder = placeholder ?? t.placeholder;
  const presetList = React.useMemo(() => {
    if (customPresets?.length) return customPresets;
    if (!showPresets) return [];
    return DEFAULT_PRESET_IDS.map(({ id }) => ({
      id,
      label: translations?.presetLabels?.[id] ?? DEFAULT_PRESET_LABELS[id],
      getRange: () => getPresetRange(id),
    }));
  }, [customPresets, showPresets, translations?.presetLabels]);

  const normalizedMin = normalizeDate(minDate);
  const normalizedMax = normalizeDate(maxDate);
  const isMobileLayout = useIsDatePickerMobileLayout();
  const isWideLayout = useIsWideDatePickerLayout();
  const calendarMonths = isMobileLayout ? 1 : isWideLayout ? 2 : 1;
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);
  const [displayedMonth, setDisplayedMonth] = React.useState(() => value?.from ?? new Date());
  const appliedRef = React.useRef<DateRange | undefined>(value);
  const wasOpenRef = React.useRef(false);
  const useApplyFlow = !!onApply;
  const idScope = React.useId();
  const startInputId = `date-range-start-${idScope}`;
  const endInputId = `date-range-end-${idScope}`;

  React.useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (open && !wasOpen) {
      appliedRef.current = value;
      setDraft(value);
      setDisplayedMonth(value?.from ?? new Date());
    } else if (open && wasOpen) {
      setDraft(value);
    }
  }, [open, value]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next && open && !useApplyFlow) {
        onChange(appliedRef.current);
        setDraft(appliedRef.current);
      }
      setOpen(next);
    },
    [open, useApplyFlow, onChange],
  );

  const formatOpts = React.useMemo(() => (locale ? { locale } : undefined), [locale]);
  const label = React.useMemo(
    () => formatRangeLabel(value, effectivePlaceholder, formatOpts),
    [effectivePlaceholder, value, formatOpts],
  );

  const [inputText, setInputText] = React.useState(label);
  const inputFocusedRef = React.useRef(false);
  React.useEffect(() => {
    if (!inputFocusedRef.current) setInputText(label);
  }, [label]);

  const handleInputBlur = () => {
    inputFocusedRef.current = false;
    const next = parseInputToRange(inputText);
    if (next) {
      const formatted =
        next.from && next.to
          ? `${format(next.from, DISPLAY_FORMAT, formatOpts)} \u2013 ${format(next.to, DISPLAY_FORMAT, formatOpts)}`
          : next.from
            ? format(next.from, DISPLAY_FORMAT, formatOpts)
            : effectivePlaceholder;
      if (useApplyFlow) {
        setDraft(next);
        setInputText(formatted);
      } else {
        onChange(next);
        setInputText(formatted);
      }
    } else {
      setInputText(label);
    }
  };

  const disabledMatchers = React.useMemo(() => {
    const toStartOfDay = (d: Date) => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy.getTime();
    };
    const matchers: Array<unknown> = [];
    if (normalizedMin) {
      matchers.push((date: Date) => toStartOfDay(date) < toStartOfDay(normalizedMin!));
    }
    if (normalizedMax) {
      matchers.push((date: Date) => toStartOfDay(date) > toStartOfDay(normalizedMax!));
    }
    if (isDateDisabled) matchers.push((date: Date) => isDateDisabled(date));
    return matchers as import('react-day-picker').Matcher[];
  }, [normalizedMin, normalizedMax, isDateDisabled]);

  const handlePreset = (getRange: () => DateRange) => {
    const range = getRange();
    setDraft(range);
    if (!useApplyFlow) onChange(range);
  };

  const handleApply = () => {
    if (useApplyFlow) {
      onChange(draft);
      onApply?.(draft);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (useApplyFlow) {
      setDraft(appliedRef.current);
    } else {
      onChange(appliedRef.current);
      setDraft(appliedRef.current);
    }
    setOpen(false);
  };

  const handleSelect = (_next: DateRange | undefined, triggerDate: Date) => {
    const day = normalizeDate(triggerDate);
    if (!day) return;
    setDraft((prev) => {
      if (!prev?.from || (prev.from && prev.to)) {
        const nextRange = { from: day, to: undefined };
        if (!useApplyFlow) onChange(nextRange);
        return nextRange;
      }
      if (day < prev.from) {
        const nextRange = { from: day, to: undefined };
        if (!useApplyFlow) onChange(nextRange);
        return nextRange;
      }
      const nextRange = { from: prev.from, to: day };
      if (!useApplyFlow) onChange(nextRange);
      return nextRange;
    });
  };

  const [startInputText, setStartInputText] = React.useState('');
  const [endInputText, setEndInputText] = React.useState('');
  React.useEffect(() => {
    if (open) {
      setStartInputText(draft?.from ? format(draft.from, INPUT_FORMAT) : '');
      setEndInputText(draft?.to ? format(draft.to, INPUT_FORMAT) : '');
    }
  }, [open, draft?.from, draft?.to]);

  const commitStartInput = () => {
    const d = parseDate(startInputText);
    if (d) {
      setDraft((prev) => ({ from: d, to: prev?.to && prev.to >= d ? prev.to : undefined }));
    } else {
      setStartInputText(draft?.from ? format(draft.from, INPUT_FORMAT) : '');
    }
  };

  const commitEndInput = () => {
    const d = parseDate(endInputText);
    if (d) {
      setDraft((prev) => ({ from: prev?.from && prev.from <= d ? prev.from : d, to: d }));
    } else {
      setEndInputText(draft?.to ? format(draft.to, INPUT_FORMAT) : '');
    }
  };

  const fieldsCalendar = (
    <DateRangePickerFieldsCalendar
      calendarMonths={calendarMonths}
      draft={draft}
      displayedMonth={displayedMonth}
      onMonthChange={setDisplayedMonth}
      onSelect={handleSelect}
      disabledMatchers={disabledMatchers}
      locale={locale}
      startInputId={startInputId}
      endInputId={endInputId}
      startLabel={t.startLabel}
      endLabel={t.endLabel}
      startInputText={startInputText}
      endInputText={endInputText}
      effectivePlaceholder={effectivePlaceholder}
      onStartInputChange={setStartInputText}
      onEndInputChange={setEndInputText}
      onCommitStart={commitStartInput}
      onCommitEnd={commitEndInput}
    />
  );

  const footer = (
    <DateRangePickerActionFooter
      visible={useApplyFlow || isMobileLayout}
      isMobileLayout={isMobileLayout}
      cancelLabel={t.cancelButton}
      applyLabel={t.applyButton}
      onCancel={handleCancel}
      onApply={handleApply}
    />
  );

  const trigger = (
    <DateRangePickerTrigger
      className={className}
      inputText={inputText}
      effectivePlaceholder={effectivePlaceholder}
      isEmpty={!value?.from}
      ariaLabel={t.ariaLabel}
      onOpen={() => setOpen(true)}
      onInputChange={setInputText}
      onInputFocus={() => {
        inputFocusedRef.current = true;
      }}
      onInputBlur={handleInputBlur}
    />
  );

  if (isMobileLayout) {
    return (
      <>
        {trigger}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent
            showCloseButton
            className={cn(
              'h-dvh max-h-dvh w-full max-w-full gap-0 rounded-none border-0 p-0 shadow-[var(--shadow-elevated)]',
              'top-0 left-0 flex translate-x-0 translate-y-0 flex-col',
            )}
            overlayClassName="z-110"
          >
            <DialogHeader className="shrink-0 items-start border-b border-border/50 px-4 py-4 text-left">
              <DialogTitle className="pr-10 text-left text-base">{t.ariaLabel}</DialogTitle>
            </DialogHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <DateRangePickerPresetList
                presets={presetList}
                draft={draft}
                layout="mobile-row"
                onPreset={handlePreset}
              />
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
                <div className="mx-auto flex w-full max-w-md flex-col items-center">
                  {fieldsCalendar}
                </div>
              </div>
              {footer}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    // Non-modal: trigger is an editable input that keeps focus. Modal focus-trap
    // + preventDefault(onOpenAutoFocus) dismisses the popover on open (same as DatePicker).
    <Popover modal={false} open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn(
          surfaceOverlay,
          'w-auto max-w-[min(calc(100vw-1.5rem),52rem)] overflow-hidden p-0',
          calendarMonths === 2 && 'min-w-[36rem]',
        )}
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col sm:flex-row">
          <DateRangePickerPresetList
            presets={presetList}
            draft={draft}
            layout="sidebar"
            presetsHeading={t.presetsHeading}
            onPreset={handlePreset}
          />
          <div className="flex min-w-0 flex-1 flex-col bg-background">
            <div className="flex w-full flex-col items-stretch p-4">{fieldsCalendar}</div>
            {footer}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
