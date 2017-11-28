const fs = require('fs-extra');
const dvmConfig = require('../utils/load-config').dvmConfig();

module.exports = function()
{
	const packageJsonContent = require(process.cwd() + "/package.json")
	const versionFileContent = { "version": packageJsonContent.version };
	const fileStringContent = JSON.stringify(versionFileContent, null, "\t");
	fs.outputFileSync(dvmConfig.directories.dist_web + "/version.json", fileStringContent);
	fs.outputFileSync(dvmConfig.directories.dist_package + "/version.json", fileStringContent);
};
