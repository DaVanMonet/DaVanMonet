var expect    = require("chai").expect;
var load_config = require("../dvm-build/utils/load-config");

describe("Module: load-config.js", function () {
    describe("Loading config file", function () {
        it("Loads configuration from a YAML or JSON file", function () {
            let dvmConfig = load_config.dvmConfig();

            expect(dvmConfig).to.be.an('object');

            // TODO: Check config against a schema
        })
    })
});