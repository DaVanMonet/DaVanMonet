/* ### SASS https://github.com/gruntjs/grunt-sass 
	Compile SASS to CSS */
module.exports = function(_gruntbase_) {

	let mainconfig = _gruntbase_.mainconfig;
	let compilationFiles = _gruntbase_.styleTargets.compileTargets;

    return {
		options:
		{
			sourceMap: mainconfig.compilation.sourceMaps
		},
		build:
		{
			files:compilationFiles.sass.compilationTarget
		}
	};
}