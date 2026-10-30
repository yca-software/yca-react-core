import { Label } from '../../ui/label';
import type { SelectOption, SelectTranslations } from '../../ui/select';
import { Select } from '../../ui/select';

export type LabeledSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  searchable?: boolean;
  translations?: SelectTranslations;
  /**
   * `stacked` (default) — label above the field (forms / filters).
   * `inline` — label beside the field (dense toolbars only).
   */
  layout?: 'stacked' | 'inline';
};

/** Labeled Select — labels sit above the control by default. */
export function LabeledSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  triggerClassName,
  searchable,
  translations,
  layout = 'stacked',
}: LabeledSelectProps) {
  const select = (
    <Select
      className={className ?? (layout === 'stacked' ? 'w-full min-w-[8.5rem]' : 'w-[8.5rem]')}
      triggerClassName={triggerClassName ?? 'h-9'}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      searchable={searchable}
      translations={translations}
      aria-label={label}
    />
  );

  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
        {select}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium tracking-normal text-muted-foreground">{label}</Label>
      {select}
    </div>
  );
}
