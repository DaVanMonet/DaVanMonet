const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const dvmConfig = require('../utils/load-config').dvmConfig();

module.exports = function(chunks, writeFile = true)
{
    console.log(chalk.magenta(">> Creating target index file"));
    
    let targetIndex = { items: [] };

    // Add css targets
    Object.keys(chunks)
        .filter(c => c.indexOf('.css') > -1)
        .forEach(target => targetIndex.items.push(path.posix.join(dvmConfig.directories.css_subDir, target)));

    // Add other targets
    Object.keys(chunks)
        .filter(c => c.indexOf('.css') === -1)
        .forEach(target => targetIndex.items.push(path.posix.join(dvmConfig.directories.js_subDir, target)));
    
    // Save index to file
    if (writeFile)
     fs.writeJsonSync(path.resolve(process.cwd(), dvmConfig.directories.dist_web + '/' + dvmConfig.indexing.targetIndexOutput), targetIndex);

     return targetIndex;
}
