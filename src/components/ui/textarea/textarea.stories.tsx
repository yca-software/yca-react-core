import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '.';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware Textarea primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Write a note…', className: 'w-80' },
};
