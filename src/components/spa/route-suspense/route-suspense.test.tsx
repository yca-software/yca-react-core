import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteSuspense } from '.';

describe('RouteSuspense', () => {
  it('renders children when not suspended', () => {
    render(
      <RouteSuspense>
        <p>Route content</p>
      </RouteSuspense>,
    );

    expect(screen.getByText('Route content')).toBeInTheDocument();
  });
});
