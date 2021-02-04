module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['tests/unit/test.spec.example.js'],
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
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: true,
        },
      },
    ],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: [
          'h2',
          'h3',
          'h1',
          'a',
          'span',
          'strong',
          'p',
          'clickable-link',
          'template',
        ],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'any',
        },
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'TWO_WAY_BINDING',
          'SLOT',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'OTHER_ATTR',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: false,
      },
    ],
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
