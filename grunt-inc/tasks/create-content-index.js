module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        const grunt = _gruntbase_.grunt;
        const mainconfig = _gruntbase_.mainconfig;
        
        grunt.registerTask("davanmonet-createcontentindex","Create the content.json file", () =>
        {
            const matter = require('gray-matter');
            const fs = require('fs');
            const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
            
            let totalfilecount = 0;
            
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
                    if (typeof parsedFile["data"][key] === "string")
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
                if (grunt.file.isFile(directoryPath + "/index.json"))
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
            
            const structureitems = _gruntbase_.fileAndDirectoryTargets.structureFolders.map((structureitem, index) =>
            {
                let directoryMetadata = parseDirectoryMetadata("", structureitem["path"], index);
                directoryMetadata["title"] = structureitem["title"];
                return directoryMetadata;
            });
           
            const index = { "structure":structureitems };
    
            // Save index to file
            grunt.file.write(mainconfig.directories.indexes + '/'+ mainconfig.indexing.contentindexoutput, JSON.stringify(index, null, "\t"));
            grunt.verbose.write("\n# Indexed " + totalfilecount + " files in "+ structureitems.length +" structure folders and saved it to " + mainconfig.directories.indexes + '/'+ mainconfig.indexing.contentindexoutput.substring(mainconfig.indexing.contentindexoutput.lastIndexOf("/")+1, mainconfig.indexing.contentindexoutput.length));
        });

    }
}