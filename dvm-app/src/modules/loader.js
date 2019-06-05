import _ from 'lodash/fp/object'; // We only need the object merge function
const config_schema = require('../../../dvm-build/schema/config-schema');

export default class Loader
{
    
    static async LoadData()
    {
        if (Loader.HasLoaded)
            return;
        
        // Main config will be imported by Webpack via an appropriate loader
        let mainconfig = require(__MAIN_CONFIG_PATH__);

        if(typeof mainconfig !== "object")
        {
            console.error('Could not parse project config ('+ __MAIN_CONFIG_PATH__ + ')');
            return;
        }
        
        // Look for user config and extend the default config if present
        if(typeof __USER_CONFIG_PATH__ === "string" && __USER_CONFIG_PATH__.length > 0)
        {
            let userConfig =  require(__USER_CONFIG_PATH__);
            
            if(typeof userConfig === "object")
            {
                mainconfig = _.merge(mainconfig, userConfig);
            }
        }

        let config = new config_schema(mainconfig); 
        

        if(config.isErrors())
        {
            console.error("Configuration Schema errors: ")
            
            config.getErrors().forEach(e =>
                console.error(e.fieldSchema.name + ": " + e.errorMessage));

            throw new Error("Configuration Schema Error");
        }

        if(typeof config.project_info.pagedata_schemaversion !== "string")
        {
            config.project_info.pagedata_schemaversion = "1.0";
        }

        if(typeof config.directories.public_path !== "string")
        {
            config.directories.public_path = "/";
        }

        config.dev_mode = typeof webpackHotUpdate !== "undefined";

        Loader.ProjectConfig = config;

        // Load content index
        Loader.ContentIndex = require(__CONTENT_INDEX_PATH__);

        // Load content index
        Loader.VersionData = require('../../../dvm-build/utils/get-version').getJson();

        Loader.HasLoaded = true;
    }
}

Loader.ContentIndex = {};
Loader.TargetIndex = {};
Loader.ProjectConfig = {};
Loader.VersionData = {};
Loader.HasLoaded = false;
