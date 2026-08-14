/** Show search in single-select dropdowns when option count reaches this threshold. */
export const SEARCHABLE_SELECT_MIN_OPTIONS = 8;

export interface SelectSearchableOption {
  label: string;
}

/** Fold Turkish letters so "hektas" matches "Hektaş" / HEKTS labels. */
export function foldSearchText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u');
}

export function filterSelectOptions<T extends SelectSearchableOption>(
  options: T[],
  query: string,
): T[] {
  const q = foldSearchText(query);
  if (!q) return options;
  return options.filter((option) => foldSearchText(option.label).includes(q));
}

export function isSelectSearchable(optionCount: number, searchable?: boolean): boolean {
  if (searchable === true) return true;
  if (searchable === false) return false;
  return optionCount >= SEARCHABLE_SELECT_MIN_OPTIONS;
}
