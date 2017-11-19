/**
 * @file Webpack base config for DaVanMonet
 * 
 */

var path = require('path')
var utils = require('./utils')
var envConfig = require('../env')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack');
var fs = require('fs');

var dvmConfig = require('./dvm-scripts/load-config')();
var ContentIndexResolver = require('./dvm-scripts/content-index-resolver');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  name: "davanmonet",
  entry: {
    app: ['./preview/src/main.js']
  },
  output: {
    path: envConfig.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? envConfig.build.assetsPublicPath
      : envConfig.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.yml'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../../preview'),
      [dvmConfig.directories.configs]: path.resolve(__dirname, '../'),
      [dvmConfig.directories.indexes]: path.resolve(__dirname, '../.' + dvmConfig.directories.indexes)
    },
    plugins: [ContentIndexResolver] // ContentIndexResolver will generate contentindex.json if it does not exist
  },
  plugins: [
    // Here we're using the DefinePlugin to create some constants
    // that can be accessed from the application code
    new webpack.DefinePlugin({
      __MAIN_CONFIG_PATH__: JSON.stringify(process.env.npm_package_config_configFile), // This is set in package.json
      __USER_CONFIG_PATH__: JSON.stringify(dvmConfig.userconfig),
      __CONTENT_INDEX_PATH__: JSON.stringify(dvmConfig.directories.indexes + '/' + dvmConfig.indexing.contentindexoutput)
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.yml$/,
        loader: 'yml-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:[ 'stage-2' ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
