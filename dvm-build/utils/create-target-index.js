const path = require('path');
const fs = require('fs-extra');
const dvmConfig = require('../utils/load-config').dvmConfig();



module.exports = function(chunks)
{
    console.log("   >> Creating target index file");
    
    let targetIndex = { items: [] };
    Object.keys(chunks).forEach(target => targetIndex.items.push(target));
    // Save index to file
    fs.writeJsonSync(path.resolve(process.cwd(), dvmConfig.directories.dist_web + '/targetindex.json'), targetIndex);
}
