/* jshint undef:false */
/* global module, require, process */

module.exports = function (grunt)
{
	"use strict";
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);
	var _ = require('lodash');
	grunt.loadNpmTasks('grunt-newer');
	
	var projectConfigurationFilePath = "./patternlibraryconfig.json";
	var gruntconfig = {};

	// Load default config and optional user config
	var mainconfig = grunt.file.readJSON(projectConfigurationFilePath);
	if(grunt.file.exists(mainconfig.userconfig)) {
		var userconfig = grunt.file.readJSON(mainconfig.userconfig);
		_.merge(mainconfig, userconfig);
	}

	const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
	
	// Optionally load tasks depending on configuration
	(typeof mainconfig.compilation["postcss"] === "object") ? grunt.loadNpmTasks('grunt-postcss') : 1;
	(typeof mainconfig.compilation["minifycss"] === "object") ? grunt.loadNpmTasks('grunt-contrib-cssmin') : 1;

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
		}
	}


	// Loop through the compilers to gather up the references to the sources files
	mainconfig.compilation.compilers.forEach((compilationOption) =>
	{
		//Only bother if we should compile the files
		if(compilationOption.compile === true)
		{
			//Lookup all files in the specified structure

			let lookupPaths = [];
			mainconfig.structure.forEach((folder, i) =>
			{
				lookupPaths.push(folder.path + "/*" + compilationOption.target);
				lookupPaths.push(folder.path + "/**/*" + compilationOption.target);
			});
			let allfiles = grunt.file.expand({cwd:mainconfig.directories.src},lookupPaths);
			
			// If this is active all files will be compiled out to their individual css files 
			if(compilationOption.compileIndividualFiles === true)
			{
				allfiles.forEach((file) =>
				{
					let dest = mainconfig.directories.cssdest + "/" + file.replace(compilationOption.target,'.css'),
						src = mainconfig.directories.src + "/"+ file;
						compilationFiles[compilationOption.taskname]["compilationTarget"][dest] = [src];
				});
			}

			//If targets have been specified we add these to the compilation files
			if(typeof compilationOption.targets === "object")
			{
				for(let targetName in compilationOption.targets)
				{
					let patterns = compilationOption.targets[targetName];
					let targetFiles = grunt.file.expand({cwd:mainconfig.directories.src},patterns);
					if(targetFiles.length > 0)
					{
						let adjustedTargetFiles = targetFiles.map(file => mainconfig.directories.src + '/' + file);
						compilationFiles[compilationOption.taskname]["compilationTarget"][mainconfig.directories.cssdest + '/' + targetName] = adjustedTargetFiles;
					}
				}
			}
			compilationFiles[compilationOption.taskname]["files"] = allfiles;
		}
	});

	

	// Loop through the structure and get all the markdown and index.json files
	var indexationTargetFiles = flatten(mainconfig.structure.map((folder, i) =>
	{
		let path = mainconfig.directories.src + "/" + folder.path;
		 return [path + "/*.md", path + '/**/*.md',path + '/index.json',path + '/**/index.json'];
	}));
	
	
	grunt.verbose.write("\n## Found the following files in "+ mainconfig.structure.length + " directories:\n");
	var stylesTargetFiles = [];
	for(let key in mainconfig.compilation.compilers)
	{
		let compilerOptions = mainconfig.compilation.compilers[key];
		if(typeof compilationFiles[compilerOptions.taskname] === "object")
		{
			grunt.verbose.write('#  '+ compilationFiles[compilerOptions.taskname].files.length + " " + compilerOptions.target + " files\n");

			//Add watch file targets to array
			
			mainconfig.structure.forEach((folder, i) =>
			{
				let path = mainconfig.directories.src + "/" + folder.path;
				stylesTargetFiles.push(mainconfig.directories.src + "/" + folder.path + "/*" + compilerOptions.target);
				stylesTargetFiles.push(mainconfig.directories.src + "/" + folder.path + "/**/*" + compilerOptions.target);
			});
		}
	}

	if(typeof mainconfig.compilation["postcss"] === "object")
	{
		/* postcss https://github.com/nDmitry/grunt-postcss
		Do adjustments to the compiled css such as autoprefixer
		*/
		gruntconfig["postcss"] =
		{
			options:
			{
				map: mainconfig.compilation.postcss.map,
				processors: mainconfig.compilation.postcss.processors.map( (processor) => {
					return require(processor.name)(processor.options);
				})
			},
			build:
			{
				src: mainconfig.directories.cssdest + '/' + '*.css'
			}
		};
	}

	if(typeof mainconfig.compilation["minifycss"] === "object")
	{
		/* cssmin https://github.com/gruntjs/grunt-contrib-cssmin
		Minify the finished css files
		For more options: https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
		*/
		gruntconfig["ccsmin"] =
		{
			options:
			{
				report:'min',
				sourceMap:mainconfig.compilation.sourceMaps
			},
			build:
			{
				src: mainconfig.directories.cssdest + '/' + '*.css'
			}
		};
	}

	gruntconfig["watch"] =
	{
		"options":
		{
			spawn: false,
			interval: 600,
			livereload:  mainconfig.developmentenvironment.livereloadport
		},
		"indexation":
		{
			files:flatten(mainconfig.structure.map((folder, i) =>
			{
				let path = mainconfig.directories.src + "/" + folder.path;
				 return [path + "/*.md", path + '/**/*.md',path + '/index.json',path + '/**/index.json'];
			})),
			options: { reload: true },
			tasks:["createindex"]
		},
		"styles":
		{
			files:stylesTargetFiles,
			options: { reload: true },
			tasks:["buildcss"]
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
		livereload:
		{
			options:
			{
				port: mainconfig.developmentenvironment.devwebsiteport,
				base: _.union(['./preview', "./"], mainconfig.directories),	
				keepalive:false //Set to true if not running watch
			}
		},
		build:
		{
			options:
			{
				port: mainconfig.developmentenvironment.buildwebsiteport,
				base: ['./build'],
				keepalive:true //Set to true if not running watch
			}
		}
	};

	/* ### Copy https://github.com/gruntjs/grunt-contrib-copy
	Copies content, used for adding things to the build folder*/
	gruntconfig["copy"] =
	{
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
				src: projectConfigurationFilePath,
				dest: mainconfig.directories.build
			},
			{	/* Copy over the index file */
				expand:true,
				src: mainconfig.indexing.output,
				dest: mainconfig.directories.build
			},
			{	/* Copy over the source files */
				expand:true,
				src: mainconfig.directories.src + "/**",
				dest: mainconfig.directories.build
			}]
		}
	};

	/* ### Clean https://github.com/gruntjs/grunt-contrib-clean
	Clears out the build folder */
	gruntconfig["clean"] =
	{
		build:
		{
			src:[mainconfig.directories.build + "/*"]
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
		console.log('\n\n\n\n\n\n')
		console.log('### mainconfig #####################################################################')
		console.log(mainconfig)
		console.log('### gruntconfig ####################################################################')
		console.log(gruntconfig)
		console.log('### compilationFiles ####################################################################')
		console.log(JSON.stringify(compilationFiles))
		console.log('####################################################################################\n\n') ;
	});

	grunt.registerTask("buildcss","Build the css", () =>
	{
		let tasks = [];
		// Loop through each compiler and only run the ones set to compile
		mainconfig.compilation.compilers.forEach((compilationOption) =>
		{
			if(compilationOption.compile === true)
			{
				grunt.verbose.write('\n\n## Compile ' + compilationOption.taskname);
				tasks.push(compilationOption.taskname);
			}
		});
		
		if(typeof mainconfig.compilation["postcss"] === "object")
		{
			tasks.push("postcss");
		}
		if(typeof mainconfig.compilation["minifycss"] === "object")
		{
			tasks.push("cssmin");
		}

		if(tasks.length > 0)
		{
			grunt.verbose.write("\n# Starting CSS Build tasks, ("+ tasks.join(",") +")");
			grunt.task.run(tasks);
		}
	});
	grunt.registerTask("createindex","Create the content.json file", () =>
	{
		var totalfilecount = 0;
		const matter = require('gray-matter');
		const fs = require('fs')
		const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
		// parseFileMetadata: Parse each file and save the relevant metadata
		const parseFileMetadata = (filepath, fileindex) =>
		{
			var filecontent = grunt.file.read(mainconfig.directories.src + "/" + filepath);
			// Set basic metadata
			let filemetadata =
			{
				"filename":filepath.substring(filepath.lastIndexOf("/")+1, filepath.length),
				"filepath": filepath,
				"shortpath": filepath.replace(".md",""),
				"longpath": mainconfig.directories.src + "/" + filepath,
				"type":"file"
			};
			totalfilecount++;
			// Parse the md file using grey-matter (to get the document data structured)
			// https://www.npmjs.com/package/gray-matter
			var parsedFile = matter(filecontent);
			mainconfig.indexing.keysToOutput.forEach((key) =>
			{
				if(typeof parsedFile["data"][key] === "string")
				{
					// Only save metadata that's specified in the project configuration
					filemetadata[key] = parsedFile["data"][key];
				}
			});
			//Return the files metadata
			return filemetadata;
		};

		const parseDirectoryMetadata = (directoryParentPath, directoryName, directoryindex) =>
		{
			directoryParentPath = (directoryParentPath.length > 0) ? directoryParentPath + "/" : directoryParentPath;
			let directoryPath = mainconfig.directories.src + "/" + directoryParentPath + directoryName;
			// Fetch all child directories in this directory
			let directories = getDirs(directoryPath);
			// Fetch all MD files in this directory
			let files = grunt.file.expand({ cwd:mainconfig.directories.src },[directoryParentPath + directoryName +"/*.md"]);
			// Set rudamentary metadata. We capitalize the foldername, it might be overridden if there is a index.json file.
			let directoryMetadata =
			{
				"title":directoryName.charAt(0).toUpperCase() + directoryName.slice(1).toLowerCase(),
				"shortpath": directoryParentPath + directoryName,
				"longpath": directoryPath,
				"items":[],
				"filecount":files.length,
				"directorycount":directories.length,
				"type":"directory",
			};
			// If the folder has a index.json metadata file we will extend this folders metadata with that information
			if(grunt.file.isFile(directoryPath + "/index.json"))
			{
				var metadata = grunt.file.readJSON(directoryPath + "/index.json");
				Object.assign(directoryMetadata, metadata);
			}

			// Parse the metadata for all .md files within this folder
			let filesdata = files.map(parseFileMetadata);
			directoryMetadata["items"] = directoryMetadata["items"].concat(filesdata);
			// Parse the metadata for all child folders (this makes this function recursive)
			var directoriesdata = directories.map(parseDirectoryMetadata.bind(null, directoryParentPath + directoryName));
			directoryMetadata["items"] = directoryMetadata["items"].concat(directoriesdata);
			// Return this directories metadata
			return directoryMetadata;
		};

		// Loop through the folders specified in the projects configuration
		var structureitems = mainconfig.structure.map((structureitem, index) =>
		{
			let directoryMetadata = parseDirectoryMetadata("", structureitem["path"], index);
			directoryMetadata["title"] = structureitem["title"];
			return directoryMetadata;
		});

		var index = { "structure":structureitems };

		// Save index to file
		grunt.file.write(mainconfig.indexing.output, JSON.stringify(index, null, "\t"));
		grunt.verbose.write("\n# Indexed " + totalfilecount + " files in "+ structureitems.length +" structure folders and saved it to " + mainconfig.indexing.output.substring(mainconfig.indexing.output.lastIndexOf("/")+1, mainconfig.indexing.output.length));
	});

	
	grunt.registerTask("dev", ["showconfig","createindex","buildcss"]);
	grunt.registerTask("previewdev", ["dev","connect:livereload","watch"]);

	grunt.registerTask("basicbuild", ["clean:build","createindex","buildcss","copy:build"]);
	grunt.registerTask("build", ["basicbuild","copy:preview"]);
	grunt.registerTask("previewbuild", ["build","copy:preview","connect:build"]);
	grunt.registerTask("default", ["previewdev"]);
	/* Tasks:
		showconfig (will show the current configuration (grunt configuration, project configuration and what folders will be indexed))
		buildcss (will run less & scss depending on settings)
		createindex (will create a index json file depending on the md files within structure directories)
	*/
};
