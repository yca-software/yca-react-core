import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme-provider';
import { ThemeToggle } from '.';

const meta = {
  title: 'SPA/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'Sun/moon toggle wired to ThemeProvider or an external store.' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = { args: { ariaLabel: 'Toggle theme' } };
