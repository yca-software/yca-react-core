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
};

/** Toolbar filter select with a visible label + shared Select dropdown. */
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
}: LabeledSelectProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <Select
        className={className ?? 'w-[8.5rem]'}
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
    </div>
  );
}
