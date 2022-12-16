/**
 * @file Webpack prod config for pattern libraries
 *
 */

const path = require("path");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.patternlibrary.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HookPlugin = require("../plugins/hook-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const dvmConfig = require("../utils/load-config").dvmConfig();

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const prodConfig = {
  mode: "production",

  output: {
    path: dvmConfig.dist_web_abs(),
    filename: "[name].js",
    publicPath: dvmConfig.directories.public_path
  },

  optimization: {
    usedExports: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin()
    ]
  },

  plugins: [
    new HookPlugin({
      done: stats => {
        console.log("create version file etc");
        require("../utils/create-version-file").createFile();
        if (undefined === stats.compilation.records.chunks) {
          return;
        } else {
          // Generate targetindex.json
          let chunks = stats.compilation.records.chunks.byName;
          require("../utils/create-target-index.js")(chunks);
        }

        // If configured, move specified assets to external folder
        require("../utils/copyutils").copySrc();

        // Copy content index to web root
        require("../utils/copyutils").copyContentIndex();

        // If configured, move specified assets to external folder
        require("../utils/copyutils").copyAssets();

        // Copy additional resources into the package folder (such as the compiled css)
        require("../utils/copyutils").copyAdditionalPackageResources();
      }
    }),

    new HtmlWebpackPlugin({
      filename: "showcase-render-iframe.html",
      template: path.resolve(
        __dirname,
        "../../dvm-app/static/showcase-render-iframe.html"
      ),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
};

module.exports = merge(baseWebpackConfig, prodConfig);
