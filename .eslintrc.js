module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: ['unused-imports', 'prettier'],
  extends: [
    // '@nuxtjs/eslint-config-typescript',
    // 'plugin:prettier/recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'vue/multi-word-component-names': 0
  }
};
