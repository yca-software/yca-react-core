import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Maps ISO 639-1 language codes to flag emojis; defaults to globe. */
export function getFlagEmoji(langCode: string): string {
  const flagMap: Record<string, string> = {
    en: '🇬🇧',
    tr: '🇹🇷',
    fr: '🇫🇷',
    es: '🇪🇸',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇵🇹',
    ru: '🇷🇺',
    ja: '🇯🇵',
    zh: '🇨🇳',
    ko: '🇰🇷',
    ar: '🇸🇦',
    hi: '🇮🇳',
    nl: '🇳🇱',
    pl: '🇵🇱',
    sv: '🇸🇪',
    da: '🇩🇰',
    fi: '🇫🇮',
    no: '🇳🇴',
    cs: '🇨🇿',
    ro: '🇷🇴',
    hu: '🇭🇺',
    el: '🇬🇷',
    he: '🇮🇱',
    th: '🇹🇭',
    vi: '🇻🇳',
    id: '🇮🇩',
    ms: '🇲🇾',
  };
  return flagMap[langCode] || '🌐';
}
