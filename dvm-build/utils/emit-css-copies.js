const fs = require('fs-extra');
const chalk = require('chalk');
const dvmConfig = require('./load-config')();

module.exports = function (assets, dest)
{
    // Iterate asset keys ending with .css
    for (a_key of Object.keys(assets)
        .filter(k => k.endsWith('.css')))
    {
        // Get filename from the key, which might be a longer path
        let file_name = a_key.replace(/^.*[\\\/]/, '');

        // Get file content by joining entries from the Webpack asset children array
        let file_content = assets[a_key].children.map(r => r._value).join('');
        
        // Write file to location specified in config
        // Note: Directory must exist. We will not handle nonexistent dirs here
        let file_dest = dest + '/' + file_name;
        fs.writeFile(file_dest, file_content, err =>
        {
            if (err) throw err;
            console.log(chalk.green('CSS copy emitted to ' + file_dest));
        });
    }
}