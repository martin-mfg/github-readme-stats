const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      dotenv: path.resolve(__dirname, 'src/dotenv-browser-stub.js'),
    },

    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        pg: false,
      };

      // Turn { KEY: "value" } into { "process.env.KEY": JSON.stringify("value") }
      const env = {};
      const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
      }, {});
      webpackConfig.plugins.push(new webpack.DefinePlugin(envKeys));

      return webpackConfig;
    },
  },
};
