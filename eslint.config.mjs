import unusedImports from 'eslint-plugin-unused-imports';
import pluginCypress from 'eslint-plugin-cypress';
import vitest from '@vitest/eslint-plugin';
import withNuxt from './.nuxt/eslint.config.mjs';

import noUnmaskedSensitiveText from './eslint/rules/no-unmasked-sensitive-text.mjs';

export default withNuxt([
  {
    name: 'local global ignores',
    ignores: ['./tests/unit/test.spec.example.js', './.github/**']
  },
  // @nuxt/eslint lays out base rules, but we want to add a few more and override some of them. This is the recommended way to do that.
  {
    name: 'local',
    plugins: {
      local: {
        rules: {
          'no-unmasked-sensitive-text': noUnmaskedSensitiveText
        }
      }
    },
    rules: {
      'local/no-unmasked-sensitive-text': 'error'
    }
  },
  {
    name: 'cypress',
    files: ['tests/e2e/**/*.js'],
    plugins: {
      cypress: pluginCypress
    },
    rules: {
      ...pluginCypress.configs.recommended.rules
    }
  },
  {
    name: 'vitest',
    files: ['tests/unit/**/*.js', 'tests/unit/**/*.ts'],
    plugins: {
      vitest: vitest
    },
    rules: {
      ...vitest.configs.recommended.rules
    }
  }
])
  .override('nuxt/import/rules', {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'unused-imports/no-unused-imports': 'error'
    }
  })
  .overrideRules({
    'vue/multi-word-component-names': 0,
    '@typescript-eslint/unified-signatures': 0
  });
