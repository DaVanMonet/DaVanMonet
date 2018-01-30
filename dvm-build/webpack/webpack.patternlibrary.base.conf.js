/**
 * @file Webpack base config for pattern libraries
 * 
 */

const path = require('path')
const utils = require('../utils/utils')
const glob = require("glob")
const webpack = require('webpack');
const fs = require('fs-extra')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const vueLoaderConfig = require('./vue-loader.conf')

const LifecyclePlugin = require('../plugins/webpack-lifecycle-plugin');
const ContentIndexResolver = require('../plugins/content-index-resolver');

const dvmConfig = require('../utils/load-config').dvmConfig();

const { additionalRules,  additionalPlugins } = require('../utils/cssfile-rulegenerator')();

module.exports = {
    name: "patternlibrary",
    
    entry: {
      ...dvmConfig.compilation.entry,
      'preview-frame.js': path.resolve(__dirname, '../../dvm-app/src/preview-frame.js')
    },
    
    output: {
      path: dvmConfig.directories.dist_web_abs(),
      filename: '[name].js',
      publicPath: '/'
    },
    
    resolve: {
      extensions: ['.ts', '.js', '.json', '.yml'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        [dvmConfig.directories.configs]: dvmConfig.directories.configs_abs(),
        [dvmConfig.directories.indexes]: dvmConfig.directories.indexes_abs()
      },
      plugins: [ContentIndexResolver]
    },

    plugins: [

      new webpack.DefinePlugin({
        __MAIN_CONFIG_PATH__: JSON.stringify(path.resolve(process.cwd(), process.env.npm_package_config_configFile)), // This is set in package.json //process.env.npm_package_config_configFile
        __USER_CONFIG_PATH__: JSON.stringify(dvmConfig.userconfig_abs()),
        __CONTENT_INDEX_PATH__: JSON.stringify(dvmConfig.directories.indexes_abs() + '/' + dvmConfig.indexing.contentIndexOutput),
        __PACKAGE_JSON__: JSON.stringify(process.cwd() + "/package.json")
      }),

      // Emit CSS copies via LifeCycle plugin
      new LifecyclePlugin({"emit": (compilation, options, pluginOptions) =>
      {
        console.log('######## __dirname', __dirname)
        // Save css files to configuration directory
        let cssDestinations = [];
        if (dvmConfig.compilation.emitCssCopies === true)
        {
          cssDestinations.push(dvmConfig.directories.cssCopies)
        }
        require('../utils/emit-css-copies.js')(compilation.assets, cssDestinations);
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

        {
          test: /\.yml$/,
          loader: 'yml-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        ...additionalRules

      ]
    }
  }
