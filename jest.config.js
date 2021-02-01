module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFilesAfterEnv: ['<rootDir>tests/unit/setup.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/tests/',
    'src/main.js',
    'src/registerServiceWorker.js',
    'src/extensions.js',
    'src/Playground.example.vue',
    'src/Playground.vue',
    'src/playground.js',
    'src/fakeApi/*.*',
  ],
  collectCoverageFrom: ['src/**/*.{js,vue}'],
};
