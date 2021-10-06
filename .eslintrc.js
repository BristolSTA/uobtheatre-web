module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['tests/unit/test.spec.example.js'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  rules: {
    'import/no-named-as-default': 'off',
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
}
