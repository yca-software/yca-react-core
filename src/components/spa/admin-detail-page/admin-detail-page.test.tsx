import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AdminDetailPage, type AdminDetailPageProps } from '.';

const baseProps = {
  backHref: '/admin/users',
  backLabel: 'Back to users',
  notFoundMessage: 'User not found',
  forbiddenMessage: 'You do not have access',
  loadErrorMessage: 'Failed to load user',
};

function renderPage(props: AdminDetailPageProps) {
  return render(
    <MemoryRouter>
      <AdminDetailPage {...props} />
    </MemoryRouter>,
  );
}

describe('AdminDetailPage', () => {
  it('shows route loader while loading', () => {
    renderPage({ ...baseProps, isLoading: true, children: null });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders children with back link when loaded', () => {
    renderPage({
      ...baseProps,
      isLoading: false,
      children: <p>User profile</p>,
    });

    expect(screen.getByText('User profile')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to users' })).toHaveAttribute(
      'href',
      '/admin/users',
    );
  });

  it('shows not-found message', () => {
    renderPage({
      ...baseProps,
      isLoading: false,
      errorKind: 'notFound',
      children: null,
    });

    expect(screen.getByText('User not found')).toBeInTheDocument();
  });

  it('shows forbidden message', () => {
    renderPage({
      ...baseProps,
      isLoading: false,
      errorKind: 'forbidden',
      children: null,
    });

    expect(screen.getByText('You do not have access')).toBeInTheDocument();
  });

  it('uses formatError for load errors', () => {
    renderPage({
      ...baseProps,
      isLoading: false,
      errorKind: 'load',
      error: new Error('network'),
      formatError: () => 'Custom load error',
      children: null,
    });

    expect(screen.getByText('Custom load error')).toBeInTheDocument();
  });
});
