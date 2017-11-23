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
					if (err) throw err;
					console.log('Copied "' + assetsItem.src + '" to "'+ dest +'"');
				});
			});
		});
	}
};

exports.copyTargets = function()
{
	console.log('### copy targets');
};