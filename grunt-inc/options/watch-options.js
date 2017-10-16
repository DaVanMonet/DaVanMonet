module.exports = function(_gruntbase_) {

	let mainconfig = _gruntbase_.mainconfig;
	let stylesWatchTargets = _gruntbase_.fileAndDirectoryTargets.watchTargets;
	let _ = require('lodash');
	
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
			tasks:["createindexes"]
		},
		"styles":
		{
			files:stylesWatchTargets,
			options: { reload: true },
			tasks:["buildcss"]
		},
		"grunt":
		{
			files:["gruntfile.js"], 
			options: { reload: true },
			tasks:["gruntdevelopment"]
		}
	};
}