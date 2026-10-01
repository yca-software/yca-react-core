import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchField } from '.';

describe('SearchField', () => {
  it('submits on Enter and search button', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onValueChange = vi.fn();

    render(
      <SearchField
        value="meter"
        onValueChange={onValueChange}
        onSubmit={onSubmit}
        placeholder="Search"
        searchButtonLabel="Find"
      />,
    );

    await user.click(screen.getByRole('textbox', { name: 'Search' }));
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: 'Find' }));

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it('shows clear only when value is non-empty', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    const { rerender } = render(
      <SearchField
        value=""
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        onClear={onClear}
        placeholder="Search"
        searchButtonLabel="Find"
        clearButtonLabel="Reset"
      />,
    );

    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();

    rerender(
      <SearchField
        value="draft"
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        onClear={onClear}
        placeholder="Search"
        searchButtonLabel="Find"
        clearButtonLabel="Reset"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
