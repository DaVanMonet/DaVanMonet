/* ts (TypesScript) https://github.com/TypeStrong/grunt-ts
* Compiles TypeScript Files
*/
module.exports = function(_gruntbase_) {

	const mainconfig = _gruntbase_.mainconfig;

    return {
		fast:
		{
			tsconfig: mainconfig.directories.src + "/tsconfig.json",
			options:
			{
				fast: true,
				verbose: true
			},
			src:
			[
				mainconfig.directories.src + "/**/*.ts"
			]
		}
	};
}