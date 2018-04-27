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
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeJsPlugin = require("optimize-js-plugin");
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
        new UglifyJsPlugin({
            uglifyOptions: {
                safari10: true
            }
        }),
        new OptimizeJsPlugin({
            sourceMap: false
        }),
        new LifecyclePlugin({
            "done": (compilation, options, pluginOptions) =>
            {

                console.log('create version file etc')
                require("../utils/create-version-file").createFile();
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

    ]

};

module.exports = merge(baseWebpackConfig, prodConfig);

