/**
 * @file Webpack prod config for DaVanMonet
 * 
 */

const path = require('path')
const utils = require('../utils/utils')
const webpack = require('webpack')
const buildSettings = require('../build-settings')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.dvm.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const LifecyclePlugin = require('../plugins/webpack-lifecycle-plugin');

const dvmConfig = require('../utils/load-config').dvmConfig();

var env = process.env.NODE_ENV === 'testing'
  ? require('../env/test.env')
  : buildSettings.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    //rules: utils.styleLoaders({
    //  sourceMap: config.build.productionSourceMap,
    //  extract: true
    //})
  },
  devtool: buildSettings.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: buildSettings.build.assetsRoot,
    filename: path.posix.join(dvmConfig.directories.js_subDir, '[name].[chunkhash].js'),
    chunkFilename: path.posix.join( dvmConfig.directories.css_subDir, '[id].[chunkhash].js')
  },
  plugins: [
    
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    
    // TODO: Figure out why UglifyJS doesn't work
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),

    // extract css into its own file
    new ExtractTextPlugin({
      filename: path.posix.join( dvmConfig.directories.css_subDir, '[name].[contenthash].css')
    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : buildSettings.build.index,
      template: path.resolve(__dirname, '../../dvm-app/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),

    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../dvm-app/static'),
        to: buildSettings.build.assetsSubDirectory,
        ignore: ['.*']
      },
      // {
      //   from: path.resolve(__dirname, '../../configs/web.config'),
      //   to: buildSettings.build.assetsRoot,
      //   ignore: ['.*']
      // }
    ]),
    new LifecyclePlugin({
      "emit": (compilation, options, pluginOptions) =>
      {
          // Copy additional resources into the web dist folder
          require('../utils/copyutils').copyAdditionalWebResources();
      }
  }),
  ]
})

if (buildSettings.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        buildSettings.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (buildSettings.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
