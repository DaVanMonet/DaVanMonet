/**
 * @file Webpack build script for the pattern library components
 */

const path = require("path");
var rm = require("rimraf");
const chalk = require("chalk");
const webpack = require("webpack");
const merge = require("webpack-merge");

// Load webpack configs
const webpackProdConf = require("./webpack/webpack.patternlibrary.prod.conf");
const webpackConfigProjectPL = require("./utils/load-config").getProjectPLConfig();
const webpackConfig = merge(webpackProdConf, webpackConfigProjectPL);

// Load config
const dvm_config = require("./utils/load-config").dvmConfig();

var _resolve;
const readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

rm(path.join(dvm_config.directories.dist_package), err => {
  if (err) throw err;

  // Generate fresh contentindex.json
  require("./utils/create-content-index")(dvm_config);

  webpack(webpackConfig, function(err, stats) {
    if (err) throw err;

    if (!stats) return;

    stats.compilation.children = stats.compilation.children.filter(
      c => c.getStats().hasWarnings() || c.getStats().hasErrors()
    );

    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: true,
        chunks: false,
        chunkModules: false
      }) + "\n\n"
    );

    if (stats.hasErrors()) {
      console.log(chalk.red("  Build failed with errors.\n"));
      process.exit(1);
    }

    console.log(chalk.cyan("  Build complete.\n"));
    console.log(
      chalk.yellow(
        "  Tip: built files are meant to be served over an HTTP server.\n" +
          "  Opening index.html over file:// won't work.\n"
      )
    );

    _resolve();
  });
});

module.exports = {
  ready: readyPromise
};
