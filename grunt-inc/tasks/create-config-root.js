module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        const grunt = _gruntbase_.grunt;
        const mainconfig = _gruntbase_.mainconfig;
        
        grunt.registerTask("davanmonet-createconfigroot","Create the configroot.json file", () =>
        {
            if(typeof _gruntbase_.davanmonetTaskOptions !== "undefined" && typeof _gruntbase_.davanmonetTaskOptions.config !== "undefined")
            {
                grunt.file.write(mainconfig.directories.build + "/" + "config-root.json", JSON.stringify(_gruntbase_.davanmonetTaskOptions, null, "\t"));
            }
        });

    }
}