/**
 * @file Webpack dev config for pattern libraries
 * 
 */

var utils = require('../utils/utils')
var webpack = require('webpack')
var config = require('../env')
var merge = require('webpack-merge')
var path = require('path');
var baseWebpackConfig = require('./webpack.patternlibrary.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [path.resolve(__dirname, '../../dvm-build/patternlibrary-hr-client')].concat(baseWebpackConfig.entry[name])
})

const devConfig = {
  module: {
    //rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'showcase-render-iframe.html',
      template: path.resolve(__dirname, '../../dvm-app/static/showcase-render-iframe.html'),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
};

module.exports = merge(baseWebpackConfig, devConfig);
