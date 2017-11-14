import _ from 'lodash';

export default class Loader
{
    static async LoadData()
    {
        if(Loader.HasLoaded)
            return;
        const requestbase = "//" + window.location.host + "/";
        // Fetch project configuration
        const configreq = await fetch(requestbase + 'patternlibraryconfig.json');
        let config = await configreq.json();

        // Look for user config and extend the default config if present
        if(typeof config.userconfig === "string" && config.userconfig.length > 0)
        {
            const userconfigrequest = await fetch(requestbase + config.userconfig);
            if(userconfigrequest.status !== 404)
            {
                let userconfig = await userconfigrequest.json();
                _.maerge(config, userconfig);
            }
        }
        Loader.ProjectConfig = config;

        // Fetch content index
        const indexreq = await fetch(requestbase + Loader.ProjectConfig.indexing.contentindexoutput);
        Loader.ContentIndex = await indexreq.json();

        // Fetch css target index
        const targetreq = await fetch(requestbase + Loader.ProjectConfig.indexing.targetindexoutput);
        Loader.TargetIndex = await targetreq.json();
        Loader.HasLoaded = true;
    }
}

Loader.ContentIndex = {};
Loader.TargetIndex = {};
Loader.ProjectConfig = {};
Loader.HasLoaded = false;

//return Loader;
//}));