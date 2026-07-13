import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DateRangeFilter } from '.';

const t = (key: string) => key;

describe('DateRangeFilter', () => {
  it('renders panel label and hint', () => {
    render(
      <DateRangeFilter
        label="Activity dates"
        hint="Applies to the selected range"
        value={undefined}
        onChange={vi.fn()}
        onApply={vi.fn()}
        t={t}
      />,
    );

    expect(screen.getByText('Activity dates')).toBeInTheDocument();
    expect(screen.getByText('Applies to the selected range')).toBeInTheDocument();
  });

  it('renders toolbar variant label', () => {
    render(
      <DateRangeFilter
        variant="toolbar"
        label="Range"
        value={undefined}
        onChange={vi.fn()}
        onApply={vi.fn()}
        t={t}
      />,
    );

    expect(screen.getByText('Range')).toBeInTheDocument();
  });
});
