import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { FormDrawer } from '.';

const meta = {
  title: 'UI/FormDrawer',
  component: FormDrawer,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware FormDrawer primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormDrawer>;

export default meta;
type Story = StoryObj<typeof FormDrawer>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Edit profile"
          description="Update details"
        >
          <p className="text-sm text-muted-foreground">Form fields go here.</p>
        </FormDrawer>
      </>
    );
  },
};
