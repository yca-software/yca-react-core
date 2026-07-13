import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AuditLogListFilters } from '.';

const meta = {
  title: 'SPA/AuditLogListFilters',
  component: AuditLogListFilters,
  parameters: {
    docs: { description: { component: 'Search + action + resource filters for audit log lists.' } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuditLogListFilters>;

export default meta;
type Story = StoryObj<typeof AuditLogListFilters>;

export const Default: Story = {
  render: function Render() {
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('all');
    const [resource, setResource] = useState('all');
    return (
      <AuditLogListFilters
        search={search}
        onSearchChange={setSearch}
        action={action}
        onActionChange={setAction}
        resourceType={resource}
        onResourceTypeChange={setResource}
        searchPlaceholder="Search audit logs"
        actionFilterLabel="Action"
        resourceFilterLabel="Resource"
        actionOptions={[
          { value: 'all', label: 'All actions' },
          { value: 'create', label: 'Create' },
        ]}
        resourceOptions={[
          { value: 'all', label: 'All resources' },
          { value: 'user', label: 'User' },
        ]}
      />
    );
  },
};
