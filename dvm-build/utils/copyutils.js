const path = require('path')
const fs = require('fs-extra')
const dvmConfig = require('./load-config')()

exports.copyAssets = function()
{
	if(dvmConfig.compilation.copyAssetsToFolder === true && dvmConfig.assets && dvmConfig.assets.length > 0)
	{
		dvmConfig.assets.forEach((assetsItem) =>
		{
			const srcPath = path.resolve(process.cwd(), assetsItem.src);
			assetsItem.dest.forEach((dest) =>
			{
				const destPath = path.resolve(process.cwd(),dest);
				fs.copy(srcPath, destPath, err =>
				{
					if (err)
					{
						return console.error(err)
					}
					console.log('Copied "' + assetsItem.src + '" to "'+ dest +'"');
				});
			});
		});
	}
};

exports.copyTargets = function()
{
	if(dvmConfig.compilation.targets && dvmConfig.compilation.copyCompiledCssToFolder === true)
	{
		for (let target_name of Object.keys(dvmConfig.compilation.targets))
		{
			const srcPath = path.resolve(process.cwd() + dvmConfig.directories.dist_web.replace("./","/") + dvmConfig.directories.cssdest,  target_name);
			const destPath = path.resolve(process.cwd() + dvmConfig.directories.dist_package.replace("./","/") + dvmConfig.directories.cssdest,  target_name);
			fs.copy(srcPath, destPath, err =>
			{
				if (err)
				{
					return console.error(err)
				}
				console.log('Copied "' + target_name.src + '" to "'+ dvmConfig.directories.dist_package +'"');
			});
		}
	}
};