const fs = require('fs-extra');
const dvmConfig = require('../utils/load-config').dvmConfig();

module.exports = function()
{
	const packageJsonContent = require(process.cwd() + "/package.json");
	let davanmonetVersion = packageJsonContent.version;
	if(packageJsonContent)
	{
		if(packageJsonContent.devDependencies && packageJsonContent.devDependencies.davanmonet)
		{
			davanmonetVersion = packageJsonContent.devDependencies.davanmonet;
		}
		else if(packageJsonContent.dependencies && packageJsonContent.dependencies.davanmonet)
		{
			davanmonetVersion = packageJsonContent.dependencies.davanmonet;
		}
	}
	
	const versionFileContent = { "version": packageJsonContent.version, "davanmonetVersion":davanmonetVersion };
	
	const fileStringContent = JSON.stringify(versionFileContent, null, "\t");
	fs.outputFileSync(dvmConfig.directories.dist_web + "/version.json", fileStringContent);
	fs.outputFileSync(dvmConfig.directories.dist_package + "/version.json", fileStringContent);
};
