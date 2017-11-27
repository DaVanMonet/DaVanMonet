/**
 * @file Webpack prod config for pattern libraries
 * 
 */

var path = require('path')
var merge = require('webpack-merge')
var config = require('../env')
var baseWebpackConfig = require('./webpack.patternlibrary.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const LifecyclePlugin = require('../plugins/lifecycle-plugin');

const dvmConfig = require('../utils/load-config')();

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = merge(baseWebpackConfig, {

    plugins: [
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
            safe: true
            }
        }),
        new LifecyclePlugin({
            "done": (compilation, options, pluginOptions) =>
            {
              // If configured, move specified assets to external folder
              require('../utils/copyutils').copySrc();
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'showcase-render-iframe.html',
            template: path.resolve(__dirname, '../../dvm-app/static/showcase-render-iframe.html'),
            inject: true,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
              // more options:
              // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
          }),

        // copy pattern library to web root
        new CopyWebpackPlugin([
            {
                from: path.resolve(process.cwd(), dvmConfig.directories.src),
                to: config.build.assetsRoot + '/' + dvmConfig.directories.src,
                ignore: ['.*']
            }
        ])
    ]

});