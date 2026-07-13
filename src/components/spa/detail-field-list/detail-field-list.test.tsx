import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DetailFieldList } from '.';

describe('DetailFieldList', () => {
  it('renders label/value pairs', () => {
    render(
      <DetailFieldList
        fields={[
          { label: 'Email', value: 'user@example.com' },
          { label: 'Role', value: 'Admin' },
        ]}
      />,
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('applies bordered variant classes', () => {
    const { container } = render(
      <DetailFieldList fieldVariant="bordered" fields={[{ label: 'Status', value: 'Active' }]} />,
    );

    expect(container.querySelector('.rounded-lg.border')).toBeTruthy();
  });
});
