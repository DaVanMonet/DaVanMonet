/**
 * @file Load config files and cread the config object for DvM
 */

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const globby = require('globby');

const isType = (val, type) => (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)));
const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
const loadConfigFile = path => (path.indexOf('.json') !== -1) ? require(path) : yaml.safeLoad(fs.readFileSync(path, 'utf8'));

// Resolve path or set to empty string, so checks aren't needed elsewhere
function resolvePath(p)
{
    if (isType(p, "string") && p.length > 0)
    {
        return path.resolve(process.cwd(), p)
    }
    else
    {
        return "";
    }
}

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
        var default_path = process.cwd() + "/dvm-config/projectoptions.yml";
        var config_path = process.cwd() + '/' + process.env.npm_package_config_configFile || default_path;

        if (fs.existsSync(config_path))
        {
            // Load JSON or YAML base confg file
            var config = loadConfigFile(config_path);

            // Resolve some paths so we can have cleaner code elsewhere
            config.userconfig_abs = resolvePath(config.userconfig);
            config.directories.src_abs = resolvePath(config.directories.src);
            config.directories.build_abs = resolvePath(config.directories.build);
            config.directories.dist_web_abs = resolvePath(config.directories.dist_web);
            config.directories.dist_package_abs = resolvePath(config.directories.dist_package);
            config.directories.indexes_abs = resolvePath(config.directories.indexes);
            config.directories.configs_abs = resolvePath(config.directories.configs);
            config.directories.cssCopies_abs = resolvePath(config.directories.cssCopies);
            
            // Special check for user config.
            // Should default to user config file from package if not specified locally.
            // This is needed because the file is bundled at compile-time and needs to exist.
            // Moste likely this could have a nicer solution, but this will do for now.
            if(config.userconfig_abs === "")
            {
                // Hard coded path, because end user should not be able to override any of this
                config.userconfig_abs = path.resolve(__dirname, '../../configs/local-conf.json');
            }

            // If we have a user config file configured
            if (config.userconfig_abs.length > 0) {
                // Load JSON or YAML user config file
                var config_user = loadConfigFile(config.userconfig_abs);
                
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
                    { cwd: config.directories.src_abs })
                    .map(relPath => config.directories.src_abs + '/' + relPath); // Fix relative paths

                config.compilation.entry[target_name] = e;
            }

            cachedConfig = config;

            return config;
        }
        else
        {
            console.error('File does not exist ('+ config_path +')');
        }
    }
}