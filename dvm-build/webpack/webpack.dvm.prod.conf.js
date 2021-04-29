/**
 * @file Webpack prod config for DaVanMonet
 *
 */

const path = require("path");
const utils = require("../utils/utils");
const webpack = require("webpack");
const buildSettings = require("../build-settings");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.dvm.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HookPlugin = require("../plugins/hook-plugin");

const dvmConfig = require("../utils/load-config").dvmConfig();

var env =
  process.env.NODE_ENV === "testing"
    ? require("../env/test.env")
    : buildSettings.build.env;

var webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  devtool: buildSettings.build.productionSourceMap ? "#source-map" : false,
  output: {
    path: buildSettings.build.assetsRoot,
    filename: path.posix.join(
      dvmConfig.directories.js_subDir,
      "[name].[chunkhash].js"
    ),
    chunkFilename: path.posix.join(
      dvmConfig.directories.js_subDir,
      "[id].[chunkhash].js"
    )
  },
  optimization: {
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // Must be set to true if using source-maps in production
      })
    ]
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      "process.env": env
    }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: path.posix.join(
        dvmConfig.directories.css_subDir,
        "[name].[contenthash].css"
      )
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
      filename:
        process.env.NODE_ENV === "testing"
          ? "index.html"
          : buildSettings.build.index,
      template: path.resolve(__dirname, "../../dvm-app/index.html"),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: "dependency"
    }),

    // copy custom static assets
    new CopyWebpackPlugin({
      patterns:[
        {
          from: path.resolve(__dirname, "../../dvm-app/static"),
          to: buildSettings.build.assetsSubDirectory,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: [".*"]
          }
        }
      ]
    }),
    new HookPlugin({
      emit: require("../utils/copyutils").copyAdditionalWebResources
    })
  ]
});

if (buildSettings.build.productionGzip) {
  var CompressionWebpackPlugin = require("compression-webpack-plugin");

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp(
        "\\.(" + buildSettings.build.productionGzipExtensions.join("|") + ")$"
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (buildSettings.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
