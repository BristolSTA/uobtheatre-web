module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  // parserOptions: {
  //   parser: '@typescript-eslint/parser'
  // },
  plugins: ['unused-imports'],
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  rules: {
    'unused-imports/no-unused-imports': 'error'
  }
};
