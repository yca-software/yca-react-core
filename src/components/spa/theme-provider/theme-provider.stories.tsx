import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '.';

const meta = {
  title: 'SPA/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    docs: {
      description: {
        component: 'Applies light/dark class on document root; optional external theme store.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <p className="rounded-lg border p-4">Theme class applied to &lt;html&gt;</p>
    </ThemeProvider>
  ),
};
