const cors = require('cors');
const requireUncached = require('require-uncached');
const fs = require('fs-extra');
const chalk = require('chalk');
const eol = require('eol');
const express = require('express');

const dvmConfig = require('../utils/load-config').dvmConfig();

exports.startServer = function(app) {

    function getSnipplets(guid) {
        const indexLookup = require('./inc/indexlookup');
        const snippletsExtractor = require('./inc/snippletsExtractor');
    
        const contentIndex = requireUncached(dvmConfig.directories.indexes_abs() + '/' + dvmConfig.indexing.contentIndexOutput);
    
        // Find the correct item in the content index
        var foundItem = indexLookup.findItemWithGuid(contentIndex, guid);
    
        // Load markdown
        var str = eol.lf(fs.readFileSync(foundItem.longpath, 'utf8'));
    
        // Extract HTML preview snippets
        var codeSnipplets = snippletsExtractor.extractHTMLSnipplets(
            snippletsExtractor.extractVariantMDSnipplets(str));
    
        return codeSnipplets;
    }

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
        
        const codeSnipplets = getSnipplets(req.params['guid']);
        
        // Get state index as an integer
        var state = req.params['state'] || 0;
        state = parseInt(state);

        // Send markup for the desired state
        res.send(codeSnipplets[state]);
    });

    // Send preview markup for selected state of selected component
    app.get(subdir + '/standalone/component/:guid/:state/preview.html', function (req, res) {
        
        let html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Component Test Bed Preview</title>";

        // Add css entries
        for (let entry of Object.keys(dvmConfig.compilation.targets).filter(e => e.endsWith('.css')))
        {
            // Check if this entry should be included
            if (typeof dvmConfig.onsitepreview.styleTargets === "object"
            && dvmConfig.onsitepreview.styleTargets.indexOf(entry) < 0)
            {
                continue;
            }

            html += '<link rel="stylesheet" href="/static/css/' + entry + '" type="text/css" />';
        }

        html += "</head><body>";

        const codeSnipplets = getSnipplets(req.params['guid']);
        
        // Get state index as an integer
        var state = req.params['state'] || 0;
        state = parseInt(state);

        html += codeSnipplets[state];

        html += "</body></html>"

        // Send markup for the desired state
        res.send(html);
    });

    // Send config JSON
    app.get(subdir + '/config', function (req, res) {
        res.send(dvmConfig);
    })



    console.log(chalk.green(">> ...Done!"));
}