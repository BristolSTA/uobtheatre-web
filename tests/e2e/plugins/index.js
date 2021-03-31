/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')
// const cypressNuxt = require('cypress-nuxt')
// const preprocessor = require('@cypress/vue/dist/plugins/webpack')
// const webpackConfig = require('@vue/cli-service/webpack.config')
// webpackConfig.optimization = {}

module.exports = (on, config) => {
  // on(
  //   'file:preprocessor',
  //   webpack({
  //     webpackOptions: webpackConfig,
  //     watchOptions: {},
  //   })
  // )
  // on('file:preprocessor', await cypressNuxt.plugin())
  // preprocessor(on, config)

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js',
  })
}
