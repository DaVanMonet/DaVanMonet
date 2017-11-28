/**
 * @file Webpack base config for DaVanMonet
 * 
 */

const path = require('path')
const utils = require('../utils/utils')
const envConfig = require('../env')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack');
const fs = require('fs');

const dvmConfig = require('../utils/load-config')();
const ContentIndexResolver = require('../plugins/content-index-resolver');

module.exports = {
  name: "davanmonet",
  
  entry: {
    app: [path.resolve(__dirname, '../../dvm-app/src/main.js')]
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
      '@': path.resolve(__dirname, '../../dvm-app'),
      [dvmConfig.directories.configs]: dvmConfig.directories.configs_abs,
      [dvmConfig.directories.indexes]: dvmConfig.directories.indexes_abs
    },
    plugins: [ContentIndexResolver] // ContentIndexResolver will generate contentindex.json if it does not exist
  },
  
  plugins: [
    // Here we're using the DefinePlugin to create some constants
    // that can be accessed from the application code
    
    new webpack.DefinePlugin({
      __MAIN_CONFIG_PATH__: JSON.stringify(path.resolve(process.cwd(), process.env.npm_package_config_configFile)), // This is set in package.json
      __USER_CONFIG_PATH__: JSON.stringify(dvmConfig.userconfig_abs),
      __CONTENT_INDEX_PATH__: JSON.stringify(dvmConfig.directories.indexes_abs + '/' + dvmConfig.indexing.contentindexoutput)
    }),

    function()
    {
        this.plugin("done", function(stats)
        {
            if (stats.compilation.errors && stats.compilation.errors.length)
            {
                console.log(stats.compilation.errors);
                process.exit(1);
            }
            // ...
        });
    }
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
        exclude: /.*node_modules((?!davanmonet).)*$/,
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
