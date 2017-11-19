/**
 * @file Webpack base config for pattern libraries
 * 
 */

var path = require('path')
var utils = require('./utils')
var config = require('../env')
var glob = require("glob")
var webpack = require('webpack');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    name: "patternlibrary",
    entry: {
      "main.css": glob.sync("./src/**/!(*_print|*_inline).less"),
      "inline.css": glob.sync("./src/**/*_inline.less"),
      "print.css": glob.sync("./src/**/*_print.less")
    },
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, '../../preview'),
      }
    },
    // plugins: [
    //   new webpack.DefinePlugin({
    //     __CONFIG_PATH__: process.env.npm_package_config_configFile
    //   })
    // ],
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
        { // Load .ts/.tsx files thought ts-loader
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            configFile: 'src/tsconfig.json'
          }
        },
        { // Less files will be chained though three diffent loaders:
          test: /\.less?$/,
          use: [{
              loader: "style-loader" // 3. creates style nodes from JS strings
            }, {
              loader: "css-loader" // 2. translates CSS into CommonJS
            }, {
              loader: "less-loader" // 1. compiles Less to CSS
            }]
        }
      ]
    }
  }