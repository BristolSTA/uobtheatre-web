import { defineConfig } from 'vitest/config';

import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
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
  assets: r('./assets'),
  public: r('./public'),
  'public/': r('./public/')
};

export default defineConfig({
  resolve: {
    alias
  },
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
