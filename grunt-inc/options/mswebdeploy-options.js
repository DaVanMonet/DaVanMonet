/* ### Babel https://github.com/babel/grunt-babel
	Compiles modern JS to older versions */
module.exports = function(_gruntbase_)
{
	let mainconfig = _gruntbase_.mainconfig;

	return {
		mswebdeploy:
		{
			options:
			{
				'dest': mainconfig.build.mswebdeploy.dest,
				'source': mainconfig.directories.build,
				'package': mainconfig.build.mswebdeploy.package
			}
		}
	};
} 