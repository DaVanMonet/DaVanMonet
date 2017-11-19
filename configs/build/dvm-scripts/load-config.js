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

module.exports = function() {

    // Set path to the configFile set in package.json, or use deafult path
    var defaultPath = process.cwd() + "/configs/projectoptions.yml";
    var path = process.cwd() + '/' + process.env.npm_package_config_configFile || defaultPath;

    if (fs.existsSync(path))
    {
        // Load JSON or YAML base confg file
        var config_base = loadConfigFile(path);
        
        // Load JSON or YAML user confg file
        var config_user = loadConfigFile(process.cwd() + '/' + config_base.userconfig);
        
        // Merge to a single config
        var config = _.merge(config_base, config_user);
        
        // Assign structureFolders. Take structure from config if set, otherwise map file system. Save result to co config.
        const hasSpecifiedStructure = isType(config.structure, "object") && isType(config.structure.length, "number") && config.structure.length > 0;
        config.structureFolders = (hasSpecifiedStructure) ? config.structure : getDirs(config.directories.src).map(
            folder => { 
                return {
                    title: folder.charAt(0).toUpperCase() + folder.substr(1),
                    path: folder
                }
            });

        // Expand compiler target globs using globby
        // https://github.com/sindresorhus/globby
        for (let target_name of Object.keys(config.compilation.targets)) {
            config.compilation.targets[target_name] = globby.sync(
                config.compilation.targets[target_name].map(
                    glob => process.cwd() + '/' + config.directories.src + '/' + glob));
        }

        return config;
    }
    else
    {
        console.error('File does not exist ('+ path +')');
    }

}