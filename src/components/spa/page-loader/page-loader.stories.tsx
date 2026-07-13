import type { Meta, StoryObj } from '@storybook/react';
import { PageLoader } from '.';

const meta = {
  title: 'SPA/PageLoader',
  component: PageLoader,
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'Loading spinner with page, route, section, and inline variants.' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = { args: { variant: 'section', loadingLabel: 'Loading...' } };
export const Section: Story = { args: { variant: 'section', loadingLabel: 'Loading...' } };
export const Route: Story = { args: { variant: 'route', loadingLabel: 'Loading route...' } };
export const Page: Story = { args: { variant: 'page', loadingLabel: 'Loading app...' } };
export const Inline: Story = { args: { variant: 'inline', loadingLabel: 'Loading...' } };
