import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import graphql from '@rollup/plugin-graphql';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import { resolve } from 'path';
const r = (p: string) => resolve(__dirname, p);

// Define a set of module aliases to file directories (Mirrors the .nuxt/tsconfig.json's compiler "paths")
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
  '#tailwind-config': r('./.nuxt/tailwind.config.cjs'),
  assets: r('./assets'),
  public: r('./public')
};

export default defineConfig({
  resolve: {
    alias
  },
  plugins: [
    graphql(), // GraphQL File Loading
    Vue(), // Vue SFC File support
    AutoImport({
      imports: ['vue'],
      dirs: ['composables', 'utils'],
      dts: false,
      vueTemplate: true
    }), // Auto imports vue composable functions (ref, reactive, etc)
    Components({ dirs: 'components', dts: false }) // Replicates Nuxt's auto component importing,
  ],
  test: {
    globals: true,
    environment: 'jsdom', // Register JSDOM to replicate browser APIs
    setupFiles: ['tests/unit/support/setup.ts'], // Register files to be run at the start of each test file
    restoreMocks: true
  }
});
