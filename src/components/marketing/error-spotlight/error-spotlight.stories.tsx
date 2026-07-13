import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorSpotlight } from '.';

const meta: Meta<typeof ErrorSpotlight> = {
  title: 'Marketing/ErrorSpotlight',
  component: ErrorSpotlight,
  parameters: {
    docs: {
      description: {
        component: 'Full-viewport error state: ASCII symbol field that “lights up” along a beam',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ErrorSpotlight>;

export const Default: Story = {};

export const BrandedCenter: Story = {
  args: {
    title: 'Page not found',
    description: 'The page you are trying to access does not exist or was moved.',
    centerContent: <span className="text-sm font-semibold tracking-wide text-white">YCA</span>,
    symbolPalette: '@%#*+=-:. ',
    cellSize: 10,
  },
};
