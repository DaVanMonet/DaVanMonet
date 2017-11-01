/* jshint undef:false */
/* global module, require, process */

module.exports = function (grunt)
{
	"use strict";
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig(
	{
		davanmonet:
		{
			options:
			{
				"config":"./patternlibraryconfig.json"	
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.registerTask("createindexes", ["davanmonet:createindexes"]);
	grunt.registerTask("build", ["davanmonet:build"]);
	grunt.registerTask("dev", ["davanmonet:dev"]);
	grunt.registerTask("default", ["davanmonet:dev"]);	
};
