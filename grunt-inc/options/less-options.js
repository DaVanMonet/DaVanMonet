/* ### LESS https://github.com/gruntjs/grunt-contrib-less 
	Compile LESS to CSS */
module.exports = function(_gruntbase_) {

	let mainconfig = _gruntbase_.mainconfig;
	let compilationFiles = _gruntbase_.fileAndDirectoryTargets.compileTargets;

    return {
		options:
		{
			"compress": false, 		//Compress output by removing some whitespaces.
			"relativeUrls": false, 	// Rewrite URLs to be relative. false: do not modify URLs.
			"sourceMap": mainconfig.compilation.sourceMaps
		},
		build:
		{
			files:compilationFiles.less.compilationTarget
		}
	};
}