const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dvmConfig = require('../utils/load-config')();

module.exports = function()
{
	let additionalPlugins = [];
	let additionalRules = []

	let loader_specs = {};
	
	// Loop targets
	for (t_key of Object.keys(dvmConfig.compilation.targets)
		.filter(t => t.endsWith('.css'))) // We only care about CSS targets here
	{
		let t = dvmConfig.compilation.targets[t_key];

		// Look for less files
		if (loader_specs['less'] === undefined
		&& t.find(f => f.endsWith('.less')))
		{
			loader_specs['less'] = {
				test: /\.less$/,
				loader: 'less-loader'
			}

			continue;
		} // less

		// Look for sass files
		if (loader_specs['sass'] === undefined
		&& t.find(f => f.endsWith('.sass') || f.endsWith('.scss')))
		{
			// Include paths for SCSS
			var scssIncPaths = dvmConfig.compilation.compilers.scss.includePaths || [];

			console.log("#### scssIncPaths", scssIncPaths);

			loader_specs['sass'] = {
				test: /\.s[c|a]ss$/,
				loader: 'sass-loader',
				options: {
					includePaths: scssIncPaths.map(
						incPath => path.resolve(process.cwd(), incPath)
					)
				}
			}

			continue;
		} // sass

	} // for

	// Create neccesary loaders
	for (ls_key in loader_specs)
	{
		let loader = {
			test: loader_specs[ls_key].test,
			use: ['css-hot-loader?fileMap=css/{fileName}'].concat(ExtractTextPlugin.extract({ // Use css-hot-loader to enable hot-loading in dev mode
				fallback: "style-loader", // 3. Load with extract text plugin, or fall back to style loader
				use: [{
					loader: "css-loader" // 2. Translates CSS into CommonJS
				}, {
					loader: loader_specs[ls_key].loader, // 1. Preprocess
					options: loader_specs[ls_key].options
				}]
			}))
		}

		additionalRules.push(loader);
	}

	// Create plugin dependencies
	additionalPlugins.push(
		new ExtractTextPlugin({
			// TODO: Don't hardcode this
			filename: 'static/css/[name]'
		}));
	
	return { additionalRules,  additionalPlugins };
}