/**
 * @file Webpack dev config for DaVanMonet
 *
 */

var utils = require("../utils/utils");
var webpack = require("webpack");
var buildSettings = require("../build-settings");
var merge = require("webpack-merge");
var path = require("path");
var baseWebpackConfig = require("./webpack.dvm.base.conf");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = [
    path.resolve(__dirname, "../../dvm-build/dvm-hr-client")
  ].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  mode: "development",

  // cheap-module-eval-source-map is faster for development
  devtool: "#cheap-module-eval-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": buildSettings.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../../dvm-app/index.html"),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
});
