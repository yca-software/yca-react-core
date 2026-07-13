import type { Preview } from '@storybook/react-vite';
import type React from 'react';
import { TooltipProvider } from '../src/components/ui/tooltip';
import '../src/storybook.css';

const withTooltipProvider = (Story: React.ComponentType) => (
  <TooltipProvider>
    <Story />
  </TooltipProvider>
);

const withThemeClass = (Story: React.ComponentType, context: { globals: { theme?: string } }) => (
  <div className={context.globals.theme === 'dark' ? 'dark' : ''}>
    <div className="min-h-[120px] bg-background text-foreground p-4">
      <Story />
    </div>
  </div>
);

const preview: Preview = {
  decorators: [withThemeClass, withTooltipProvider],
  globalTypes: {
    theme: {
      description: 'Color scheme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    options: {
      storySort: {
        order: ['Foundation', 'UI', ['*']],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
