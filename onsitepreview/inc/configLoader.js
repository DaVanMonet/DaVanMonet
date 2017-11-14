module.exports = {
    loadJSONorYAML: function(path)
	{
        const yaml		        = require('js-yaml');
        const fs                = require('fs'); 
        if(fs.existsSync(path))
        {
            const content = fs.readFileSync(path, 'utf8');
            if(path.indexOf('.json') !== -1)
            {
                return JSON.parse(content);
            }
            else
            {
                return yaml.safeLoad(content)
            }
        }
        else
        {
            console.log('File does not exist', path);
        }

	},
    loadConfig: function ()
    {
        const _ = require('lodash');
        const fs = require('fs'); 
        const relConfDir = '../../';
        const rootConfigFilename = 'config-root.json';
        let possileConfigRootLocations = ["./", "./build/","../","../../"];
        
        const configRootLocation = possileConfigRootLocations.filter(path => fs.existsSync(path + rootConfigFilename) === true );
        if(configRootLocation.length > 0)
        {
            const rootConfigPath = configRootLocation[0] + rootConfigFilename;
        
            // Fetch root configuration
            const rootConfig = this.loadJSONorYAML(rootConfigPath);

            // Fetch project configuration
            const mainConfigPath = (typeof rootConfig.config === "string") ? rootConfig.config : 'patternlibraryconfig.json';

            
            let mainconfig = this.loadJSONorYAML(mainConfigPath);
            
            if(typeof mainconfig === "object")
            {
                // Load user config if it exists
                if (typeof mainconfig.userconfig === "string" && fs.existsSync(mainconfig.userconfig))
                {
                    const userconfig =  this.loadJSONorYAML(mainconfig.userconfig);
                    _.merge(mainconfig, userconfig);
                }
            }
            return mainconfig;
        }
        else
        {
            console.log('Unable to load root config')
            return null;
        }
    }
};