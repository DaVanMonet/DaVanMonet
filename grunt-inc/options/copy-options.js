/* ### Copy https://github.com/gruntjs/grunt-contrib-copy
	Copies content, used for adding things to the build folder*/
module.exports = function(_gruntbase_) {

	let mainconfig = _gruntbase_.mainconfig;

    return {
		preview:
		{
			files: [{	/* Copies the content of the preview folder to the build directory */
				expand:true,
				cwd: './preview/',
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
		csstofolder:
		{
			files:
			[{
				expand:true,
				cwd:mainconfig.directories.build + '/' + mainconfig.directories.cssdest,
				src:"*",
				dest:mainconfig.directories.copycsspath
			}]
		}
	};
}