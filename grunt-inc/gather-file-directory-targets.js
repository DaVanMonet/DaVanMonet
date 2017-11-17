module.exports = function(_gruntbase_) {
    
    const grunt = _gruntbase_.grunt;
    const mainconfig = _gruntbase_.mainconfig;
    const fs = require('fs');
    const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
    const isType = (val, type) => (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)));
    const hasSpecifiedStructure = (isType(mainconfig.structure,"object") && isType(mainconfig.structure.length,"number") && mainconfig.structure.length > 0);
    const structurefolders = (hasSpecifiedStructure) ? mainconfig.structure : getDirs(mainconfig.directories.src).map((folder) => { return { title:folder.charAt(0).toUpperCase() + folder.substr(1), path:folder }});
    const folderCount = structurefolders.length;
    
    // TODO: Don't hard code the compilers
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
    };
    
    //Loop through the compilers to gather up the references to the source files
    Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
    {
        const compilerOptions = mainconfig.compilation.compilers[compilerKey];

        //Only bother if we should compile the files
        if(compilerOptions.compile === true)
        {
            //Lookup all files in the specified structure

            let lookupPaths = [];
            structurefolders.forEach((folder, i) =>
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
                    const dest = mainconfig.directories.build + '/' + mainconfig.directories.cssdest + "/" + file.replace(compilerOptions.target,'.css'),
                        src = mainconfig.directories.src + "/"+ file;
                        compilationFiles[compilerOptions.taskname]["compilationTarget"][dest] = [src];
                });
            }

            //If targets have been specified we add these to the compilation files
            if(typeof compilerOptions.targets === "object")
            {
                for(let targetName in compilerOptions.targets)
                {
                    const patterns = compilerOptions.targets[targetName];
                    const targetFiles = grunt.file.expand({cwd:mainconfig.directories.src},patterns);
                    if(targetFiles.length > 0)
                    {
                        const adjustedTargetFiles = targetFiles.map(file => mainconfig.directories.src + '/' + file);
                        compilationFiles[compilerOptions.taskname]["compilationTarget"][mainconfig.directories.build + '/' + mainconfig.directories.cssdest + '/' + targetName] = adjustedTargetFiles;
                    }
                }
            }
            compilationFiles[compilerOptions.taskname]["files"] = allfiles;
        }
    });
    
    
    grunt.verbose.write("\n## Found the following files in "+ folderCount + " directories:\n");
    let watchTargets = [];
    Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
    {
		const compilerOptions = mainconfig.compilation.compilers[compilerKey];
		if (typeof compilationFiles[compilerOptions.taskname] === "object" && compilerOptions.compile === true)
        {
            grunt.verbose.write('#  '+ compilationFiles[compilerOptions.taskname].files.length + " " + compilerOptions.target + " files\n");

            //Add watch file targets to array
			structurefolders.forEach((folder, i) =>
            {
				const path = mainconfig.directories.src + "/" + folder.path;
                watchTargets.push(mainconfig.directories.src + "/" + folder.path + "/*" + compilerOptions.target);
                watchTargets.push(mainconfig.directories.src + "/" + folder.path + "/**/*" + compilerOptions.target);
            });
        }
	});
    return {watchTargets:watchTargets, compileTargets:compilationFiles, structureFolders:structurefolders};
}
