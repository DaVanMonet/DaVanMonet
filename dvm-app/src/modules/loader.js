import _ from 'lodash/fp/object'; // We only need the objet merge function

export default class Loader
{
    
    static LoadData()
    {
        if (Loader.HasLoaded)
            return;
        
        // Main config will be imported by Webpack via an appropriate loader
        const mainconfig = require(__MAIN_CONFIG_PATH__);

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
                _.merge(mainconfig, userConfig);
            }
        }
        Loader.ProjectConfig = mainconfig;

        // Load content index
        Loader.ContentIndex = require(__CONTENT_INDEX_PATH__);

        Loader.HasLoaded = true;
    }
}

Loader.ContentIndex = {};
Loader.TargetIndex = {};
Loader.ProjectConfig = {};
Loader.HasLoaded = false;
