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

const { additionalRules,  additionalPlugins } = require('../utils/cssfile-rulegenerator')();

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
          // Save css files to configuration directory
          let cssDestinations = [dvmConfig.directories.dist_package + "/dist"];
          if (dvmConfig.compilation.emitCssCopies === true)
          {
            cssDestinations.push(dvmConfig.directories.cssCopies)
          }
          require('../utils/emit-css-copies.js')(compilation.assets, cssDestinations);

        },
      }),

      ...additionalPlugins

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

        ...additionalRules

      ]
    }
  }
