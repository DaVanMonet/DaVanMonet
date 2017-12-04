'use strict';
module.exports = function(grunt) {
	const davanmonetOptions = grunt.config.get("davanmonet.options");
	grunt.loadNpmTasks('grunt-run');
	
	grunt.config.merge({
		run:
		{
			"davanmonet-dev":
			{
				options: { wait: true },
				exec: "npm run dev"
			},
			"davanmonet-build-dvm":
			{
				options: { wait: true },
				exec: "npm run build-dvm"
			},
			"davanmonet-build-pl":
			{
				options: { wait: true },
				exec: "npm run build-pl"
			},
			"davanmonet-build-all":
			{
				options: { wait: true },
				exec: "npm run build-all"
			},
			"davanmonet-dev-pl":
			{
				options: { wait: true },
				exec: "npm run dev-pl"
			},
			"davanmonet-dev-debug":
			{
				options: { wait: true },
				exec: "npm run dev-debug"
			},
		}
	});

	grunt.registerTask('davanmonet', 'A pattern library thingie',  function ()
	{
		let taskOptions = this.options();   

		let taskNames = this.args;
		if(taskNames.length === 0)
		{
			taskNames = ["dev"];
		}
		let modifiedTaskNames = taskNames.map(task => "davanmonet-" + task);
		grunt.task.run('run:' + modifiedTaskNames);
	});
};
