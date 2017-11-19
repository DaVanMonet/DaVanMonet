const fs = require('fs');
const dvmConfig = require('./load-config')();

module.exports = {
    apply: function(resolver) {
        resolver.plugin('file', function(request, callback) {
        
        // Check if we're trying to resolve contentindex
        if (request.path.endsWith(dvmConfig.indexing.contentindexoutput)) {

            // Generate the index if it does not already exist
            if (fs.existsSync(request.path) === false)
                require('./create-content-index')();
            
            callback();
        }
        else {
            callback();
        }

        });
    }
};