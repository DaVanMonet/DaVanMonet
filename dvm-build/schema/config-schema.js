// https://www.npmjs.com/package/schema-object
const SDT = require("./schema-datatypes");

// Configuration schema
const ConfigSchema = {
  id: "/ConfigSchema",
  type: "object",
  properties: {
    project_info: {
      type: "object",
      properties: {
        name: SDT.REQUIRED_NON_EMPTY_STRING,
        logo: SDT.NON_EMPTY_STRING,
        theme_style: SDT.NON_EMPTY_STRING,
        repourl: SDT.NON_EMPTY_STRING,
        pagedata_schemaversion: { type: SDT.NON_EMPTY_STRING }
      }
    },

    directories: {
      type: "object",
      properties: {
        public_path: { type: SDT.NON_EMPTY_STRING },
        public_path_markdown: { type: "string" },
        use_hash: { type: "boolean" },
        src: SDT.REQUIRED_NON_EMPTY_STRING,
        dist_web: SDT.REQUIRED_NON_EMPTY_STRING,
        dist_package: SDT.REQUIRED_NON_EMPTY_STRING,
        js_subDir: SDT.REQUIRED_NON_EMPTY_STRING,
        css_subDir: SDT.REQUIRED_NON_EMPTY_STRING,
        indexes: SDT.REQUIRED_NON_EMPTY_STRING,
        configs: SDT.REQUIRED_NON_EMPTY_STRING,
        cssCopies: SDT.REQUIRED_NON_EMPTY_STRING
      }
    },

    userconfig: {
      type: "string"
    },

    indexing: {
      type: "object",
      properties: {
        contentIndexOutput: {
          type: SDT.NON_EMPTY_STRING
        },
        targetIndexOutput: {
          type: SDT.NON_EMPTY_STRING
        },
        keysToOutput: { type: "array", arrayType: SDT.NON_EMPTY_STRING }
      }
    },

    compilation: {
      type: "object",
      properties: {
        // TODO: Add schema for compilers and targets
        compilers: { type: "any" },
        targets: { type: "any" },
        sourceMaps: { type: "any" },
        emitCssCopies: { type: "boolean" },
        copyAssetsToFolder: { type: "boolean" },
        postcss: { type: "boolean" },

        // This will be populated dynamically
        entry: { type: "any" }
      }
    },

    assets: {
      type: "array",
      arrayType: "object"
    },

    env: {
      type: "object",
      properties: {
        devSitePort: { type: "number" },
        launchBrowser: { type: "boolean" },
        enableOnSitePreview: { type: "boolean" },
        cssBreakpoints: { type: "array", arrayType: "object" }
      }
    },

    // TODO: This needs to be looked over. Copying to package can be done through assets, and destination path is set in directories.
    build: { type: "object" },

    structure: {
      type: "array",
      arrayType: "object"
    },

    structureFolders: { type: "array" },

    onsitepreview: {
      type: "object",
      properties: {
        components: { type: "array", arrayType: "object" }
      }
    }
  }
};

module.exports = ConfigSchema;
