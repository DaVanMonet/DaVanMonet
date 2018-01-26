const fs = require('fs-extra');
const dvmConfig = require('../utils/load-config').dvmConfig();
const getVersion = require('./get-version');

const createFile = function()
{
	const fileStringContent = JSON.stringify(getVersion.getJson(), null, "\t");
	fs.outputFileSync(dvmConfig.directories.dist_web + "/version.json", fileStringContent);
	fs.outputFileSync(dvmConfig.directories.dist_package + "/version.json", fileStringContent);
};

exports.createFile = createFile;
