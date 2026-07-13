import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../select';
import { FormDrawer } from '.';

const selectOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index),
  label: `Option ${index + 1}`,
}));

function DrawerWithSelect({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState('');

  return (
    <FormDrawer
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        setOpen(next);
      }}
      title="Create item"
    >
      <Select
        value={value}
        onValueChange={setValue}
        options={selectOptions}
        aria-label="Pick option"
      />
    </FormDrawer>
  );
}

describe('FormDrawer', () => {
  it('stays open when a Select option is chosen', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<DrawerWithSelect onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('combobox', { name: 'Pick option' }));
    await user.click(screen.getByRole('menuitem', { name: 'Option 1' }));

    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByRole('combobox', { name: 'Pick option' })).toHaveTextContent('Option 1');
  });

  it('renders a scrollable select menu inside the drawer', async () => {
    const user = userEvent.setup();
    render(<DrawerWithSelect onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole('combobox', { name: 'Pick option' }));

    expect(screen.getByRole('menuitem', { name: 'Option 12' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeTruthy();
  });
});
