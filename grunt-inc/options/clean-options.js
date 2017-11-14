/* ### Clean https://github.com/gruntjs/grunt-contrib-clean
	Clears out the build folder */
module.exports = function(_gruntbase_) {
	let mainconfig = _gruntbase_.mainconfig;
    return {
		build:
		{
			src:[mainconfig.directories.build]
		},
		dist:
		{
			src:[
				mainconfig.directories.dist_web,
				mainconfig.directories.dist_package
			]
		}
	};
}