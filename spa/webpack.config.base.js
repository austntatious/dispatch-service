/*
The following are useful resources on setting up a build with Webpack:
  http://krasimirtsonev.com/blog/article/a-modern-react-starter-pack-based-on-webpack
  https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
  http://www.jayway.com/2014/03/28/running-scripts-with-npm/
  http://webpack.github.io/docs/configuration.html
*/

var path = require('path')
var webpack = require('webpack');

var webpackConfigBase = {
  cache: true,
  entry: {
    app: './src/app/app.js',
    vendor: './src/vendor/vendor.js'
  },
  
  // noInfo: true,

  hot:false,

  //devtool: 'defined in extended config files'

  //production: 'defined in extended config files'

  output:{
    path: path.join(__dirname, './../client/assets/javascripts/spa/')//,
    //filename: 'defined in extended config files'
    // hot:false
  },
  resolve: {
    extensions: [
      "",
      ".js",
      '.styl',
      '.css',
      '.html'
    ],
    modulesDirectories: [
      "src/app",
      'node_modules',
      'bower_components'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/, 
        include: [path.resolve(__dirname, "./src")], 
        loader: ["babel-loader"],
        query: {
          presets: ['es2015', 'react']
        }
      },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
    ]
  }
};

module.exports = webpackConfigBase;
