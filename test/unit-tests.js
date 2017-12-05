var expect    = require("chai").expect;
var load_config = require("../dvm-build/utils/load-config");

describe("Module: load-config.js", function () {
    describe("Loading config file", function () {
        it("Loads configuration from a YAML or JSON file", function () {
            let dvmConfig = load_config.dvmConfig();
            expect(dvmConfig).to.be.an('object');
        })
    })
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