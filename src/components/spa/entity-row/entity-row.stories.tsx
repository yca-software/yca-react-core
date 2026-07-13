import type { Meta, StoryObj } from '@storybook/react';
import { Pencil, Trash2 } from 'lucide-react';
import { TooltipProvider } from '../../ui/tooltip';
import { EntityRow } from '.';

const meta = {
  title: 'SPA/EntityRow',
  component: EntityRow,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Settings entity list row with icon, actions menu, and optional click handler.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EntityRow>;

export default meta;
type Story = StoryObj<typeof EntityRow>;

export const Default: Story = {
  args: {
    icon: Pencil,
    title: 'Admin role',
    description: 'Full access to organization settings',
    subtitle: 'Created yesterday',
  },
};

export const WithActions: Story = {
  args: {
    icon: Pencil,
    title: 'API key',
    actions: [
      { label: 'Edit', icon: Pencil, onClick: () => {} },
      { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'destructive' },
    ],
  },
};
