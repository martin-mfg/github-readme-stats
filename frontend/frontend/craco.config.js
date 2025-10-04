import webpack from 'webpack';

export default {
  webpack: {
    configure: (webpackConfig) => {
      /*
      // Add fallback for Node.js core modules
      webpackConfig.resolve = {
        ...(webpackConfig.resolve || {}),
        fallback: {
          ...(webpackConfig.resolve?.fallback || {}),
          querystring: require.resolve('querystring-es3'),
        },
      };
      */

      // Inject process.env so server code can access PAT_1
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            PAT_1: JSON.stringify('BrowserPAT'), // <-- your env var
          },
        }),
      );
      return webpackConfig;
    },
  },
};
