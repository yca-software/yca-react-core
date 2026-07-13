import type { Meta, StoryObj } from '@storybook/react';
import { FormSubmitButton } from '.';

const meta = {
  title: 'UI/FormSubmitButton',
  component: FormSubmitButton,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware FormSubmitButton primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormSubmitButton>;

export default meta;
type Story = StoryObj<typeof FormSubmitButton>;

export const Default: Story = {
  args: { label: 'Save changes' },
};

export const Pending: Story = {
  args: { label: 'Save changes', isPending: true, pendingLabel: 'Saving…' },
};
