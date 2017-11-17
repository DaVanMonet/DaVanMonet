/**
 * @file Webpack build script for the pattern library components
 * 
 */

var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.patternlibrary.prod.conf')

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