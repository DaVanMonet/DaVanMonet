var utils = require('../utils/utils')
var config = require('../build-settings')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProduction = process.env.NODE_ENV === 'production'

let cssLoaders = function(options)
{
	options = options || {}

	var cssLoader = {
		loader: 'css-loader',
		options:
		{
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: options.sourceMap
		}
	}

	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions)
	{
		var loaders = [cssLoader]
		if (loader)
		{
			loaders.push(
			{
				loader: loader + '-loader',
				options: Object.assign(
				{}, loaderOptions,
				{
					sourceMap: options.sourceMap
				})
			})
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract)
		{
			return ExtractTextPlugin.extract(
			{
				use: loaders,
				fallback: 'vue-style-loader'
			})
		}
		else
		{
			return ['vue-style-loader'].concat(loaders)
		}
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders("postcss-loader",
		{
			options:
			{
				plugins: [
					require('autoprefixer')
				]
			}
		}),
		less: generateLoaders('less'),
		sass: generateLoaders('sass',
		{
			indentedSyntax: true
		}),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}
const loadersTest =  cssLoaders(
	{
		sourceMap: isProduction ?
			config.build.productionSourceMap :
			config.dev.cssSourceMap,
		extract: isProduction
	});
module.exports = {

	loaders: cssLoaders(
	{
		sourceMap: isProduction ?
			config.build.productionSourceMap :
			config.dev.cssSourceMap,
		extract: isProduction
	}),
	transformToRequire:
	{
		video: 'src',
		source: 'src',
		img: 'src',
		image: 'xlink:href'
	}
}
