module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        let grunt = _gruntbase_.grunt;
        let mainconfig = _gruntbase_.mainconfig;
        let _ = require('lodash');

        grunt.registerTask("createtargetindex","Create the content.json file", () =>
        {
            // Loop through the structure and get all the markdown and index.json files
            let indexationTargetFiles = _.flatten(mainconfig.structure.map((folder, i) =>
            {
                let path = mainconfig.directories.src + "/" + folder.path;
                return [path + "/*.md", path + '/**/*.md',path + '/index.json',path + '/**/index.json'];
            }));
    
            let filecontent = 
            {
                items:[]
            };
            Object.keys(mainconfig.compilation.compilers).forEach((compilerKey) =>
            {
                const compilerOptions = mainconfig.compilation.compilers[compilerKey];
                if (typeof compilerOptions.targets === "object")
                {
                    Object.keys(compilerOptions.targets).forEach((targetKey) =>
                    {
                        filecontent.items.push(mainconfig.directories.cssdest + "/" + targetKey);
                    });
                }
            });
            grunt.file.write(mainconfig.indexing.targetindexoutput, JSON.stringify(filecontent, null, "\t"));
        });
    }
}