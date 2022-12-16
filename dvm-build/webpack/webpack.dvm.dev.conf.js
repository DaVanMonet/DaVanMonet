/**
 * @file Webpack dev config for DaVanMonet
 *
 */

var utils = require("../utils/utils");
var webpack = require("webpack");
var buildSettings = require("../build-settings");
var { merge } = require("webpack-merge");
var path = require("path");
var baseWebpackConfig = require("./webpack.dvm.base.conf");
var HtmlWebpackPlugin = require("html-webpack-plugin");

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = [
    'webpack-hot-middleware/client?noInfo=true&reload=true&name=dvm'
  ].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  mode: "development",

  plugins: [
    new webpack.DefinePlugin({
      "process.env": buildSettings.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../../dvm-app/index.html"),
      inject: true
    })
  ],

  devServer: {
    static: './dist',
   hot: true,
  },

  optimization: {
    runtimeChunk: 'single',
  }
});
