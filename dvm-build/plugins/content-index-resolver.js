const fs = require('fs');
const dvmConfig = require('../utils/load-config').dvmConfig();

module.exports = {
    apply: function(resolver) {
        resolver.plugin('file', function(request, callback) {
        
        // Check if we're trying to resolve contentindex
        if (request.path.endsWith(dvmConfig.indexing.contentindexoutput)) {

            // Generate the index if it does not already exist
            if (fs.existsSync(request.path) === false)
            {
                require('../utils/create-content-index')();
            }
            
            callback();
        }
        else {
            callback();
        }

        });
    }
};
