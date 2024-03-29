/**
 * @file Webpack base config for DaVanMonet
 *
 */

const path = require("path");
const utils = require("../utils/utils");
const buildSettings = require("../build-settings");
const webpack = require("webpack");
const { VueLoaderPlugin } = require('vue-loader')

const dvmConfig = require("../utils/load-config").dvmConfig();
const ContentIndexResolvePlugin = require("../plugins/content-index-resolver");

class LogErrorsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(
      'Log Errors Plugin',
      (
        stats
      ) => {
        if (stats.compilation.errors && stats.compilation.errors.length) {
          console.log(stats.compilation.errors);
          process.exit(1);
        }
      }
    );
  }
}

module.exports = {
  name: "davanmonet",

  performance: { hints: false },

  entry: {
    app: [path.resolve(__dirname, "../../dvm-app/src/main.js")]
  },

  output: {
    path: buildSettings.build.assetsRoot,
    filename: "[name].js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? buildSettings.build.assetsPublicPath
        : buildSettings.dev.assetsPublicPath
  },

  resolve: {
    extensions: [".js", ".vue", ".json", ".yml", ".ts"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "../../dvm-app"),
      [dvmConfig.directories.configs]: dvmConfig.configs_abs(),
      [dvmConfig.directories.indexes]: dvmConfig.indexes_abs()
    },
    plugins: [new ContentIndexResolvePlugin()], // ContentIndexResolver will generate contentindex.json if it does not exist
    fallback: { 
      path: require.resolve("path-browserify"),
      url: require.resolve("url")
    }
  },

  plugins: [
    // Here we're using the DefinePlugin to create some constants
    // that can be accessed from the application code
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

    new LogErrorsPlugin(),
    new VueLoaderPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
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
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: require("autoprefixer"),
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.sass$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              indentedSyntax: true,
              // sass-loader version >= 8
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: ["vue-style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: { configFileName: "example/tsconfig.json" }
          }
        ]
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
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'javascript/auto',
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'javascript/auto',
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'javascript/auto',
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }
    ]
  }
};
