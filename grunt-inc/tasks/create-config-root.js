module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        const grunt = _gruntbase_.grunt;
        const mainconfig = _gruntbase_.mainconfig;
        
        grunt.registerTask("davanmonet-createconfigroot","Create the configroot.json file", () =>
        {
            console.log('### helloooo config', _gruntbase_.davanmonetTaskOptions)
            if(typeof _gruntbase_.davanmonetTaskOptions !== "undefined" && typeof _gruntbase_.davanmonetTaskOptions.config !== "undefined")
            {
                grunt.file.write(mainconfig.directories.build + "/" + "config-root.json", JSON.stringify(_gruntbase_.davanmonetTaskOptions, null, "\t"));
            }
            // Save index to file

            // grunt.file.write(mainconfig.indexing.contentindexoutput, JSON.stringify(index, null, "\t"));
            // grunt.verbose.write("\n# Indexed " + totalfilecount + " files in "+ structureitems.length +" structure folders and saved it to " + mainconfig.indexing.contentindexoutput.substring(mainconfig.indexing.contentindexoutput.lastIndexOf("/")+1, mainconfig.indexing.contentindexoutput.length));
        });

    }
}