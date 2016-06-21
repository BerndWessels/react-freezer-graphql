/**
 * Manapaho (https://github.com/Manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Dependencies
 */
import path from 'path';
import webpack from 'webpack';
import yargs from 'yargs';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

/**
 * Environment type
 */
const {buildProduction, buildDevelopment, buildTest} = yargs
  .alias('p', 'build-production')
  .alias('d', 'build-development')
  .alias('t', 'build-test')
  .argv;

/**
 * Config
 * Reference: http://webpack.github.io/docs/configuration.html
 * This is the object where all configuration gets set
 */
let config = {
  target: 'node'
};

/**
 * Entry
 * Reference: http://webpack.github.io/docs/configuration.html#entry
 * Should be an empty object if it's generating a test build
 * Karma will set this when it's a test build
 */
if (buildTest) {
  config.entry = {}
} else {
  config.entry = {
    index: './index.js'
  }
}

/**
 * Output
 * Reference: http://webpack.github.io/docs/configuration.html#output
 * Should be an empty object if it's generating a test build
 * Karma will handle setting it up for you when it's a test build
 */
if (buildTest) {
  config.output = {};
} else {
  config.output = {
    // Absolute output directory
    path: path.join(__dirname, buildProduction ? 'dist' : 'build'),

    // Filename for entry points
    filename: buildProduction ? '[name].min.js' : '[name].js'
  };
}

/**
 * Devtool
 * Reference: http://webpack.github.io/docs/configuration.html#devtool
 * Type of sourcemap to use per build type
 */
if (buildTest) {
  config.devtool = 'inline-source-map';
} else if (buildProduction) {
  config.devtool = null;
} else {
  config.devtool = 'eval';
}

/**
 * Resolvers
 * Reference: http://webpack.github.io/docs/configuration.html#resolve
 */
config.resolve = {
  extensions: ['', '.js', '.json'],
  modulesDirectories: [
    'node_modules',
    path.resolve(__dirname, './node_modules')
  ]
};

/**
 * Loaders
 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
 * List: http://webpack.github.io/docs/list-of-loaders.html
 * This handles most of the magic responsible for converting modules
 */

// Initialize module
config.module = {
  preLoaders: [],
  loaders: [{
    // JS LOADER
    // Reference: https://github.com/babel/babel-loader
    // Transpile .js files using babel-loader
    // Compiles ES6 and ES7 into ES5 code
    test: /\.js$/,
    loader: 'babel',
    exclude: /(node_modules|bower_components)/
  }, {
    // JSON LOADER
    // Reference: https://github.com/webpack/json-loader
    // Allow loading JSON
    test: /\.json$/,
    loader: 'json'
  }
  ]
};

// ISPARTA LOADER
// Reference: https://github.com/ColCh/isparta-instrumenter-loader
// Instrument JS files with Isparta for subsequent code coverage reporting
// Skips node_modules and files that end with .test.js
if (buildTest) {
  config.module.preLoaders.push({
    test: /\.js$/,
    exclude: [
      /(node_modules|bower_components)/,
      /\.test\.js$/
    ],
    loader: 'isparta-instrumenter'
  })
}

/**
 * Plugins
 * Reference: http://webpack.github.io/docs/configuration.html#plugins
 * List: http://webpack.github.io/docs/list-of-plugins.html
 */
config.plugins = [];

// Add build specific plugins
if (buildProduction) {
  // Reference: https://github.com/jeffling/ng-annotate-webpack-plugin
  // Make Angular Injections minification safe
  config.plugins.push(
    // Reference: https://github.com/johnagan/clean-webpack-plugin
    // Clean the output folders before building
    new CleanWebpackPlugin(['dist', 'build'], __dirname),
    // Reference: https://github.com/kevlened/copy-webpack-plugin
    // Copy the public folder to the dist folder
    new CopyWebpackPlugin([
      {from: 'public'}
    ]),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoErrorsPlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // Dedupe modules in the output
    new webpack.optimize.DedupePlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    new webpack.optimize.UglifyJsPlugin()
  )
}

// Add dev specific plugins
if (!buildProduction && !buildTest) {
  config.plugins.push(
    // https://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
    new webpack.optimize.OccurenceOrderPlugin(),
    // Reference: https://github.com/gaearon/react-hot-loader/issues/127
    // https://webpack.github.io/docs/list-of-plugins.html#hotmodulereplacementplugin
    // new webpack.HotModuleReplacementPlugin(),
    // https://github.com/webpack/webpack/issues/701
    new webpack.OldWatchingPlugin(),
    // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    new webpack.optimize.DedupePlugin(),
    // https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    new webpack.NoErrorsPlugin()
  )
}

export default config;
