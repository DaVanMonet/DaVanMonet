const path = require("path");

module.exports = {
  project_info: {
    pagedata_schemaversion: "1.0"
  },
  directories: {
    public_path: "/",
    use_hash: false
  },
  userconfig: path.resolve(__dirname, "../../configs/local-conf.yml"),
  indexing: {
    contentIndexOutput: "contentindex.json",
    targetIndexOutput: "targetindex.json"
  },
  env: {
    devSitePort: 9001
  }
};
