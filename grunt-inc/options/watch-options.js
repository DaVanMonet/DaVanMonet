module.exports = function(_gruntbase_) {

	let mainconfig = _gruntbase_.mainconfig;
	let stylesWatchTargets = _gruntbase_.fileAndDirectoryTargets.watchTargets;
	let _ = require('lodash');
	let assetsWatchTargets = [];
	if(typeof mainconfig.assets === "object" && mainconfig.assets.length > 0)
	{
		mainconfig.assets.forEach((assetItem) =>
		{
			if(typeof assetItem.isdirectory === "boolean" && typeof assetItem.src === "string" && typeof assetItem.dest === "string")
			{
				assetsWatchTargets.push(assetItem.src + "/**/*.*");
				assetsWatchTargets.push(assetItem.src + "/*.*");
			}
			else
			{
				assetsWatchTargets.push(assetItem.src);
			}
		});
	}
	return {
		"options":
		{
			spawn: false,
			interval: 600,
			livereload:  mainconfig.developmentenvironment.livereloadport
		},
		"indexation":
		{
			files:_.flatten(mainconfig.structure.map((folder, i) =>
			{
				let path = mainconfig.directories.src + "/" + folder.path;
				 return [path + "/*.md", path + '/**/*.md',path + '/index.json',path + '/**/index.json'];
			})),
			options: { reload: true },
			tasks:["davanmonet:createindexes"]
		},
		"styles":
		{
			files: stylesWatchTargets,
			options: { reload: true },
			tasks:["davanmonet:buildcss"]
		},
		"assets":
		{
			files:assetsWatchTargets,
			options: { reload: true },
			tasks:["copy:assets","copy:assetstofolder"]
		},
		//"previewsite":
		//{
		//	files:[__dirname + '/../../preview/**/*.es6.js', __dirname + '/../../preview/*.es6.js'],
		//	options: { reload: true },
		//	tasks:["babel"]
		//}
	};
}
