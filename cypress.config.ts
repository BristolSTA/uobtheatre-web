import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack'
    }
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    watchForFileChanges: false,
    supportFile: './tests/e2e/support/index.js',
    specPattern: './tests/e2e/specs/**/*.cy.js'
  }
});
