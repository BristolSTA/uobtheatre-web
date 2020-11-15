module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFilesAfterEnv: ['<rootDir>tests/unit/setup.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/tests/',
    'src/main.js',
    'src/registerServiceWorker.js',
    'src/extensions.js',
    'src/server.js',
  ],
  collectCoverageFrom: ['src/**/*.{js,vue}'],
};
