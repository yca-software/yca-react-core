import { describe, expect, it } from 'vitest';
import { filterSelectOptions, isSelectSearchable } from '.';

describe('filterSelectOptions', () => {
  const options = [
    { value: '1', label: 'Alpha Bar' },
    { value: '2', label: 'Beta Pub' },
  ];

  it('returns all options when query is empty', () => {
    expect(filterSelectOptions(options, '')).toEqual(options);
    expect(filterSelectOptions(options, '   ')).toEqual(options);
  });

  it('filters case-insensitively by label', () => {
    expect(filterSelectOptions(options, 'beta')).toEqual([options[1]]);
  });

  it('matches ASCII queries against Turkish letters (Hektaş)', () => {
    const stocks = [{ value: '1', label: 'HEKTS — Hektaş' }];
    expect(filterSelectOptions(stocks, 'hektas')).toEqual(stocks);
    expect(filterSelectOptions(stocks, 'HEKTS')).toEqual(stocks);
  });
});

describe('isSelectSearchable', () => {
  it('auto-enables at the threshold', () => {
    expect(isSelectSearchable(7)).toBe(false);
    expect(isSelectSearchable(8)).toBe(true);
  });

  it('respects explicit overrides', () => {
    expect(isSelectSearchable(3, true)).toBe(true);
    expect(isSelectSearchable(20, false)).toBe(false);
  });
});
