import webpack from 'webpack';
import NodePolyfillPlugin  from 'node-polyfill-webpack-plugin';

export default {
  webpack: {
    configure: (webpackConfig) => {
      console.log('initial config:', JSON.stringify(webpackConfig, null, 2));

      webpackConfig.plugins.push(new NodePolyfillPlugin());

      /*
      // Add fallback for Node.js core modules
      webpackConfig.resolve = {
        ...(webpackConfig.resolve || {}),
        fallback: {
          ...(webpackConfig.resolve?.fallback || {}),
          querystring: require.resolve('querystring-es3'),
          url: require.resolve('url/'),
          path: require.resolve('path-browserify'),
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

      console.log('final config:', JSON.stringify(webpackConfig, null, 2));
      return webpackConfig;
    },
  },
};
