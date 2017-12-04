/* jshint undef:false */
/* global module, require, process */

module.exports = function (grunt)
{
	"use strict";

	// If run as a dependency, use 
	// grunt.loadNpmTasks("davanmonet");

	grunt.loadTasks('tasks');
	
	grunt.registerTask("build-pl", ["davanmonet:build-pl"]);
	grunt.registerTask("build-dvm", ["davanmonet:build-dvm"]);
	grunt.registerTask("build-all", ["davanmonet:build-all"]);
	grunt.registerTask("build", ["davanmonet:build-all"]);
	grunt.registerTask("dev", ["davanmonet:dev"]);
	grunt.registerTask("dev-pl", ["davanmonet:dev-pl"]);
	grunt.registerTask("default", ["davanmonet:dev"]);

};
