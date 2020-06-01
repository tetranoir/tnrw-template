'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const env = require('dotenv').config().parsed;

// Gets pathTo from project root
const pathTo = require(path.resolve(fs.realpathSync(process.cwd()), 'pathTo'));

module.exports = function(webpackMode) {
  const isEnvDevelopment = webpackMode === 'development';
  const isEnvProduction = webpackMode === 'production';

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
      // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction ?
       'source-map'
      : isEnvDevelopment && 'cheap-module-source-map',
    devServer: {
      contentBase: pathTo.output,
      publicPath: '/',
      clientLogLevel: 'none',
      compress: true,
      hot: true,
      watchContentBase: true,
      // quiet: true,
      overlay: false,
      port: env.CLIENT_PORT,
    },
    entry: [
      // isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
      pathTo.client,
    ].filter(Boolean),
    output: {
      filename: '[name].bundle.js',
      path: pathTo.output,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // First, run the linter.
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          // include: resolve(''),
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),

              },
              loader: require.resolve('eslint-loader'),
            },
          ],
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              // include: resolve(''),
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction,
              },
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                cacheCompression: isEnvProduction,

                // If an error happens in a package, it's possible to be
                // because it was compiled. Thus, we don't want the browser
                // debugger to show the original code. Instead, the code
                // being evaluated would be much more helpful.
                sourceMaps: false,
              },
            },
          ]
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
        title: isEnvProduction ?
          env.PROJECT_NAME :
          isEnvDevelopment ?
            `${env.PROJECT_NAME} - Dev` :
            `${env.PROJECT_NAME} - No Env`,
        template: require('html-webpack-template'),
        appMountId: 'root',
      }),
      // new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new ModuleNotFoundPlugin(pathTo.root),
      // new webpack.DefinePlugin({'process.env': }),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      isEnvDevelopment && new WatchMissingNodeModulesPlugin(pathTo.nodeModules),
    ].filter(Boolean),
  };
};
