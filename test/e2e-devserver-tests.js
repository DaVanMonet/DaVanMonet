const expect = require("chai").expect;
const fs = require('fs-extra');
const load_config = require("../dvm-build/utils/load-config");

describe("Dev Server", function () {
    let devServer;
    
    it("Starts up", async function () {
        // Allow dev server to take some time starting up
        this.timeout(20000);

        // Temporarily disable console.log
        //let consolelogtmp = console.log;
        //console.log = msg => { /* Nope! */ }
        
        devServer = require('../dvm-build/dev-server');
        await devServer.ready;

        //console.log = consolelogtmp;
    })

    it("Returns markup (On Site Preview)", async function () {
        request = require('async-request');
        let response = await request('http://localhost:9001/osp/component/example-component-guid-used-for-testing-dont-change/0/markup.html');
        
        let expectedMarkup0 = '<div class="examplecomponent">\n    <h2 class="examplecomponent-headline">Headline for example component</h2>\n</div>';
        expect(response.body).to.be.equal(expectedMarkup0);

        devServer.close();

        // Exit process (because express will be blocking)
        setTimeout(x => process.exit(0), 10);
    });
    
});