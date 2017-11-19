/**
 * @file Webpack base config for pattern libraries
 * 
 */

const path = require('path')
const utils = require('./utils')
const config = require('../env')
const glob = require("glob")
const webpack = require('webpack');
const PostCompile = require('post-compile-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const dvmConfig = require('./dvm-scripts/load-config')();

module.exports = {
    name: "patternlibrary",
    
    entry: dvmConfig.compilation.targets,
    
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
      new PostCompile((stats) => {
        //console.log("Assets: ", stats.compilation.records.chunks.byName)
      })
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
        { // Load .ts/.tsx files thought ts-loader
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
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