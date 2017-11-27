const fs = require('fs-extra');
const chalk = require('chalk');
const dvmConfig = require('./load-config')();

module.exports = function (assets, dests)
{
    // Set destination to an array and iterate
    const destinations = (typeof dests === "string") ? [dests] : dests;

    // Iterate asset keys ending with .css
    for (a_key of Object.keys(assets)
        .filter(k => k.endsWith('.css')))
    {

        // Get filename from the key, which might be a longer path
        const file_name = a_key.replace(/^.*[\\\/]/, '');

        // Get file content by joining entries from the Webpack asset children array
        const children = assets[a_key].children || [assets[a_key]];
        let file_content = children.map(r => r._value).join('');
        
        // Iterate destinations
        destinations.forEach((dest) => {
            // // Write file to location specified in config
            // // Note: Directory must exist. We will not handle nonexistent dirs here
            const file_dest = dest + '/' + file_name;
            fs.outputFile(file_dest, file_content, err =>
            {
                if (err) throw err;
                console.log(chalk.green('CSS copy emitted to ' + file_dest));
            });
        })
    }
}