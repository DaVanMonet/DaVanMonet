'use strict';
module.exports = function(grunt) {
	const davanmonetOptions = grunt.config.get("davanmonet.options");
	const _			= require("lodash");
	const yaml		= require('js-yaml');
	const fs		= require('fs');
	const isType	= (val, type) => (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)))
	const loadJSONorYAML = (path) =>
	{
		if(grunt.file.exists(path))
		{
			return (path.indexOf('.json') !== -1) ? grunt.file.readJSON(path) : yaml.safeLoad(fs.readFileSync(path, 'utf8'));
		}
		else
		{
			console.error('File does not exist ('+ path +')');
		}
	}

	// Load default config and optional user config
	// -----------------------------------------------------------------------
	var mainConfFilePath = (davanmonetOptions.config) ? davanmonetOptions.config : "./patternlibraryconfig.json";
	
	let mainconfig = {};
	mainconfig = loadJSONorYAML(mainConfFilePath);

	if(typeof mainconfig === "object")
	{
		// Load user config if it exists
		if (typeof mainconfig.userconfig === "string" && grunt.file.exists(mainconfig.userconfig))
		{
			let userconfig =  loadJSONorYAML(mainconfig.userconfig);
			_.merge(mainconfig, userconfig);
		}
	}
	else
	{
		console.error('Unable to load the configuration from ' + mainConfFilePath);
		return;
	}

	// In this object we'll put stuff that will need to be accessed in various places
	// Custom tasks require the project config (mainconfig), and grunt taks require the files
	let _gruntbase_ = {
		grunt: grunt,
		davanmonetTaskOptions: davanmonetOptions,
		mainconfig: mainconfig,
		mainConfFilePath: mainConfFilePath,
		fileAndDirectoryTargets: {}
	};
	
	// Get style targets for compilation and watch. I.e, .less and .scss files
	// -----------------------------------------------------------------------
	_gruntbase_.fileAndDirectoryTargets = require('../grunt-inc/gather-file-directory-targets')(_gruntbase_);

	// Load grunt task configs
	// -----------------------------------------------------------------------
	var gruntTaskOptions = require('../grunt-inc/load-task-options')(_gruntbase_);
	grunt.config.merge(gruntTaskOptions);
	require('jit-grunt')(grunt, { express: 'grunt-express-server' });
	require('time-grunt')(grunt);

	grunt.registerTask('davanmonet', 'A pattern library thingie',  function ()
	{
		let taskOptions = this.options();   

		let taskNames = this.args;
		if(taskNames.length === 0)
		{
			taskNames = ["dev"];
		}
		let modifiedTaskNames = taskNames.map(task => "davanmonet-" + task);		
		
		// Register tasks that...
		// -----------------------------------------------------------------------
	

		// ...outputs the configuration tree in console
		require('../grunt-inc/tasks/show-config').registerWithGrunt(_gruntbase_);
		
		// ...create the config root for the web preview
		require('../grunt-inc/tasks/create-config-root').registerWithGrunt(_gruntbase_);

		// ...runs compilers that outputs the CSS
		require('../grunt-inc/tasks/build-css').registerWithGrunt(_gruntbase_);
	
		// ...creates the target index json file
		require('../grunt-inc/tasks/create-target-index').registerWithGrunt(_gruntbase_);
	
		// ...creates the content index json file that lists the components in the pattern library
		require('../grunt-inc/tasks/create-content-index').registerWithGrunt(_gruntbase_);
	
		// ...creates the content index json file that lists the components in the pattern library
		require('../grunt-inc/tasks/create-version-file').registerWithGrunt(_gruntbase_);

		// Starts connect & express depending on settings
		require('../grunt-inc/tasks/start-servers').registerWithGrunt(_gruntbase_);
		

		// Set tasks object for later registration
		// -----------------------------------------------------------------------
		const grunttasks =
		{
			"davanmonet-createindexes":	[	"davanmonet-createcontentindex",
											"davanmonet-createtargetindex"],

			"davanmonet-builddev":		[	"davanmonet-showconfig",
											"clean:build",
											"davanmonet-createconfigroot",
											"davanmonet-createindexes",
											"davanmonet-buildcss",
											"copy:assets"],

			"davanmonet-dev":			[	"davanmonet-builddev",
											"davanmonet-startservers:dev",
											"watch"],

			"davanmonet-watch":			["watch"],

			"davanmonet-build":			[	"clean:build",
											"davanmonet-createconfigroot",
											"davanmonet-createindexes",
											"davanmonet-buildcss",
											"copy:build",
											"copy:assets",
											"copy:preview",
											"davanmonet-createversionfile"],

			"davanmonet-dist":			[	"davanmonet-createconfigroot"
										],

			"davanmonet-":				[	"davanmonet-build",
											"davanmonet-startservers:build"]
		};

		// Add tasks dependent on settings
		// -----------------------------------------------------------------------
		if(isType(_gruntbase_.mainconfig.build,"object") &&
			_gruntbase_.mainconfig.build !== null &&
			isType(_gruntbase_.mainconfig.build.mswebdeploy,"object") &&
			_gruntbase_.mainconfig.build.mswebdeploy !== null &&
			isType(_gruntbase_.mainconfig.build.mswebdeploy.package,"string"))
		{
			grunttasks["davanmonet-build"].push("mswebdeploy");
		}

		// Bundle tasks in useful combinations
		// -----------------------------------------------------------------------
		for(const task in grunttasks)
		{
			grunt.registerTask(task,grunttasks[task]);
		}

		grunt.task.run(modifiedTaskNames);
	});
};
