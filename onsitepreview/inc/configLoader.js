module.exports = {

loadConfig: function () {
    const _ = require('lodash');
    const fs = require('fs'); 
    const requireUncached = require('require-uncached');
    const relConfDir = '../../';

    const mainconfig = requireUncached(relConfDir + 'patternlibraryconfig.json');

    // TODO: fs uses CWD as base, while require uses the path of this current file as base. Come up with some way of harmonizing base paths.
    if (fs.existsSync('user-conf.json')) { 
        const userconfig = requireUncached(relConfDir + 'user-conf.json');
        _.merge(mainconfig, userconfig);
    }

    return mainconfig;
},

};