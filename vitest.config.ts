import { defineConfig } from 'vitest/config';
// import NuxtVitest from 'vite-plugin-nuxt-test';
import Vue from '@vitejs/plugin-vue';

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
  assets: r('./assets'),
  public: r('./public'),
  'public/': r('./public/'),
  // '#components': r('./.nuxt/components'),
  '#imports': r('./.nuxt/imports'),
  '#build': r('./.nuxt'),
  '#build/': r('./.nuxt/')
};

export default defineConfig({
  resolve: {
    alias
  },
  // plugins: [NuxtVitest()],
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['@nuxt/test-utils-edge']
    },
    setupFiles: ['tests/unit/setup.ts']
  }
});
