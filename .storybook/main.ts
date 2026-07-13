import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-a11y'), getAbsolutePath('@storybook/addon-docs')],
  framework: getAbsolutePath('@storybook/react-vite'),
  features: {
    // Avoid sidebar checklist + accidental "Review new stories" filter hiding components.
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
    changeDetection: false,
  },
  async viteFinal(config) {
    const plugins = config.plugins ?? [];
    const hasTailwind = plugins.some(
      (p) =>
        typeof p === 'object' &&
        p !== null &&
        'name' in p &&
        (p as { name: string }).name === '@tailwindcss/vite',
    );
    if (!hasTailwind) {
      plugins.push(tailwindcss());
    }
    config.plugins = plugins;
    return config;
  },
};
export default config;
