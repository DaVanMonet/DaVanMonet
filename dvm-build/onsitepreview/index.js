const cors = require('cors');
const requireUncached = require('require-uncached');
const fs = require('fs-extra');
const chalk = require('chalk');
const eol = require('eol');
const express = require('express');

const dvmConfig = require('../utils/load-config').dvmConfig();

exports.startServer = function(app) {

    console.log(chalk.magenta(">> Starting OSP..."));

    const subdir = "/osp";

    //app.use(subdir + '/static', express.static('onsitepreview/static'));
    //app.use(subdir + '/static/css', express.static('build/css'));
    app.use(cors()); // CORS headers magic

     // Default message
    app.get(subdir + '/index.html', function (req, res) {
        res.send('<h1 style="font-family:sans-serif">On-site preview server is running.</h1><h2 style="font-family:sans-serif">Look in README.md to learn how to use the on-site preview functionality</h2>');
    })

    // Send preview markup for selected state of selected component
    app.get(subdir + '/component/:guid/:state/markup.html', function (req, res) {
        
        const indexLookup = require('./inc/indexlookup');
        const snippletsExtractor = require('./inc/snippletsExtractor');

        const contentIndex = requireUncached(dvmConfig.directories.indexes_abs + '/' + dvmConfig.indexing.contentIndexOutput);

        // Find the correct item in the content index
        var foundItem = indexLookup.findItemWithGuid(contentIndex, req.params['guid']);

        // Load markdown
        var str = eol.lf(fs.readFileSync(foundItem.longpath, 'utf8'));

        // Extract HTML preview snippets
        var codeSnipplets = snippletsExtractor.extractHTMLSnipplets(
            snippletsExtractor.extractVariantMDSnipplets(str));
        
        // Get state index as an integer
        var state = req.params['state'] || 0;
        state = parseInt(state);

        // Send markup for the desired state
        res.send(codeSnipplets[state]);
    });

    // Send config JSON
    app.get(subdir + '/config', function (req, res) {
        res.send(dvmConfig);
    })

    console.log(chalk.green(">> ...Done!"));
}