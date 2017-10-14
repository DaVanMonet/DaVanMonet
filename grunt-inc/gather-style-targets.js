module.exports = function(_gruntbase_) {
    
    let grunt = _gruntbase_.grunt;
    let mainconfig = _gruntbase_.mainconfig;
    
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
    }


    //Loop through the compilers to gather up the references to the source files
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
    
    
    grunt.verbose.write("\n## Found the following files in "+ mainconfig.structure.length + " directories:\n");
    let watchTargets = [];
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
                watchTargets.push(mainconfig.directories.src + "/" + folder.path + "/*" + compilerOptions.target);
                watchTargets.push(mainconfig.directories.src + "/" + folder.path + "/**/*" + compilerOptions.target);
            });
        }
    });

    return {watchTargets:watchTargets, compileTargets:compilationFiles};
}