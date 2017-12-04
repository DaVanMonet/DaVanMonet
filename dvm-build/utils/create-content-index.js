const globby = require('globby');
const path = require('path');
const fs = require('fs-extra');
const matter = require('gray-matter');
const chalk = require('chalk');

const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());

module.exports = function()
{
    const config = require('./load-config').dvmConfig();
    let totalfilecount = 0;

    console.log(chalk.magenta(">> Creating content index file..."));
    
    // parseFileMetadata: Parse each file and save the relevant metadata
    const parseFileMetadata = (filepath, fileindex) =>
    {
        const filecontent = fs.readFileSync(config.directories.src + "/" + filepath);
        
        // Set basic metadata
        let filemetadata =
        {
            "filename": filepath.substring(filepath.lastIndexOf("/")+1, filepath.length),
            "filepath": filepath,
            "shortpath": filepath.replace(".md",""),
            "longpath": config.directories.src + "/" + filepath,
            "type":"file"
        };
        totalfilecount++;
        
        // Parse the md file using grey-matter (to get the document data structured)
        // https://www.npmjs.com/package/gray-matter
        const parsedFile = matter(filecontent);
        config.indexing.keysToOutput.forEach((key) =>
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
        directoryParentPath = ( directoryParentPath.length > 0 ) ? directoryParentPath + "/" : directoryParentPath;
        const directoryPath = config.directories.src + "/" + directoryParentPath + directoryName;
        
        // Fetch all child directories in this directory
        const directories = getDirs(directoryPath);
        
        // Fetch all MD files in this directory
        // Files should be relative path...?
        const files = globby.sync(
            [ directoryParentPath + directoryName +"/*.md" ],
            { cwd: config.directories.src }
        );

        // Set rudamentary metadata. We capitalize the foldername, it might be overridden if there is a index.json file.
        let directoryMetadata =
        {
            "title": directoryName.charAt(0).toUpperCase() + directoryName.slice(1).toLowerCase(),
            "shortpath": directoryName,
            "longpath": directoryPath,
            "items": [],
            "filecount": files.length,
            "directorycount": directories.length,
            "type":"directory",
        };
        
        // If the folder has a index.json metadata file we will extend this folders metadata with that information
        let indexFile = directoryPath + "/index.json";
        if (fs.existsSync(indexFile) && fs.lstatSync(indexFile).isFile())
        {
            const metadata = require(path.resolve(indexFile));
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
    const structureitems = config.structureFolders.toArray().map((structureitem, index) =>
    {
        //console.log("StructureItem: ", structureitem);
        let directoryMetadata = parseDirectoryMetadata("", structureitem["path"], index);
        directoryMetadata["title"] = structureitem["title"];
        return directoryMetadata;
    });
    
    const index = { "structure": structureitems };

    // Save index to file
    //if(fs.existsSync(config.directories.indexes) === false)
    //    fs.mkdirSync(config.directories.indexes);
    
    fs.outputFileSync(
        config.directories.indexes + '/'+ config.indexing.contentIndexOutput,
        JSON.stringify(index, null, "\t"));
    
    console.log(chalk.green(">> ...Done!"));
    console.log(chalk.yellow(
        "\n# Indexed " + totalfilecount
        + " files in " + structureitems.length
        + " structure folders and saved it to " + config.directories.indexes + '/'+ config.indexing.contentIndexOutput.substring(config.indexing.contentIndexOutput.lastIndexOf("/") + 1,
        config.indexing.contentIndexOutput.length)));
}
