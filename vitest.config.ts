import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import { resolve } from 'path';
const r = (p: string) => resolve(__dirname, p);

export const alias: Record<string, string> = {
  '~': r('.'),
  '~/': r('./'),
  '~~': r('.'),
  '~~/': r('./'),
  '@@': r('.'),
  '@': r('.'),
  '@/': r('./'),
  '@@/': r('./'),
  '#testSupport': r('./tests/unit/support'),
  assets: r('./assets'),
  public: r('./public')
};

export default defineConfig({
  resolve: {
    alias
  },
  plugins: [
    Vue(),
    AutoImport({ imports: ['vue'], dts: false }), // Auto imports vue composable functions (ref, reactive, etc)
    Components({ dirs: 'components', dts: false }) // Simulates Nuxt's auto component importing
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/unit/support/setup.ts']
  }
});
