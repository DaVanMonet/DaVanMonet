const expect = require("chai").expect;
const fs = require('fs-extra');
const load_config = require("../dvm-build/utils/load-config");

describe("Testing DvM build process", function () {

    it("Builds DvM", async function () {
        this.timeout(20000);

        // Temporarily disable console.log
        let consolelogtmp = console.log;
        console.log = msg => { /* Nope! */ }

        let build_dvm = require('../dvm-build/build-dvm');
        await build_dvm.ready;

        // Restore console.log
        console.log = consolelogtmp;

        [
            'dist',
            'dist/web',
            'dist/package',
            'dist/indexes',
            'dist/web/web.config',
            'dist/web/index.html',
            'dist/web/static'
        ].forEach(p => expect(fs.existsSync(p), 'path ' + p + ' is missing').to.be.true);

    })
    
});