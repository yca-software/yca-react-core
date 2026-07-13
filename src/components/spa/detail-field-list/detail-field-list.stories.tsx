import type { Meta, StoryObj } from '@storybook/react';
import { DetailFieldList } from '.';

const meta = {
  title: 'SPA/DetailFieldList',
  component: DetailFieldList,
  parameters: {
    docs: { description: { component: 'Definition list for admin/detail views.' } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DetailFieldList>;

export default meta;
type Story = StoryObj<typeof DetailFieldList>;

export const Default: Story = {
  args: {
    fields: [
      { label: 'Email', value: 'user@example.com' },
      { label: 'Role', value: 'Admin' },
      { label: 'Created', value: 'Jan 12, 2026' },
    ],
  },
};

export const Bordered: Story = {
  args: {
    fieldVariant: 'bordered',
    fields: [
      { label: 'Status', value: 'Active' },
      { label: 'Notes', value: 'Longer text spanning two columns on sm+', span: 2 },
    ],
  },
};
