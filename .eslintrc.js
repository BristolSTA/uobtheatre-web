module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['tests/unit/test.spec.example.js'],
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    '@nuxtjs',
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  rules: {
    'import/no-named-as-default': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
  },
  settings: {
    'import/resolved': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    }, {
      "files": ["*.graphql"],
      "parser": "@graphql-eslint/eslint-plugin",
      "plugins": ["@graphql-eslint"],
      "rules": {
        "@graphql-eslint/known-type-names": "error"
      }
    }
  ],
};
