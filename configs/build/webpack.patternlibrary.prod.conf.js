/**
 * @file Webpack prod config for pattern libraries
 * 
 */

var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.patternlibrary.base.conf')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = merge(baseWebpackConfig, {

});