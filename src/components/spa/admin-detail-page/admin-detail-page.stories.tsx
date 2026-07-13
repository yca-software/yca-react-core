import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { AdminDetailPage } from '.';

const meta = {
  title: 'SPA/AdminDetailPage',
  component: AdminDetailPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Admin detail shell: back link, loading/error states, content slot.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminDetailPage>;

export default meta;
type Story = StoryObj<typeof AdminDetailPage>;

export const Default: Story = {
  args: {
    backHref: '/admin/users',
    backLabel: 'Back to users',
    isLoading: false,
    notFoundMessage: 'Not found',
    forbiddenMessage: 'Forbidden',
    loadErrorMessage: 'Failed to load',
    children: <div className="rounded-lg border p-6">User detail content</div>,
  },
};

export const Content: Story = {
  args: {
    backHref: '/admin/users',
    backLabel: 'Back to users',
    isLoading: false,
    notFoundMessage: 'Not found',
    forbiddenMessage: 'Forbidden',
    loadErrorMessage: 'Failed to load',
    children: <div className="rounded-lg border p-6">User detail content</div>,
    headerActions: <button type="button">Edit</button>,
  },
};

export const Loading: Story = {
  args: {
    backHref: '/',
    backLabel: 'Back',
    isLoading: true,
    notFoundMessage: '',
    forbiddenMessage: '',
    loadErrorMessage: '',
    children: null,
  },
};

export const NotFound: Story = {
  args: {
    backHref: '/admin/users',
    backLabel: 'Back to users',
    isLoading: false,
    errorKind: 'notFound',
    notFoundMessage: 'This user no longer exists.',
    forbiddenMessage: 'Forbidden',
    loadErrorMessage: 'Failed to load',
    children: null,
  },
};

export const Forbidden: Story = {
  args: {
    backHref: '/admin/users',
    backLabel: 'Back to users',
    isLoading: false,
    errorKind: 'forbidden',
    notFoundMessage: 'Not found',
    forbiddenMessage: 'You need admin access to view this page.',
    loadErrorMessage: 'Failed to load',
    children: null,
  },
};

export const LoadError: Story = {
  args: {
    backHref: '/admin/users',
    backLabel: 'Back to users',
    isLoading: false,
    errorKind: 'load',
    notFoundMessage: 'Not found',
    forbiddenMessage: 'Forbidden',
    loadErrorMessage: 'Could not load this record.',
    children: null,
  },
};
