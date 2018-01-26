/**
 * @file Webpack dev config for pattern libraries
 * 
 */

var utils = require('../utils/utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path');
var baseWebpackConfig = require('./webpack.patternlibrary.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const LifecyclePlugin = require('../plugins/webpack-lifecycle-plugin');
const dvmConfig = require('../utils/load-config').dvmConfig();

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [path.resolve(__dirname, '../../dvm-build/patternlibrary-hr-client')].concat(baseWebpackConfig.entry[name])
})

const devConfig = {

  entry: {
    'ospClient': path.resolve(__dirname, '../onsitepreview/client.js')
  },

  module: {
    //rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [

   

    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),
    
    new LifecyclePlugin({
        "done": (compilation, options, pluginOptions) =>
        {

            console.log('create version file etc')
            require("../utils/create-version-file").createFile();
        }
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'showcase-render-iframe.html',
      template: path.resolve(__dirname, '../../dvm-app/static/showcase-render-iframe.html'),
      inject: true,
      excludeChunks: ['ospClient']
    }),

    new FriendlyErrorsPlugin()
  ]
};

module.exports = merge(baseWebpackConfig, devConfig);
