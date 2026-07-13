import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuditLogListFilters } from '.';

const options = {
  actionOptions: [
    { value: 'all', label: 'All actions' },
    { value: 'create', label: 'Create' },
  ],
  resourceOptions: [
    { value: 'all', label: 'All resources' },
    { value: 'user', label: 'User' },
  ],
};

describe('AuditLogListFilters', () => {
  it('updates search via onSearchChange', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <AuditLogListFilters
        search=""
        onSearchChange={onSearchChange}
        action="all"
        onActionChange={vi.fn()}
        resourceType="all"
        onResourceTypeChange={vi.fn()}
        searchPlaceholder="Search logs"
        actionFilterLabel="Action"
        resourceFilterLabel="Resource"
        {...options}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: 'Search logs' }), 'login');
    expect(onSearchChange).toHaveBeenCalled();
  });

  it('renders filter controls', () => {
    render(
      <AuditLogListFilters
        search="audit"
        onSearchChange={vi.fn()}
        action="create"
        onActionChange={vi.fn()}
        resourceType="user"
        onResourceTypeChange={vi.fn()}
        searchPlaceholder="Search logs"
        actionFilterLabel="Action filter"
        resourceFilterLabel="Resource filter"
        {...options}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Search logs' })).toHaveValue('audit');
    expect(screen.getByRole('combobox', { name: 'Action filter' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Resource filter' })).toBeInTheDocument();
  });
});
