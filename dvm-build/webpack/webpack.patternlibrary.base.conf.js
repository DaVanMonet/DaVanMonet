/**
 * @file Webpack base config for pattern libraries
 * 
 */

const path = require('path')
const utils = require('../utils/utils')
const config = require('../env')
const glob = require("glob")
const webpack = require('webpack');

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

      new LifecyclePlugin({"done": (compilation, options, pluginOptions) =>
        {
          // Generate targetindex.json
          if (undefined === compilation.compilation.records.chunks)
          return;
          
          let chunks = compilation.compilation.records.chunks.byName;
          require('../utils/create-target-index.js')(chunks);
        }}),
      
        new LifecyclePlugin({"done": (compilation, options, pluginOptions) =>
        {
          // If configured, move specified assets to external folder
          require('../utils/copyutils').copyAssets();
        }}),

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
