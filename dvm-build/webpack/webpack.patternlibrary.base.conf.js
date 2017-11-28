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

const LifecyclePlugin = require('../plugins/webpack-lifecycle-plugin');

const dvmConfig = require('../utils/load-config').dvmConfig();

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
      extensions: ['.ts', '.js', '.json', '.yml'],
      // alias: {
      //   '@': path.resolve(__dirname, '../../preview'),
      // }
    },

    plugins: [

      new webpack.DefinePlugin({
        __MAIN_CONFIG_PATH__: JSON.stringify(path.resolve(process.cwd(), process.env.npm_package_config_configFile)), // This is set in package.json
        __USER_CONFIG_PATH__: JSON.stringify(dvmConfig.userconfig_abs),
        __CONTENT_INDEX_PATH__: JSON.stringify(dvmConfig.directories.indexes_abs + '/' + dvmConfig.indexing.contentindexoutput)
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

        {
          test: /\.yml$/,
          loader: 'yml-loader'
        },

        ...additionalRules

      ]
    }
  }
