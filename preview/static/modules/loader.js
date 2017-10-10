(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function ($) {

class Loader
{
    static async LoadData()
    {
        if(Loader.HasLoaded)
            return;

        // Fetch project configuration
        const configreq = await fetch('./patternlibraryconfig.json');
        let config = await configreq.json();

        // Look for user config and extend the default config if present
        if(typeof config.userconfig === "string" && config.userconfig.length > 0)
        {
            const userconfigrequest = await fetch(config.userconfig);
            if(userconfigrequest.status !== 404)
            {
                let userconfig = await userconfigrequest.json();
                $.extend(true, config, userconfig);
            }
        }
        Loader.ProjectConfig = config;

        // Fetch content index
        const indexreq = await fetch(Loader.ProjectConfig.indexing.contentindexoutput);
        Loader.ContentIndex = await indexreq.json();

        // Fetch css target index
        const targetreq = await fetch(Loader.ProjectConfig.indexing.targetindexoutput);
        Loader.TargetIndex = await targetreq.json();
        Loader.HasLoaded = true;
    }
}

Loader.ContentIndex = {};
Loader.TargetIndex = {};
Loader.ProjectConfig = {};
Loader.HasLoaded = false;

return Loader;
}));