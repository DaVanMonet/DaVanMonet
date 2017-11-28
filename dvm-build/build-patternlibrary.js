/**
 * @file Webpack build script for the pattern library components
 */

const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const merge = require('webpack-merge');

// Load webpack configs
const webpackProdConf = require('./webpack/webpack.patternlibrary.prod.conf')
const webpackConfigProjectPL = require('./utils/load-config').getProjectPLConfig();
const webpackConfig = merge(webpackProdConf, webpackConfigProjectPL)

// Load config
const dvm_config = require('./utils/load-config').dvmConfig();

// Generate fresh contentindex.json
require('./utils/create-content-index')(dvm_config);

webpack(webpackConfig, function (err, stats) {
    //spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    console.log(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }));

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
});
