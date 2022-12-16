/**
 * @file Webpack dev config for pattern libraries
 *
 */

var utils = require("../utils/utils");
var webpack = require("webpack");
var { merge } = require("webpack-merge");
var path = require("path");
var baseWebpackConfig = require("./webpack.patternlibrary.base.conf");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const HookPlugin = require("../plugins/hook-plugin");

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = [
    'webpack-hot-middleware/client?noInfo=true&reload=true&name=patternlibrary'
  ].concat(baseWebpackConfig.entry[name]);
});

const devConfig = {
  mode: "development",

  entry: {
    ospClient: path.resolve(__dirname, "../onsitepreview/client.js")
  },

  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),

    new HookPlugin({
      done: _ => {
        console.log("create version file etc");
        require("../utils/create-version-file").createFile();
      }
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "showcase-render-iframe.html",
      template: path.resolve(
        __dirname,
        "../../dvm-app/static/showcase-render-iframe.html"
      ),
      inject: true,
      excludeChunks: ["ospClient"]
    })
  ],

  devServer: {
    static: './dist',
   hot: true,
  },

  optimization: {
    runtimeChunk: 'single',
  }
};

module.exports = merge(baseWebpackConfig, devConfig);
