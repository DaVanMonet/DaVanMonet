/* jshint undef:false */
/* global module, require, process */

module.exports = function (grunt)
{
	"use strict";
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);
	let _ = require('lodash');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-express-server');
	
	let projectConfigurationFilePath = "./patternlibraryconfig.json";
	let gruntconfig = {};

	// Load default config and optional user config
	let mainconfig = grunt.file.readJSON(projectConfigurationFilePath);
	if(grunt.file.exists(mainconfig.userconfig))
	{
		let userconfig = grunt.file.readJSON(mainconfig.userconfig);
		_.merge(mainconfig, userconfig);
	}

	const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
	
	// Optionally load tasks depending on configuration
	(typeof mainconfig.compilation["postcss"] === "object") ? grunt.loadNpmTasks('grunt-postcss') : 1;
	(typeof mainconfig.compilation["minifycss"] === "object") ? grunt.loadNpmTasks('grunt-contrib-cssmin') : 1;
	(mainconfig.compilation.compilers.scss["lint"] === true) ? grunt.loadNpmTasks('grunt-sass-lint') : 1;

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


	//Loop through the compilers to gather up the references to the sources files
	Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
	{
		let compilerOptions = mainconfig.compilation.compilers[compilerKey];

		//Only bother if we should compile the files
		if(compilerOptions.compile === true)
		{
			//Lookup all files in the specified structure

			let lookupPaths = [];
			mainconfig.structure.forEach((folder, i) =>
			{
				lookupPaths.push(folder.path + "/*" + compilerOptions.target);
				lookupPaths.push(folder.path + "/**/*" + compilerOptions.target);
			});
			let allfiles = grunt.file.expand({cwd:mainconfig.directories.src},lookupPaths);
			
			// If this is active all files will be compiled out to their individual css files 
			if(compilerOptions.compileIndividualFiles === true)
			{
				allfiles.forEach((file) =>
				{
					let dest = mainconfig.directories.build + '/' + mainconfig.directories.cssdest + "/" + file.replace(compilerOptions.target,'.css'),
						src = mainconfig.directories.src + "/"+ file;
						compilationFiles[compilerOptions.taskname]["compilationTarget"][dest] = [src];
				});
			}

			//If targets have been specified we add these to the compilation files
			if(typeof compilerOptions.targets === "object")
			{
				for(let targetName in compilerOptions.targets)
				{
					let patterns = compilerOptions.targets[targetName];
					let targetFiles = grunt.file.expand({cwd:mainconfig.directories.src},patterns);
					if(targetFiles.length > 0)
					{
						let adjustedTargetFiles = targetFiles.map(file => mainconfig.directories.src + '/' + file);
						compilationFiles[compilerOptions.taskname]["compilationTarget"][mainconfig.directories.build + '/' + mainconfig.directories.cssdest + '/' + targetName] = adjustedTargetFiles;
					}
				}
			}
			compilationFiles[compilerOptions.taskname]["files"] = allfiles;
		}
	});

	

	// Loop through the structure and get all the markdown and index.json files
	let indexationTargetFiles = flatten(mainconfig.structure.map((folder, i) =>
	{
		let path = mainconfig.directories.src + "/" + folder.path;
		 return [path + "/*.md", path + '/**/*.md',path + '/index.json',path + '/**/index.json'];
	}));
	
	
	grunt.verbose.write("\n## Found the following files in "+ mainconfig.structure.length + " directories:\n");
	let stylesTargetFiles = [];
	Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
	{
		let compilerOptions = mainconfig.compilation.compilers[compilerKey];
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
	});

	if(mainconfig.compilation.compilers.scss["lint"] === true)
	{
		/* sasslint https://github.com/sasstools/sass-lint
		Verify code style in scss sources
		*/
		gruntconfig["sasslint"] = {
			options: {
				//outputFile: 'linters/sass-lint.html'
			},
			target: [mainconfig.directories.src + '/**/*.scss'] // Lint all the files
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
				src: mainconfig.directories.build + '/' + mainconfig.directories.cssdest + '/' + '*.css'
			}
		};
	}

	if(typeof mainconfig.compilation["minifycss"] === "object")
	{
		/* cssmin https://github.com/gruntjs/grunt-contrib-cssmin
		Minify the finished css files
		For more options: https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
		*/
		gruntconfig["cssmin"] =
		{
			options:
			{
				report: mainconfig.compilation.minifycss.report,
				level: mainconfig.compilation.minifycss.level,
				sourceMap:mainconfig.compilation.sourceMaps
			},
			target:
			{
				files: [{
					expand: true,
					cwd: mainconfig.directories.build + '/' + mainconfig.directories.cssdest,
					src: ['*.css', '!*.min.css'],
					dest: mainconfig.directories.build + '/' + mainconfig.directories.cssdest,
					ext: '.min.css'
				}]
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
			tasks:["createindexes"]
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
				base: _.union(['./preview', "./", mainconfig.directories.build]),
				keepalive:false, //Set to true if not running watch
				open:true,
				middleware: function(connect, options, middlewares)
				{
					// inject a custom middleware into the array of default middlewares
					middlewares.unshift(function(req, res, next)
					{
						if(req.url.indexOf('.vue') !== -1)
						{
							//res.setHeader('Content-Type', 'application/json'); 
							res.setHeader('Content-Type', 'text/html; charset=UTF-8'); 
						}
						return next();
					});
		  
					return middlewares;
				}
			}
		},
		build:
		{
			options:
			{
				port: mainconfig.developmentenvironment.buildwebsiteport,
				base: [mainconfig.directories.build],
				keepalive:true //Set to true if not running watch
			}
		}
	};

	gruntconfig['express'] =
	{
		options: {
		  // Override defaults here 
		},
		onsitepreview: {
		  options: {
			script: mainconfig.directories.onsitepreview + '/server.js'
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
		Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
		{
			let compilerOptions = mainconfig.compilation.compilers[compilerKey];
			if(compilerOptions.compile === true)
			{
				grunt.verbose.write('\n\n## Compile ' + compilerOptions.taskname);
				tasks.push(compilerOptions.taskname);
			}
		});
		
		if(mainconfig.compilation.compilers.scss["lint"] === true)
		{
			tasks.push("sasslint");
		}
		if(typeof mainconfig.compilation["postcss"] === "object")
		{
			tasks.push("postcss");
		}
		if(typeof mainconfig.compilation["minifycss"] === "object")
		{
			tasks.push("cssmin");
		}
		if(mainconfig.compilation["copyCompiledCssToFolder"] === true)
		{
			tasks.push("copy:csstofolder");
		}

		if(tasks.length > 0)
		{
			grunt.verbose.write("\n# Starting CSS Build tasks, ("+ tasks.join(",") +")");
			grunt.task.run(tasks);
		}
	});

	grunt.registerTask("createtargetindex","Create the content.json file", () =>
	{
		let filecontent = 
		{
			items:[]
		};
		Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
		{
			const compilerOptions = mainconfig.compilation.compilers[compilerKey];
			if(typeof compilerOptions.targets === "object")
			{
				Object.keys(compilerOptions.targets).forEach((targetKey) =>
				{
					filecontent.items.push(mainconfig.directories.cssdest + "/" + targetKey);
				});
			}
		});
		grunt.file.write(mainconfig.indexing.targetindexoutput, JSON.stringify(filecontent, null, "\t"));
	});
	grunt.registerTask("createcontentindex","Create the content.json file", () =>
	{
		let totalfilecount = 0;
		const matter = require('gray-matter');
		const fs = require('fs')
		const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
		// parseFileMetadata: Parse each file and save the relevant metadata
		const parseFileMetadata = (filepath, fileindex) =>
		{
			const filecontent = grunt.file.read(mainconfig.directories.src + "/" + filepath);
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
			const parsedFile = matter(filecontent);
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
			const directoryPath = mainconfig.directories.src + "/" + directoryParentPath + directoryName;
			// Fetch all child directories in this directory
			const directories = getDirs(directoryPath);
			// Fetch all MD files in this directory
			const files = grunt.file.expand({ cwd:mainconfig.directories.src },[directoryParentPath + directoryName +"/*.md"]);
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
				const metadata = grunt.file.readJSON(directoryPath + "/index.json");
				Object.assign(directoryMetadata, metadata);
			}

			// Parse the metadata for all .md files within this folder
			const filesdata = files.map(parseFileMetadata);
			directoryMetadata["items"] = directoryMetadata["items"].concat(filesdata);
			// Parse the metadata for all child folders (this makes this function recursive)
			const directoriesdata = directories.map(parseDirectoryMetadata.bind(null, directoryParentPath + directoryName));
			directoryMetadata["items"] = directoryMetadata["items"].concat(directoriesdata);
			// Return this directories metadata
			return directoryMetadata;
		};

		// Loop through the folders specified in the projects configuration
		const structureitems = mainconfig.structure.map((structureitem, index) =>
		{
			let directoryMetadata = parseDirectoryMetadata("", structureitem["path"], index);
			directoryMetadata["title"] = structureitem["title"];
			return directoryMetadata;
		});

		const index = { "structure":structureitems };

		// Save index to file
		grunt.file.write(mainconfig.indexing.contentindexoutput, JSON.stringify(index, null, "\t"));
		grunt.verbose.write("\n# Indexed " + totalfilecount + " files in "+ structureitems.length +" structure folders and saved it to " + mainconfig.indexing.contentindexoutput.substring(mainconfig.indexing.contentindexoutput.lastIndexOf("/")+1, mainconfig.indexing.contentindexoutput.length));
	});

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
