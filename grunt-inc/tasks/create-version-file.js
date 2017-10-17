module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        const grunt = _gruntbase_.grunt;
        const mainconfig = _gruntbase_.mainconfig;
        
        grunt.registerTask("createversionfile","Create the version.json file", () =>
        {
            const fs = require('fs');
            const versionFileContent = { "version":"1.0.0" }
    
            // Save index to file
            grunt.file.write(mainconfig.directories.build + "/version.json", JSON.stringify(versionFileContent, null, "\t"));
            grunt.verbose.write("\n# Created version.json file");
        });

    }
}