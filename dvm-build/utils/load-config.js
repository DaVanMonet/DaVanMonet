/**
 * @file Load config files and cread the config object for DvM
 */

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const globby = require('globby');
const config_schema = require('../schema/config-schema');


const isType = (val, type) => (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)));
const getDirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory());
const loadConfigFile = file_path => (file_path.indexOf('.json') !== -1) ? require(file_path) : yaml.safeLoad(fs.readFileSync(file_path, 'utf8'));

let cachedConfig = {
    dvmConfig: null,
    webpackConfig:null
};

exports.dvmConfig = function()
{
    if(cachedConfig.dvmConfig !== null)
    {
        return cachedConfig.dvmConfig;
    }
    else
    {
        // Set path to the configFile set in package.json, or use deafult path
        var default_path = "configs/projectoptions.yml";
        var config_path = process.cwd() + '/' + (process.env.npm_package_config_configFile || default_path);

        if (fs.existsSync(config_path))
        {
            // Load JSON or YAML base confg file
            let config = new config_schema(loadConfigFile(config_path));
            if(config.isErrors())
            {
                console.error("Configuration Schema errors: ")
                
                config.getErrors().forEach(e =>
                    console.error(e.fieldSchema.name + ": " + e.errorMessage));

                throw new Error("Configuration Schema Error");
            }

            // If we have a user config file configured
            if (config.userconfig_abs().length > 0) {
                // Load JSON or YAML user config file
                const user_config = loadConfigFile(config.userconfig_abs());
                const base_config = loadConfigFile(config_path);
                
                // Merge to a single config
                config = new config_schema(_.merge(base_config, user_config));
            }
            
            // Assign structureFolders. Take structure from config if set, otherwise map file system. Save result to co config.
            config.structureFolders = config.structure !== null && config.structure.length > 0 ? config.structure : getDirs(config.directories.src).map(
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
                    { cwd: config.directories.src_abs() })
                    .map(relPath => config.directories.src_abs() + '/' + relPath); // Fix relative paths

                config.compilation.entry[target_name] = e;
            }

            // Make sure this property exists
            if(typeof config.directories.public_path !== "string")
            {
                config.directories.public_path = "/";
            }

            cachedConfig.dvmConfig = config;

            return config;
        }
        else
        {
            console.error('File does not exist ('+ config_path +')');
        }
    }
}

exports.getProjectPLConfig = function()
{
    if(cachedConfig.webpackConfig !== null)
    {
        return cachedConfig.webpackConfig;
    }
    else
    {
        // Set path to the webpackConfig file set in package.json, or use deafult path
        var default_path = process.cwd() + "/config/webpack.conf.js";
        var config_path = process.cwd() + '/' + process.env.npm_package_config_webpackConfig || default_path;

        if (fs.existsSync(config_path))
        {
            var config = require(config_path);
            cachedConfig.webpackConfig = config;
        }
        else
        {
            cachedConfig.webpackConfig = {};
        }
        

        return cachedConfig.webpackConfig;
    }
}
