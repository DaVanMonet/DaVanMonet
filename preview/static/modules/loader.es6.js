(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery","js-yaml"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function ($, yaml) {

class Loader
{
    static async loadJSONorYAML(path)
    {
        var request = await fetch(path);
        if(request.status !== 404)
        {
            if(path.indexOf('.json') !== -1)
            {
                return await request.json()
            }
            else
            {
                const yamlText = await request.text();
                return yaml.safeLoad(yamlText);
            }
        }
    }
    
    static async LoadData()
    {
        if(Loader.HasLoaded)
            return; 
        const requestbase = "//" + window.location.host + "/";
        // Fetch root confg (to find out where the actual config is located)
        const rootConfig = await this.loadJSONorYAML(requestbase + 'config-root.json');
        
        
        // Fetch project configuration
        let mainConfigPath = (typeof rootConfig.config === "string") ? rootConfig.config : 'patternlibraryconfig.json';
        if(mainConfigPath.indexOf('./') === 0)
        {
            mainConfigPath = mainConfigPath.substr(2);
        }
        const mainconfig = await this.loadJSONorYAML(requestbase + mainConfigPath);

        if(typeof mainconfig !== "object")
        {
            console.error('Could not parse project config ('+ requestbase + mainConfigPath + ')');
            return;
        }
        // Look for user config and extend the default config if present
        if(typeof mainconfig.userconfig === "string" && mainconfig.userconfig.length > 0)
        {
            let userConfig =  await this.loadJSONorYAML(requestbase + mainconfig.userconfig);
            if(typeof userConfig === "object")
            {
                $.extend(true, mainconfig, userConfig);
            }
        }
        Loader.ProjectConfig = mainconfig;

        // Fetch content index
        const contentIndexPath = requestbase + Loader.ProjectConfig.directories.indexes + '/' + Loader.ProjectConfig.indexing.contentindexoutput;
        const contentIndexReq = await fetch(contentIndexPath);
        if(contentIndexReq.status !== 404)
        {
            Loader.ContentIndex = await contentIndexReq.json();
        }
        else
        {
            console.error('Unable to load Content Index ('+ contentIndexPath +')');
            return;
        }

        // Fetch css target index
        const targetIndexPath = requestbase + Loader.ProjectConfig.directories.indexes + '/' + Loader.ProjectConfig.indexing.targetindexoutput;
        const targetIndexReq = await fetch(targetIndexPath);
        if(targetIndexReq.status !== 404)
        {
            Loader.TargetIndex = await targetIndexReq.json();
        }
        else
        {
            console.error('Unable to load Target Index ('+ targetIndexPath +')')
        }
        Loader.HasLoaded = true;
    }
}

Loader.ContentIndex = {};
Loader.TargetIndex = {};
Loader.ProjectConfig = {};
Loader.HasLoaded = false;

return Loader;
}));