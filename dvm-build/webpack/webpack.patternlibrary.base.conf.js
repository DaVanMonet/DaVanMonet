/**
 * @file Webpack base config for pattern libraries
 * 
 */

const path = require('path')
const utils = require('../utils/utils')
const config = require('../env')
const glob = require("glob")
const webpack = require('webpack');
const PostCompile = require('post-compile-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs = require('fs-extra')

const LifecyclePlugin = require('../plugins/lifecycle-plugin');

const dvmConfig = require('../utils/load-config')();

// Include paths for SCSS
var scssIncPaths = [];
if (dvmConfig.compilation.compilers.scss.includePaths !== undefined)
  scssIncPaths = dvmConfig.compilation.compilers.scss.includePaths;

module.exports = {
    name: "patternlibrary",
    
    entry: dvmConfig.compilation.entry,
    
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    
    resolve: {
      extensions: ['.ts', '.js'],
      // alias: {
      //   '@': path.resolve(__dirname, '../../preview'),
      // }
    },

    plugins: [

      // Generate targetindex.json
      // TODO: Move to LifeCyclePlugin
      new PostCompile(stats => {
        if (undefined === stats.compilation.records.chunks)
          return;
        
        let chunks = stats.compilation.records.chunks.byName;
        let targetIndex = { items: [] };
        Object.keys(chunks).forEach(target => targetIndex.items.push(target));
        
        // Save index to file
        fs.writeJsonSync(
          path.resolve(process.cwd(), dvmConfig.directories.dist_web + '/targetindex.json'), targetIndex);
      }),

      new LifecyclePlugin({
        "done": (compilation, options, pluginOptions) =>
        {
          // If configured, move specified assets to external folder
          require('../utils/copyutils').copyAssets();
        },
        "emit": (compilation, options, pluginOptions) =>
        {
          if (dvmConfig.compilation.emitCssCopies === true)
            require('../utils/emit-css-copies.js')(compilation.assets, dvmConfig.directories.cssCopies);
        },
      }),

      // Output some css
      new ExtractTextPlugin({
        filename: utils.relativeAssetsPath('css/[name]')
      }),

    ],
    
    module: {
      rules: [

        { // Load .js/.jsx files though babel-loader
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets:[ 'stage-2' ]
          }
        },

        {
          test: /\.less$/,
          use: ['css-hot-loader?fileMap=css/{fileName}'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: "css-loader" // 2. translates CSS into CommonJS
            }, {
              loader: "less-loader" // 1. compiles Less to CSS
            }]
          })),
        },

        {
          test: /\.scss$/,
          use: ['css-hot-loader?fileMap=css/{fileName}'].concat(ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [{
              loader: "css-loader" // translates CSS into CommonJS
            }, {
              loader: "sass-loader", // compiles Sass to CSS
              options: {
                includePaths: scssIncPaths.map(
                  incPath => path.resolve(process.cwd(), incPath)
                )
              }
            }]
          }))
        }

      ]
    }
  }
