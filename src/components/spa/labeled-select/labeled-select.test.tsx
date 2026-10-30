import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LabeledSelect } from '.';

const options = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
];

describe('LabeledSelect', () => {
  it('renders label above the combobox by default', () => {
    const { container } = render(
      <LabeledSelect label="Risk level" value="all" onValueChange={vi.fn()} options={options} />,
    );

    expect(screen.getByText('Risk level')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Risk level' })).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain('flex-col');
  });

  it('supports inline layout for dense toolbars', () => {
    const { container } = render(
      <LabeledSelect
        layout="inline"
        label="Risk level"
        value="all"
        onValueChange={vi.fn()}
        options={options}
      />,
    );
    expect(container.firstElementChild?.className).toContain('items-center');
  });
});
