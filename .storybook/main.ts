import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../legacy/components/button/Button.stories.tsx',
    '../legacy/components/input-text/InputText.stories.tsx',
    '../legacy/components/spin/Spin.stories.tsx'
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    return {
      ...config,
      server: {
        ...config.server,
        fs: {
          ...config.server?.fs,
          allow: [
            ...(config.server?.fs?.allow ?? []),
            path.resolve(__dirname, '..'),
            path.resolve(__dirname, '../node_modules')
          ]
        }
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: config.optimizeDeps?.include?.filter((dependency) => dependency !== 'react-dom/client')
      },
      legacy: {
        ...config.legacy,
        inconsistentCjsInterop: true
      }
    };
  }
};

export default config;
