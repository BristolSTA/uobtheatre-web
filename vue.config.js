module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  pluginOptions: {
    apollo: {
      lintGQL: true,
    },
  },
};
