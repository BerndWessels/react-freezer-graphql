import path from 'path';
import webpack from 'webpack';
import yargs from 'yargs';

const {optimizeMinimize} = yargs.alias('p', 'optimize-minimize').argv;
const nodeEnv = optimizeMinimize ? 'production' : 'development';

var config = {
  target: 'node',
  entry: {
    index: './index.js'
  },
  output: {
    path: path.join(__dirname, optimizeMinimize ? 'dist' : 'build'),
    filename: optimizeMinimize ? '[name].min.js' : '[name].js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
      {test: /\.json$/, loader: 'json'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify(nodeEnv)}
    })
  ],
  devtool: optimizeMinimize ? null : 'source-map'
};

if (optimizeMinimize) {
  config.plugins.push(...[
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]);
}

export default config;
