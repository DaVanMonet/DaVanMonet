/* jshint undef:false */
/* global module, require, process */

module.exports = function (grunt)
{
	"use strict";
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);
	grunt.loadNpmTasks('grunt-newer');
	var gruntconfig = {};
	var mainconfig = grunt.file.readJSON("./patternlibraryconfig.json");

	let compilationFiles = 
	{
		"less":
		{
			"files":[],
			"compilationTarget":{}
		},
		"sass":
		{
			"files":[],
			"compilationTarget":{}
		},
	}
	// Loop through the compilers to gather up the references to the sources files
	mainconfig.compilation.compilers.forEach((compilationOption) =>
	{
		//Only bother if we should compile the files
		if(compilationOption.compile === true)
		{
			//Lookup all files in the specified structure
			let files = grunt.file.expand(
				{cwd:mainconfig.directories.src},
				mainconfig.structure.map((folder, i) =>
				{
					return folder.path + "/*" + compilationOption.target;
				}));
			
			// If this is active all files will be compiled out to their individual css files 
			if(compilationOption.compileIndividualFiles === true)
			{
				files.forEach((file) =>
				{
					let dest = mainconfig.directories.dest + "/" + file.replace(compilationOption.target,'.css'),
						src = mainconfig.directories.src + "/"+ file;
						compilationFiles[compilationOption.taskname]["compilationTarget"][dest] = [src];
				});
			}
			compilationFiles[compilationOption.taskname]["files"] = files;
		}
	});
	grunt.verbose.write("# Found " + compilationFiles.less.files.length +" less & " + compilationFiles.sass.files.length + " sass files in "+ mainconfig.structure.length + " directories\n\n");
	

	gruntconfig["watch"] =
	{
		"options":
		{
			spawn: false,
			interval: 600,
			livereload:  mainconfig.developmentOptions.livereloadport
		},
		"markdown":
		{
			files:mainconfig.structure.map((folder, i) => { return mainconfig.directories.src + "/" + folder.path + "/*.md"; }),
			options: { reload: true },
			tasks:["create-index"]
		},
		"grunt":
		{
			files:["gruntfile.js"], 
			options: { reload: true },
			tasks:["gruntdevelopment"]
		}
	}; 

	/* ### Connect https://github.com/gruntjs/grunt-contrib-connect
	Starts webserver with preview website */
	gruntconfig["connect"] =
	{
		preview:
		{
			options:
			{
				port: mainconfig.preview.websiteport,
				base: ['./preview','./src','./build',"./"],
				keepalive:true
			}
		}
	};

	/* ### LESS https://github.com/gruntjs/grunt-contrib-less 
	Compile LESS to CSS */
	gruntconfig["less"] =
	{
		options:
		{
			"compress": false, 		//Compress output by removing some whitespaces.
			"relativeUrls": false, 	// Rewrite URLs to be relative. false: do not modify URLs.
			"sourceMap": mainconfig.compilation.sourceMaps
		},
		build:
		{
			files:compilationFiles.less.compilationTarget
		}
	};


	/* ### SASS https://github.com/gruntjs/grunt-sass 
	Compile SASS to CSS */
	gruntconfig["sass"] =
	{
		options:
		{
			sourceMap: mainconfig.compilation.sourceMaps
		},
		build:
		{
			files:compilationFiles.sass.compilationTarget
		}
	};
	

	grunt.initConfig(gruntconfig);
	grunt.registerTask("showconfig","shows the config", () =>
	{
		// this == grunt 
		grunt.verbose.write('\n\n\n\n\n\n')
		grunt.verbose.write('### mainconfig #####################################################################')
		grunt.verbose.write(mainconfig)
		grunt.verbose.write('### gruntconfig ####################################################################')
		grunt.verbose.write(gruntconfig)
		grunt.verbose.write('####################################################################################\n\n') ;
	});

	grunt.registerTask("buildcss","Build the css", () =>
	{
		let tasks = [];
		// Loop through each compiler and only run the ones set to compile
		mainconfig.compilation.compilers.forEach((compilationOption) =>
		{
			if(compilationOption.compile === true)
			{
				console.log('\n\n## Compile ' + compilationOption.taskname);
				tasks.push(compilationOption.taskname);
			}
		});
		if(tasks.length > 0)
		{
			grunt.verbose.write("\n# Starting CSS Build tasks, ("+ tasks.join(",") +")");
			grunt.task.run(tasks);
		}
		

	});
	grunt.registerTask("create-index","Create the content.json file", () =>
	{
		var matter = require('gray-matter');
		var totalfilecount = 0;
		// Look through all the structure folders
		var structureitems = mainconfig.structure.map((structureitem, i) =>
		{
			let path = mainconfig.directories.src + "/" + structureitem.path;
			// Fetch all .md files
			let files = grunt.file.expand({ cwd:path },["*.md","**/*.md"]);
			let items = files.map((filename, i) => 
			{
				// Compile file data
				let filepath = path + "/" + filename;
				var filecontent = grunt.file.read(filepath);
				let item =
				{
					"filename":filename,
					"filepath":filepath
				};
				// Parse the md file using grey-matter (to get the document data structured)
				// https://www.npmjs.com/package/gray-matter
				var parsedFile = matter(filecontent);
				if(i < 1)
					{
						console.log(parsedFile);
					}
				// We only add specified keys to the index (it would be possible to get all of the content as well)
				mainconfig.indexingOptions.keysToOutput.forEach((key) =>
				{
					if(typeof parsedFile["data"][key] === "string")
					{
						item[key] = parsedFile["data"][key];
					}
				});
				return item;
			});
			structureitem["items"] = items;
			structureitem["count"] = files.length;
			totalfilecount +=  files.length;
			return structureitem;
		});
		var index = { "structure":structureitems };
		// Save index to file
		grunt.file.write(mainconfig.indexingOptions.output, JSON.stringify(index, null, "\t"));
		grunt.verbose.write("\n# Indexed " + totalfilecount + " files in "+ structureitems.length +" structure folders and saved it to " + mainconfig.indexingOptions.output.substring(mainconfig.indexingOptions.output.lastIndexOf("/")+1, mainconfig.indexingOptions.output.length));
	});

	
	grunt.registerTask("gruntdevelopment", ["showconfig","buildcss"]);
	

	grunt.registerTask("default", ["create-index"]);
	/* Tasks:
		showconfig (will show the current configuration (grunt and application))
		buildcss (will run less & scss depending on settings)
		create-index (will create a index json file depending on the md files within structure directories)
	*/
};
