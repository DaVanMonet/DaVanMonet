module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        let mainconfig = _gruntbase_.mainconfig;
        let grunt = _gruntbase_.grunt;

        grunt.registerTask("buildcss","Build the css", () =>
        {
            let tasks = [];
            // Loop through each compiler and only run the ones set to compile
            Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
            {
                let compilerOptions = mainconfig.compilation.compilers[compilerKey];
                if (compilerOptions.compile === true)
                {
                    grunt.verbose.write('\n\n## Compile ' + compilerOptions.taskname);
                    tasks.push(compilerOptions.taskname);
                }
            });
            
            if (mainconfig.compilation.compilers.scss["lint"] === true)
            {
                tasks.push("sasslint");
            }
            if (typeof mainconfig.compilation["postcss"] === "object")
            {
                tasks.push("postcss");
            }
            if (typeof mainconfig.compilation["minifycss"] === "object")
            {
                tasks.push("cssmin");
            }
            if (mainconfig.compilation["copyCompiledCssToFolder"] === true)
            {
                tasks.push("copy:csstofolder");
            }
            //if (mainconfig.compilation["copyAssetsToFolder"] === true)
            //{
            //    tasks.push("copy:assetstofolder");
            //}
    
            if (tasks.length > 0)
            {
                grunt.verbose.write("\n# Starting CSS Build tasks, ("+ tasks.join(",") +")");
                grunt.task.run(tasks);
            }
        });

    }
}
