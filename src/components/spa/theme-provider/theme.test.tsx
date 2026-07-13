import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeToggle } from '../theme-toggle';
import { ThemeProvider } from './index';

describe('ThemeProvider + ThemeToggle', () => {
  it('applies light class to document root by default', () => {
    render(
      <ThemeProvider>
        <span>App</span>
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('toggles document root class when ThemeToggle is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle ariaLabel="Toggle theme" />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
