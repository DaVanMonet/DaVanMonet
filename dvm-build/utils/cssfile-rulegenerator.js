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

	// console.log('dvmConfig.compilation.targets',dvmConfig.compilation.targets)
	// console.log('dvmConfig.compilation',dvmConfig.compilation)
	for(let output in dvmConfig.compilation.targets)
	{
		const targetInfo = dvmConfig.compilation.targets[output];
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
	

		const targetExtractPlugin = new ExtractTextPlugin(
			{
				filename: output,
				//disable: process.env.NODE_ENV === "development"
			});
		additionalPlugins.push(targetExtractPlugin);
		let rule = 
		{
			// resource:dvmConfig.compilation.targets[output].map(file =>
			// 	file.replace(process.cwd().replace(/\\/ig,"/"), ".")
			// ),
			
			//test : dvmConfig.compilation.targets[output].map(file => require.resolve(file.replace(process.cwd().replace(/\\/ig,"/"), "."))),
			test : new RegExp(targetInfo.test),

			//test : dvmConfig.compilation.targets[output].map(file => file.replace(process.cwd().replace(/\\/ig,"/"), ".")),
			//test : /\.less$/,
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
		// const testList = dvmConfig.compilation.targets[output].filter(target => target.indexOf("!") === -1).map(target => new RegExp("/\\"+ target +"$/",'ig'));
		// const excludeList = dvmConfig.compilation.targets[output].filter(target => target.indexOf("!") === 0).map(target => new RegExp("/\\"+ target.replace("!","") +"$/",'ig'));
		// testList.forEach(test => {
		// 	let rule = {
		// 		test: test,
		// 		use: targetExtractPlugin.extract(
		// 		{
		// 			use: useList,
		// 			fallback: "style-loader"
		// 		})
		// 	};
		// 	if(excludeList.length > 0)
		// 	{
		// 		rule.exclude = excludeList;
		// 	}
		// 	additionalRules.push(rule);
		// });
	}
	return { additionalRules,  additionalPlugins };
}