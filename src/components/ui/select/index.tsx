import * as React from 'react';
import { controlBase, controlFocus } from '../../../lib/surfaces';
import { cn } from '../../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  dropdownMenuSelectOptionsMaxHeightClassName,
} from '../dropdown-menu';
import { DropdownScrollableList } from '../dropdown-scrollable-list';
import { DropdownSelectSearchInput } from '../dropdown-select-search-input';
import { useInsideModalScrollLock } from '../inside-modal-scroll-lock';
import { filterSelectOptions, isSelectSearchable } from '../select-search';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectTranslations {
  searchPlaceholder?: string;
  noOptionsText?: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  /** When omitted, search appears automatically for 8+ options. */
  searchable?: boolean;
  translations?: SelectTranslations;
  'aria-label'?: string;
}

const DEFAULT_TRANSLATIONS: Required<SelectTranslations> = {
  searchPlaceholder: 'Search…',
  noOptionsText: 'No options',
};

function Select({
  value,
  onValueChange,
  options,
  placeholder = '',
  disabled = false,
  className,
  triggerClassName,
  searchable,
  translations,
  'aria-label': ariaLabel,
}: SelectProps) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };
  const insideModalScrollLock = useInsideModalScrollLock();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const showSearch = isSelectSearchable(options.length, searchable);
  const filteredOptions = React.useMemo(
    () => (showSearch ? filterSelectOptions(options, search) : options),
    [options, search, showSearch],
  );
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label ?? placeholder;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch('');
  };

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            controlBase,
            controlFocus,
            'flex h-9 w-full cursor-pointer items-center justify-between px-3 py-2 text-sm',
            'hover:bg-accent/40 disabled:pointer-events-none disabled:opacity-50',
            !value && 'text-muted-foreground',
            triggerClassName,
            className,
          )}
        >
          <span className="min-w-0 truncate text-left">{displayValue}</span>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={0}
        portalled={!insideModalScrollLock}
        className="z-[120] flex min-w-(--radix-dropdown-menu-trigger-width) flex-col overflow-hidden p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {showSearch ? (
          <DropdownSelectSearchInput
            value={search}
            onChange={setSearch}
            placeholder={t.searchPlaceholder}
            autoFocus={open}
          />
        ) : null}
        <DropdownScrollableList
          grow={false}
          scrollAreaClassName={cn(
            'overflow-y-auto overscroll-y-contain p-1 pb-6',
            dropdownMenuSelectOptionsMaxHeightClassName,
          )}
          scrollKey={`${filteredOptions.length}-${open ? 1 : 0}-${search}`}
        >
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">{t.noOptionsText}</p>
          ) : (
            filteredOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => {
                  onValueChange(opt.value);
                  setOpen(false);
                  setSearch('');
                }}
              >
                {opt.label}
              </DropdownMenuItem>
            ))
          )}
        </DropdownScrollableList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChevronDownIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <title>Chevron down</title>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export { Select };
