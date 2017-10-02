(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function ($) {

class ConfigLoader
{
    static async LoadConfig() {
        if(ConfigLoader.HasLoaded)
            return;

        const configreq = await fetch('./patternlibraryconfig.json');
        const config = await configreq.json();

        // Look for user config and extend the default config if present
        if(typeof config.userconfig === "string" && config.userconfig.length > 0)
        {
            const userconfigrequest = await fetch(config.userconfig);
            if(userconfigrequest.status !== 404) {
                let userconfig = await userconfigrequest.json();
                $.extend(true, config, userconfig);
            }
        }

        ConfigLoader.ProjectConfig = config;
        ConfigLoader.HasLoaded = true;
    }
}

ConfigLoader.ProjectConfig = {};
ConfigLoader.HasLoaded = false;

return ConfigLoader;
}));