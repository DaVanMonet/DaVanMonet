/**
 * @file Webpack base config for pattern libraries
 *
 */

const path = require("path");
const webpack = require("webpack");

const HookPlugin = require("../plugins/hook-plugin");
const ContentIndexResolvePlugin = require("../plugins/content-index-resolver");

const dvmConfig = require("../utils/load-config").dvmConfig();

const {
  additionalRules,
  additionalPlugins
} = require("../utils/cssfile-rulegenerator")();

module.exports = {
  name: "patternlibrary",

  entry: {
    ...dvmConfig.compilation.entry,
    "preview-frame.js": path.resolve(
      __dirname,
      "../../dvm-app/src/preview-frame.js"
    )
  },

  output: {
    path: dvmConfig.dist_web_abs(),
    filename: "[name].js",
    publicPath: "/"
  },

  resolve: {
    extensions: [".ts", ".js", ".json", ".yml", ".ts"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      [dvmConfig.directories.configs]: dvmConfig.configs_abs(),
      [dvmConfig.directories.indexes]: dvmConfig.indexes_abs()
    },
    plugins: [new ContentIndexResolvePlugin()],
    fallback: { 
      path: require.resolve("path-browserify"),
      url: require.resolve("url")
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      __MAIN_CONFIG_PATH__: JSON.stringify(
        path.resolve(process.cwd(), process.env.npm_package_config_configFile)
      ), // This is set in package.json //process.env.npm_package_config_configFile
      __USER_CONFIG_PATH__: JSON.stringify(dvmConfig.userconfig_abs()),
      __CONTENT_INDEX_PATH__: JSON.stringify(
        dvmConfig.indexes_abs() + "/" + dvmConfig.indexing.contentIndexOutput
      ),
      __PACKAGE_JSON__: JSON.stringify(process.cwd() + "/package.json")
    }),

    //Emit CSS and JS copies
    new HookPlugin({
      emit: compilation => {
        if (dvmConfig.compilation.emitCssCopies === true) {
          require("../utils/emit-css-copies.js")(compilation.getAssets(), [
            dvmConfig.directories.cssCopies
          ]);
        }
        if (dvmConfig.compilation.emitJsCopies === true) {
          require("../utils/emit-js-copies.js")(compilation.getAssets(), [
            dvmConfig.directories.jsCopies
          ]);
        }
      }
    }),

    ...additionalPlugins
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              import: false
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.yml$/,
        loader: "yml-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /.*node_modules((?!davanmonet).)*$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env"]
        }
      },
      ...additionalRules
    ]
  }
};
