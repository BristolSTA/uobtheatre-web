module.exports = {
  root: true,
  env: {
    browser: true
  },
  ignorePatterns: ['tests/unit/test.spec.example.js'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    sourceType: 'module'
  },
  plugins: ['vue'],
  extends: [
    'plugin:vue/essential',
    '@nuxtjs',
    'prettier',
    '@nuxtjs/eslint-config-typescript'
  ],
  rules: {
    'import/no-named-as-default': 'off'
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
}
