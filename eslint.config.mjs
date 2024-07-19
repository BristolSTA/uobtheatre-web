import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';
import parser from 'vue-eslint-parser';
import pluginVue from 'eslint-plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['./graphql/codegen/*', './tests/unit/test.spec.example.js']
  },
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      'unused-imports': unusedImports
    },

    languageOptions: {
      parser: parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },

    rules: {
      'unused-imports/no-unused-imports': 'error',
      'vue/multi-word-component-names': 0
    },

    files: ['**/*.ts', '**/*.js', '**/*.vue']
  },
  eslintConfigPrettier
];
