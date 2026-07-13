import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { ConfirmDialog } from '.';

const meta = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware ConfirmDialog primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete item
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete item?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};
