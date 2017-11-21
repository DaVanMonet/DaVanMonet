/**
 * @file Webpack base config for pattern libraries
 * 
 */

const path = require('path')
const utils = require('../utils/utils')
const config = require('../env')
const glob = require("glob")
const webpack = require('webpack');
const PostCompile = require('post-compile-webpack-plugin')
const LifecyclePlugin = require('../plugins/lifecycle-plugin');
const dvmConfig = require('../utils/load-config')();
const resolve = dir =>
{
	return path.join(__dirname, '..', dir)
}

const { additionalRules,  additionalPlugins } = require('../utils/cssfile-rulegenerator')();


module.exports = {
	name: "patternlibrary",

	entry: dvmConfig.compilation.entry,

	output:
	{
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ?
			config.build.assetsPublicPath :
			config.dev.assetsPublicPath
	},

	resolve:
	{
		extensions: ['.ts', '.js', '.css'],
		// alias: {
		//   '@': path.resolve(__dirname, '../../preview'),
		// }
	},

	plugins: [
		new PostCompile((stats) =>
		{
			//console.log("Assets: ", stats.compilation.records.chunks.byName)
		}),
		new LifecyclePlugin(
		{
			"done": (compilation, options, pluginOptions) =>
			{
				// If configured, move specified assets to external folder
				require('../utils/copyutils').copyAssets();
			}
		}),
		...additionalPlugins
	],
	module:
	{
		rules: [
			{ // Load .js/.jsx files though babel-loader
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query:
				{
					presets: ['stage-2']
				}
			},
			{ // Load .ts/.tsx files thought ts-loader
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			...additionalRules
		]
	}
}