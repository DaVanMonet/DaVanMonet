const express = require('express');
const cors = require('cors');
const requireUncached = require('require-uncached');
const app = express();

app.use('/static', express.static('onsitepreview/static'));
app.use('/static/css', express.static('build/css'));
app.use(cors()); // CORS headers magic

// Not really used for anything
app.get('/', function (req, res) {
  res.send('On-site preview server is running.');
})

// Send preview markup for selected state of selected component
app.get('/component-markup/:guid/:state', function (req, res) {
    const mainConfig = require('./inc/configLoader').loadConfig();
    const indexLookup = require('./inc/indexlookup');
    const snippletsExtractor = require('./inc/snippletsExtractor');

    const contentIndex = requireUncached('.' + mainConfig.indexing.output);

    // Find the correct item in the content index
    var foundItem = indexLookup.findItemWithGuid(contentIndex, req.params['guid']);

    // Load markdown
    var fs = require('fs');
    var str = fs.readFileSync(foundItem.longpath, 'utf8');

    // Extract HTML preview snippets
    var codeSnipplets = snippletsExtractor.extractHTMLSnipplets(
        snippletsExtractor.extractVariantMDSnipplets(str));
    
    // Get state index as an integer
    var state = req.params['state'] || 0;
    state = parseInt(state);

    // Send markup for the desired state
    res.send(codeSnipplets[state]);
})

// Send config JSON
app.get('/config', function (req, res) {
    res.send(require('./inc/configLoader').loadConfig());
})

// TODO: Read port from config
app.listen(9003, function () {
    console.log('On-site preview server listening on port 9003!');
})