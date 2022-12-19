const fs = require("fs");
const path = require("path")
const dvmConfig = require("../utils/load-config").dvmConfig();

module.exports = class ContentIndexResolvePlugin {
  apply(resolver) {
    resolver.hooks.file.tap(
      "Content Index Resolver Plugin",
      (request) => {
        // Check if we're trying to resolve contentindex
        if (request.path === path.join(dvmConfig.indexes_abs(), dvmConfig.indexing.contentIndexOutput)) {
          // Generate the index if it does not already exist
          if (fs.existsSync(request.path) === false) {
            require("../utils/create-content-index")();
          }
        }
      }
    );
  }
};
