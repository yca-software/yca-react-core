import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Select } from './index';

describe('Select', () => {
  it('opens by pointer immediately after selecting an option', async () => {
    const user = userEvent.setup();
    const options = [
      { value: 'first', label: 'First pipeline' },
      { value: 'second', label: 'Second pipeline' },
    ];
    const Harness = () => {
      const [value, setValue] = useState(options[0].value);
      return (
        <Select value={value} onValueChange={setValue} options={options} aria-label="Pipeline" />
      );
    };

    render(<Harness />);
    const trigger = screen.getByRole('combobox', { name: 'Pipeline' });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Second pipeline' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'First pipeline' })).toBeVisible();
  });
});
