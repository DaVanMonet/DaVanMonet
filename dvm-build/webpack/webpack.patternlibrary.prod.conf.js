/**
 * @file Webpack prod config for pattern libraries
 * 
 */

var path = require('path')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.patternlibrary.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const LifecyclePlugin = require('../plugins/webpack-lifecycle-plugin');

const dvmConfig = require('../utils/load-config').dvmConfig();

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const prodConfig = {
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
                
                // Copy content index to web root
                require('../utils/copyutils').copyContentIndex();

                // If configured, move specified assets to external folder
                require('../utils/copyutils').copyAssets();

                // Copy additional resources into the package folder (such as the compiled css)
                require('../utils/copyutils').copyAdditionalPackageResources();
            }
        }),

        new LifecyclePlugin({
            "done": (compilation, options, pluginOptions) =>
            {
                if (undefined === compilation.compilation.records.chunks)
                {
                    return;
                }
                else
                {
                    // Generate targetindex.json
                    let chunks = compilation.compilation.records.chunks.byName;
                    require('../utils/create-target-index.js')(chunks);
                }

                require("../utils/create-version-file")();
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

    ]

};

module.exports = merge(baseWebpackConfig, prodConfig);

