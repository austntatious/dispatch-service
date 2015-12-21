// http://stackoverflow.com/questions/26203725/how-to-allow-for-webpack-dev-server-to-allow-entry-points-from-react-router
var path = require('path')
var webpack = require('webpack');
var _ = require('lodash')

var webpackConfigBase = require(path.join(__dirname, 'webpack.config.base.js'))

var webpackConfigOriginal = _.defaultsDeep({
    output: {
      filename: '[name].original.js'
    },
    devtool: 'eval'
  }, webpackConfigBase);

webpackConfigOriginal.plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  })
];

module.exports = webpackConfigOriginal;
