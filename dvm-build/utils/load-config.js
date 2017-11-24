/**
 * @file Load config files and cread the config object for DvM
 */

const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const globby = require('globby');

const isType = (val, type) => (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)));
const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
const loadConfigFile = path => (path.indexOf('.json') !== -1) ? require(path) : yaml.safeLoad(fs.readFileSync(path, 'utf8'));

let cachedConfig = null;

module.exports = function()
{
    if(cachedConfig !== null)
    {
        return cachedConfig;
    }
    else
    {
        // Set path to the configFile set in package.json, or use deafult path
        var defaultPath = process.cwd() + "/dvm-config/projectoptions.yml";
        var path = process.cwd() + '/' + process.env.npm_package_config_configFile || defaultPath;

        if (fs.existsSync(path))
        {
            // Load JSON or YAML base confg file
            var config = loadConfigFile(path);
            
            // If we have a user config file configured
            if (isType(config.userconfig, "string")) {
                // Load JSON or YAML user config file
                var config_user = loadConfigFile(process.cwd() + '/' + config.userconfig);
                
                // Merge to a single config
                var config = _.merge(config, config_user);
            }
            
            // Assign structureFolders. Take structure from config if set, otherwise map file system. Save result to co config.
            const hasSpecifiedStructure = isType(config.structure, "object") && isType(config.structure.length, "number") && config.structure.length > 0;
            config.structureFolders = (hasSpecifiedStructure) ? config.structure : getDirs(config.directories.src).map(
                folder => { 
                    return {
                        title: folder.charAt(0).toUpperCase() + folder.substr(1),
                        path: folder
                    }
                });
            
            // Expand targets as entries
            config.compilation.entry = {};
            for (target_name of Object.keys(config.compilation.targets))
            {
                // Glob all the globs
                let e = globby.sync(config.compilation.targets[target_name],
                    { cwd: process.cwd() + '/' + config.directories.src })
                    .map(relPath => process.cwd() + '/' + config.directories.src + '/' + relPath); // Fix relative paths

                config.compilation.entry[target_name] = e;
            }

            cachedConfig = config;

            return config;
        }
        else
        {
            console.error('File does not exist ('+ path +')');
        }
    }
}