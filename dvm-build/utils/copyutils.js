const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const dvmConfig = require('./load-config').dvmConfig()

exports.copyAssets = function()
{
	if(dvmConfig.compilation.copyAssetsToFolder === true && dvmConfig.assets && dvmConfig.assets.length > 0)
	{
		dvmConfig.assets.forEach((assetsItem) =>
		{
			if(typeof assetsItem.dest !== "object")
				return;
				
			const srcPath = path.resolve(process.cwd(), assetsItem.src);
			assetsItem.dest.forEach((dest) =>
			{
				const destPath = path.resolve(process.cwd(),dest);
				fs.copy(srcPath, destPath, err =>
				{
					if (err) throw err;
					console.log(chalk.green('>> Copied "' + assetsItem.src + '" to "'+ dest +'"'));
				});
			});
		});
	}
};

exports.copySrc = function()
{
	const srcPath = path.resolve(process.cwd(), dvmConfig.directories.src);
	const distWebDest = path.resolve(process.cwd(), dvmConfig.directories.dist_web + "/" + dvmConfig.directories.src);
	const distPackageDest = path.resolve(process.cwd(), dvmConfig.directories.dist_package + "/src");

	fs.copy(srcPath, distPackageDest, err =>
	{
		if (err) throw err;
		console.log(chalk.green('>> Copied "' + srcPath + '" to "'+ distPackageDest +'"'));
	});
	
	fs.copy(srcPath, distWebDest, err =>
	{
	 	if (err) throw err;
	 	console.log(chalk.green('>> Copied "' + srcPath + '" to "'+ distWebDest +'"'));
	});
}

// Copy content index to web root
exports.copyContentIndex = function()
{
	const srcPath = path.resolve(process.cwd(), dvmConfig.directories.indexes + '/' + dvmConfig.indexing.contentindexoutput);
	const destPath = path.resolve(process.cwd(), dvmConfig.directories.dist_web + '/' + dvmConfig.indexing.contentindexoutput);

	fs.copy(srcPath, destPath, err =>
	{
		if (err) throw err;
		console.log(chalk.green('>> Copied "' + srcPath + '" to "'+ destPath +'"'));
	});
}
