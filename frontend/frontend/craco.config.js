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
        path: require.resolve('path-browserify'),
        querystring: require.resolve('querystring-es3'),
        url: require.resolve('url/'),
        http: require.resolve('stream-http'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        fs: false,
        net: false,
      };

      // Inject process.env so server code can access PAT_1
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            myDummyKey: JSON.stringify('myDummyPAT'), // <-- your env var
          },
        }),
      );
      return webpackConfig;
    },
  },
};
