/* jshint undef:false */
/* global module, require, process */

module.exports = function (grunt)
{
	"use strict";
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);

	// jit-grunt can't find this :(
	grunt.loadNpmTasks('grunt-express-server');

	// In this object we'll put stuff that will need to be accesed in various places
	let _gruntbase_ = { grunt: grunt };

	// Path to main config file
	_gruntbase_.mainConfFilePath = "./patternlibraryconfig.json";

	

	// Load default config and optional user config
	// -----------------------------------------------------------------------

	let mainconfig = grunt.file.readJSON(_gruntbase_.mainConfFilePath);
	let _ = require('lodash');
	if (grunt.file.exists(mainconfig.userconfig))
	{
		let userconfig = grunt.file.readJSON(mainconfig.userconfig);
		_.merge(mainconfig, userconfig);
	}
	_gruntbase_.mainconfig = mainconfig;



	// Get style targets for compilation and watch. I.e, .less and .scss files
	// -----------------------------------------------------------------------

	_gruntbase_.styleTargets = require('./grunt-inc/gather-style-targets')(_gruntbase_);
	


	// Load grunt task configs
	// -----------------------------------------------------------------------

	grunt.initConfig(require('./grunt-inc/load-task-options')(_gruntbase_));


	
	// Register tasks that...
	// -----------------------------------------------------------------------

	// ...outputs the configuration tree in console
	require('./grunt-inc/tasks/show-config').registerWithGrunt(_gruntbase_);

	// ...runs compilers that outputs the CSS
	require('./grunt-inc/tasks/build-css').registerWithGrunt(_gruntbase_);

	// ...creates the target index json file
	require('./grunt-inc/tasks/create-target-index').registerWithGrunt(_gruntbase_);

	// ...creates the content index json file that lists the components in the pattern library
	require('./grunt-inc/tasks/create-content-index').registerWithGrunt(_gruntbase_);
	


	// Bundle tasks in useful combinations
	// -----------------------------------------------------------------------

	grunt.registerTask("createindexes", ["createcontentindex","createtargetindex"]);
	grunt.registerTask("builddev", ["showconfig","clean:build","createindexes","buildcss"]);
	grunt.registerTask("dev", ["builddev","connect:livereload","express:onsitepreview","watch"]);
	grunt.registerTask("previewdev", ["dev"]); // Legacy bulid

	grunt.registerTask("build", ["clean:build","createindexes","buildcss","copy:build","copy:preview"]);
	grunt.registerTask("previewbuild", ["build","connect:build"]);
	grunt.registerTask("default", ["dev"]);
	/* Tasks:
		showconfig (will show the current configuration (grunt configuration, project configuration and what folders will be indexed))
		buildcss (will run less & scss depending on settings)
		createindexes (will create a json files describing the content structure and what files are compiled)

		dev (will do the tasks above and start a webserver and watch)
		build (will compile less and the index; then copy everything to the build folder)
	*/
};
