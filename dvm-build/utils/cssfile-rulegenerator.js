const ExtractTextPlugin = require("extract-text-webpack-plugin");
const dvmConfig = require('../utils/load-config')();

module.exports = function()
{
	let additionalPlugins = [];
	let additionalRules = []

	// Include paths for SCSS
	var scssIncPaths = [];
	if(dvmConfig.compilation.compilers.scss.includePaths !== undefined)
	{
		scssIncPaths = dvmConfig.compilation.compilers.scss.includePaths;
	}
	// Loop targets
	for(let output in dvmConfig.compilation.targets)
	{
		const targetInfo = dvmConfig.compilation.targets[output];
		// Check which type of target we're dealing with and add the correct loaders
		let useList = [{ loader: "css-loader" /* 2. translates CSS into CommonJS */ }];
		if(targetInfo.test+"".indexOf('.sass') !== -1)
		{
			useList.push({
				loader: "sass-loader", /* compiles Sass to CSS */
				options:
				{
					includePaths: scssIncPaths.map(incPath => path.resolve(process.cwd(), incPath))
				}
			});
		}
		if(targetInfo.test+"".indexOf('.less') !== -1)
		{
			useList.push({ loader: "less-loader" });
		}
	
		// Create the plugin that will extract the content
		const targetExtractPlugin = new ExtractTextPlugin(
			{
				filename: dvmConfig.directories.cssdest + "/"+ output,
				//disable: process.env.NODE_ENV === "development"
			});
		additionalPlugins.push(targetExtractPlugin);

		// Create the rule which will use our plugin with it's loader
		let rule = 
		{
			test : new RegExp(targetInfo.test),
			use:targetExtractPlugin.extract(
			{
				use: useList,
				fallback: "style-loader"
			})
		}
		if(targetInfo.exclude)
		{
			rule["exclude"] = targetInfo.exclude.map(exclude => new RegExp(exclude));
		}
		additionalRules.push(rule);
	}
	return { additionalRules,  additionalPlugins };
}