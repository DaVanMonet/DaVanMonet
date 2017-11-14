/* ### Copy https://github.com/gruntjs/grunt-contrib-copy
	Copies content, used for adding things to the build folder*/
module.exports = function(_gruntbase_) {

	const mainconfig = _gruntbase_.mainconfig;
	const isType = (val, type) => (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)));

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

	let additionalPackageFiles = [];
	let additionalWebFiles = [];
	if(isType(mainconfig.build, "object"))
	{
		// Function to map the files specified in the project configuration to actual copy commands. Expects an object such as { src:"file.txt", dest:"folder/" }. 
		// To put the file in the root use dest: "./"
		const additionalFileMap = function(file)
		{
			let src = isType(file.src,"string") ? file.src : isType(file, "string") ? file : null;
			if(src !== null)
			{
				const dest = this + "/" + (isType(file.dest,"string") ? file.dest : "");
				return {
					expand:true,
					dot:true,
					flatten: true,
					src: src,
					dest: dest
				}
			}
		};
		if(isType(mainconfig.build.package, "object") && isType(mainconfig.build.package.files,"object") && isType(mainconfig.build.package.files.length,"number"))
		{
			additionalPackageFiles = mainconfig.build.package.files.map(additionalFileMap.bind(mainconfig.directories.dist_package));
		}

		if(isType(mainconfig.build.web, "object") && isType(mainconfig.build.web.files, "object") && isType(mainconfig.build.web.files.length,"number"))
		{
			additionalWebFiles = mainconfig.build.web.files.map(additionalFileMap.bind(mainconfig.directories.dist_web));
		}
	}

	if(isType(mainconfig.assets,"object") && mainconfig.assets.length > 0)
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
			
			files: [
			{	/* Copies the content of the preview folder to the build directory */
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
			{	/* Copy over the index files */
				expand:true,
				cwd: mainconfig.directories.indexes,
				src: [mainconfig.indexing.contentindexoutput, mainconfig.indexing.targetindexoutput],
				dest: mainconfig.directories.build + '/' + mainconfig.directories.indexes
			},
			{	/* Copy over the source files */
				expand:true,
				src: mainconfig.directories.src + "/**",
				dest: mainconfig.directories.build
			}]
		},
		dist_web:
		{
			files:[{
				/* Copies the build folder to the web dist folder */
				expand:true,
				dot:true,
				cwd: mainconfig.directories.build,
				src: '**',
				dest: mainconfig.directories.dist_web
			}].concat(additionalWebFiles)
		},
		dist_package:
		{
			files:[{
				/* Copy over the source files */
				expand:true,
				cwd: mainconfig.directories.build + mainconfig.directories.cssdest,
				src:  '**',
				dest: mainconfig.directories.dist_package + mainconfig.directories.cssdest
			},
			{
				/* Copy over the source files */
				expand:true,
				src: mainconfig.directories.src + '/**',
				dest: mainconfig.directories.dist_package
			}].concat(additionalPackageFiles)
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
