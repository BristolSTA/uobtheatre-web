module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:vue-a11y/base',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'import/order': 2,
    'spellcheck/spell-checker': [
      'warn',
      {
        skipWords: [
          'csrftoken',
          'vue',
          'jill',
          'bloggs',
          'theatre',
          'pegg',
          'dramsoc',
        ],
        identifiers: false,
        lang: 'en_GB',
        minLength: 5,
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  plugins: ['prettier', 'vue-a11y', 'import', 'spellcheck'],
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
};
