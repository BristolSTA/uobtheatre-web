module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ["tests/unit/test.spec.example.js"],
  // parserOptions: {
  //   ecmaVersion: 12,
  //   parser: "@babel/eslint-parser",
  //   requireConfigFile: false,
  //   sourceType: "module",
  // },
  plugins: ["prettier", "@typescript-eslint"],
  // plugins: ["vue", "@typescript-eslint"],
  extends: [
    "@nuxtjs",
    "@nuxtjs/eslint-config-typescript",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  rules: {
    "import/no-named-as-default": "off",
  },
  overrides: [
    {
      files: ["*.test.js", "*.spec.js"],
      rules: {
        "no-unused-expressions": "off",
      },
    },
  ],
};
