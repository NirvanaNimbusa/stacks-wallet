/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import ExtendedDefinePlugin from 'extended-define-webpack-plugin';

import { dependencies as externals } from '../app/package.json';

// eslint-disable-next-line import/no-default-export
export default {
  target: 'web',

  module: {
    noParse: [/\.wasm$/],
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      // Rule added to support `argon2-browser` library
      {
        test: /\.wasm$/,
        // Tells WebPack that this module should be included as
        // base64-encoded binary file and not as code
        loaders: ['base64-loader'],
        // Disables WebPack's opinion where WebAssembly should be,
        // makes it think that it's not WebAssembly
        //
        // Error: WebAssembly module is included in initial chunk.
        type: 'javascript/auto',
      },
    ],
  },

  node: {
    __dirname: false,
    fs: 'empty',
    Buffer: false,
    process: false,
    child_process: 'empty',
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    // libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '..', 'app'), 'node_modules'],
    plugins: [new TsconfigPathsPlugin()],
  },

  optimization: {
    namedModules: true,
  },

  plugins: [
    new ExtendedDefinePlugin({
      CONFIG: {
        NODE_ENV: process.env.NODE_ENV,
        PLAIN_HMR: process.env.PLAIN_HMR,
        STX_NETWORK: process.env.STX_NETWORK,
        DEBUG_PROD: process.env.DEBUG_PROD,
        START_HOT: process.env.START_HOT,
        PORT: process.env.PORT,
        PULL_REQUEST: process.env.PULL_REQUEST,
        BRANCH_NAME: process.env.BRANCH_NAME,
        SHA: process.env.SHA,
        PULL_REQUEST: process.env.PULL_REQUEST,
      },
    }),

    new webpack.EnvironmentPlugin({
      STX_NETWORK: process.env.STX_NETWORK,
    }),
  ],
};
