const getJson = function()
{
    var packageJsonContent = null;

    // When compiled via webpack for use in a browser, we'll use the
    // defined constant __PACKAGE_JSON__, otherwise we'll resolve the path dynamically
    if(typeof __PACKAGE_JSON__ !== "undefined")
        packageJsonContent = require(__PACKAGE_JSON__);
    else
        packageJsonContent = require(process.cwd() + "/package.json");

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
	
	return { "version": packageJsonContent.version, "davanmonetVersion":davanmonetVersion };
}

exports.getJson = getJson;