import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryState } from '.';

describe('QueryState', () => {
  it('shows loading state', () => {
    render(
      <QueryState isLoading loadingLabel="Loading data...">
        <div>Content</div>
      </QueryState>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('shows formatted error message', () => {
    render(
      <QueryState
        isLoading={false}
        isError
        error={new Error('boom')}
        formatError={() => 'Could not load'}
      >
        <div>Content</div>
      </QueryState>,
    );

    expect(screen.getByText('Could not load')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <QueryState
        isLoading={false}
        isError
        error={new Error('boom')}
        onRetry={onRetry}
        retryLabel="Retry"
      >
        <div>Content</div>
      </QueryState>,
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders children on success', () => {
    render(
      <QueryState isLoading={false}>
        <p>Loaded content</p>
      </QueryState>,
    );

    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });
});
