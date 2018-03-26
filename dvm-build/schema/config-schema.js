// https://www.npmjs.com/package/schema-object
const SchemaObject = require('schema-object');
const path = require('path');
const SDT = require("./schema-datatypes");

// Configuration schema
const ConfigSchema = new SchemaObject({
    
    project_info: {
        name: SDT.REQUIRED_NON_EMPTY_STRING,
        logo: SDT.NON_EMPTY_STRING,
        theme_style: SDT.NON_EMPTY_STRING,
        repourl:  SDT.NON_EMPTY_STRING,
        pagedata_schemaversion: { type: SDT.NON_EMPTY_STRING, default: "1.0"}
    },

    directories: {
        src: SDT.REQUIRED_NON_EMPTY_STRING,
        dist_web: SDT.REQUIRED_NON_EMPTY_STRING,
        dist_package: SDT.REQUIRED_NON_EMPTY_STRING,
        js_subDir: SDT.REQUIRED_NON_EMPTY_STRING,
        css_subDir: SDT.REQUIRED_NON_EMPTY_STRING,
        indexes: SDT.REQUIRED_NON_EMPTY_STRING,
        configs: SDT.REQUIRED_NON_EMPTY_STRING,
        cssCopies: SDT.REQUIRED_NON_EMPTY_STRING
    },

    userconfig: {
        type: String,
        default: path.resolve(__dirname, '../../configs/local-conf.json')
    },

    indexing: {
        contentIndexOutput: { type: SDT.NON_EMPTY_STRING, default: 'contentindex.json' },
        targetIndexOutput: { type: SDT.NON_EMPTY_STRING, default: 'targetindex.json' },
        keysToOutput: { type: Array, arrayType: SDT.NON_EMPTY_STRING }
    },

    compilation: {
        // TODO: Add schema for compilers and targets
        compilers: 'any',
        targets: 'any',
        sourceMaps: Boolean,
        emitCssCopies: Boolean,
        copyAssetsToFolder: Boolean,

        // This will be populated dynamically
        entry: 'any'
    },

    assets: {
        type: Array,
        arrayType: Object
    },

    env: {
        devSitePort: { type: Number, default: 9001 },
        launchBrowser: Boolean,
        enableOnSitePreview: Boolean,
        cssBreakpoints: { type: Array, arrayType: Object }
    },

    // TODO: This needs to be looked over. Copying to package can be done through assets, and destination path is set in directories.
    build: Object,

    structure: {
        type: Array,
        arrayType: Object
    },

    // This is dynamically generated
    structureFolders: Array,

    onsitepreview: {
        components: { type: Array, arrayType: Object }
    }

}, {
    
    // It should not matter which case is used in a config file
    keyIgnoreCase: true,

    methods: {
        
        // These can be used to get resolved, absolute paths
        src_abs: function () { return path.resolve(process.cwd(), this.src) },
        dist_web_abs: function () { return path.resolve(process.cwd(), this.dist_web) },
        dist_package_abs: function () { return path.resolve(process.cwd(), this.dist_package) },
        indexes_abs: function () { return path.resolve(process.cwd(), this.indexes) },
        configs_abs: function () { return path.resolve(process.cwd(), this.configs) },
        cssCopies_abs: function () { return path.resolve(process.cwd(), this.cssCopies) },

        // This one needs special attention, since it might be empty
        userconfig_abs: function () {
            if (this.userconfig && this.userconfig.lenth > 0)
                return path.resolve(process.cwd(), this.userconfig);
            else
                return path.resolve(__dirname, '../../configs/local-conf.json');
        }
    }

});

module.exports = ConfigSchema;
