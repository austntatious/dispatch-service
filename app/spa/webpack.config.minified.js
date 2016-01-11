var path = require('path')
var webpack = require('webpack');
var _ = require('lodash')

var webpackConfigBase = require(path.join(__dirname, 'webpack.config.base.js'))

var webpackConfigMinified = _.defaultsDeep({
    production: true,
    output: {
      filename: '[name].js'
    }
  }, webpackConfigBase);

webpackConfigMinified.plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    }
  })
];

module.exports = webpackConfigMinified;
