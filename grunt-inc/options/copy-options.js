/* ### Copy https://github.com/gruntjs/grunt-contrib-copy
	Copies content, used for adding things to the build folder*/
module.exports = function(_gruntbase_) {

	const mainconfig = _gruntbase_.mainconfig;

	const copyCssToFolderFiles = (mainconfig.compilation.copyCompiledCssToFolder === true) ?
		[{
			expand: true,
			cwd: mainconfig.directories.build + '/' + mainconfig.directories.cssdest,
			src: "*",
			dest: mainconfig.directories.copycsspath
		}] : [];

	let copyAssetsFiles = [];
	let copyAssetsToFolderFiles = [];
	const copyAssetsToFolder = (mainconfig.compilation.copyAssetsToFolder === true);
	if(typeof mainconfig.assets === "object" && mainconfig.assets.length > 0)
	{
		
		mainconfig.assets.forEach((assetItem) =>
		{
			if(typeof assetItem.isdirectory === "boolean" && typeof assetItem.src === "string" && typeof assetItem.dest === "string")
			{
				let copyTarget = {};
				let copyToFolder = {};
				if(assetItem.isdirectory === true)
				{
					// We the result to be a directory 
					copyAssetsFiles.push({
						expand: true,
						cwd: assetItem.src,
						src: ["*", "**"],
						dest: assetItem.dest
					});
					if(copyAssetsToFolder)
					{
						copyAssetsToFolderFiles.push({
							expand: true,
							cwd: assetItem.src,
							src: ["*", "**"],
							dest: mainconfig.directories.copyassetspath
						});
					}
				}
				else if(assetItem.src.indexOf(".") !== -1)
				{
					//We expect the source to be one file
					let copyTarget = {};
					copyTarget[assetItem.dest] = assetItem.src;
					copyAssetsFiles.push(copyTarget);
					if(copyAssetsToFolder)
					{
						let copyToFolderTarget = {};
						copyToFolderTarget[mainconfig.directories.copyassetspath] = assetItem.src;
						copyAssetsToFolderFiles.push(copyToFolderTarget);
					}
				}
			}
			else
			{
				//We expect the object to be a valid files:[]  property
				copyAssetsFiles.push(assetItem);
				// We can't really manage custom objects for copying to a specific folder
			}
		});
	}
		
    return {
		preview:
		{
			files: [{	/* Copies the content of the preview folder to the build directory */
				expand:true,
				cwd: __dirname + '/../../preview/',
				src: '**',
				dest: mainconfig.directories.build
			}]
		},
		build:
		{
			files:
			[{	/* Copy over the project configuration file */
				expand:true,
				src: _gruntbase_.mainConfFilePath,
				dest: mainconfig.directories.build
			},
			{	/* Copy over the user configuration file */
				expand:true,
				src: mainconfig.userconfig,
				dest: mainconfig.directories.build
			},
			{	/* Copy over the index file */
				expand:true,
				src: mainconfig.indexing.contentindexoutput,
				dest: mainconfig.directories.build
			},
			{	/* Copy over the index file */
				expand:true,
				src: mainconfig.indexing.targetindexoutput,
				dest: mainconfig.directories.build
			},
			{	/* Copy over the source files */
				expand:true,
				src: mainconfig.directories.src + "/**",
				dest: mainconfig.directories.build
			}]
		},
		assets:
		{
			files:copyAssetsFiles
		},
		csstofolder:
		{
			files:copyCssToFolderFiles
		},
		assetstofolder:
		{
			files: copyAssetsToFolderFiles
		}
	};
}
