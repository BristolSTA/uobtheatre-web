module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['tests/test.spec.example.js'],
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:vue-a11y/base',
    'plugin:jsdoc/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  plugins: ['prettier', 'vue-a11y', 'simple-import-sort', 'graphql'],
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
      },
    },
  },
};
