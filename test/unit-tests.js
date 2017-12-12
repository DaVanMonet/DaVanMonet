const expect = require("chai").expect;
const fs = require('fs-extra');
const load_config = require("../dvm-build/utils/load-config");

describe("Module: load-config.js", function () {
    describe("Loading config file", function () {
        it("Loads configuration from a YAML or JSON file", function () {
            let dvmConfig = load_config.dvmConfig();
            expect(dvmConfig).to.be.an('object');
        })
    })
});

describe("Module: create-content-index.js", function () {
    it("Generates content index", function () {
        let dvmConfig = load_config.dvmConfig();
        let create_content_index = require("../dvm-build/utils/create-content-index");
        let file_path = dvmConfig.directories.indexes + '/' + dvmConfig.indexing.contentIndexOutput;

        // Remove old file first if it exists
        if (fs.existsSync(file_path))
            fs.unlinkSync(file_path);

        // Generate a new content index
        create_content_index();

        // Verify that the content index file exists
        let file_exists = fs.existsSync(file_path);
        expect(file_exists).to.be.true;

        // Check file against schema
        let ci_schema = require('./content-index.schema');
        let validate = require('jsonschema').validate;
        let result = validate(JSON.parse(fs.readFileSync(file_path)), ci_schema);
        if (result.errors.length > 0) console.log(result);
        expect(result.errors.length).to.be.equal(0);
    });
});

describe("Module: On Site Preview", function () {
    describe("indexLookup.js", function () {
        it("Lookup GUID in the contentindex", function () {
            const requireUncached = require('require-uncached');
            const indexLookup = require('../dvm-build/onsitepreview/inc/indexlookup');

            let dvmConfig = load_config.dvmConfig();
            const contentIndex = requireUncached(dvmConfig.directories.indexes_abs() + '/' + dvmConfig.indexing.contentIndexOutput);
            var foundItem = indexLookup.findItemWithGuid(contentIndex, 'button-guid-used-for-testing-dont-change');
            
            expect(foundItem).to.be.an('object');
            expect(foundItem.filename).to.equal('primary.md');
            expect(foundItem.filepath).to.be.a('string');
            expect(foundItem.shortpath).to.be.a('string');
            expect(foundItem.longpath).to.be.a('string');
            expect(foundItem.type).to.equal('file');
            expect(foundItem.title).to.be.a('string');
            expect(foundItem.guid).to.equal('button-guid-used-for-testing-dont-change');
            expect(foundItem.variantid).to.be.a('string');
            expect(foundItem.componentid).to.be.a('string');
        })
    })
});
