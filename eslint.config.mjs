import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress';
import withNuxt from './.nuxt/eslint.config.mjs';

import noUnmaskedSensitiveText from './eslint/rules/no-unmasked-sensitive-text.mjs';

export default withNuxt([
  // @nuxt/eslint lays out base rules, but we want to add a few more and override some of them. This is the recommended way to do that.
  {
    plugins: {
      unusedImports: unusedImports,
      local: {
        rules: {
          'no-unmasked-sensitive-text': noUnmaskedSensitiveText
        }
      }
    },
    rules: {
      'local/no-unmasked-sensitive-text': 'error'
    },
    files: ['**/*.ts', '**/*.js', '**/*.vue']
  },
  {
    name: 'cypress',
    plugins: {
      cypress: pluginCypress
    },
    files: ['tests/e2e/**/*.js'],
    extends: [pluginCypress.configs.recommended],
    rules: {
      'cypress/no-unnecessary-waiting': 'off'
    }
  },
  eslintConfigPrettier
])
  .overrideRules({
    'vue/multi-word-component-names': 0
  })
  .override('nuxt/import/rules', {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'unused-imports/no-unused-imports': 'error'
    }
  });
