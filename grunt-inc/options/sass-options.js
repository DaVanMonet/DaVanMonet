/* ### SASS https://github.com/gruntjs/grunt-sass 
Compile SASS to CSS */
module.exports = function(_gruntbase_) {

	let mainconfig = _gruntbase_.mainconfig;
	let compilationFiles = _gruntbase_.fileAndDirectoryTargets.compileTargets;
	let _ = require('lodash');

	let options = {
		sourceMap: mainconfig.compilation.sourceMaps
	}

	_.merge(options, mainconfig.compilation.compilers.scss.compilerOptions);

	return {
		options: options,
		build:
		{
			files:compilationFiles.sass.compilationTarget
		}
	};
}